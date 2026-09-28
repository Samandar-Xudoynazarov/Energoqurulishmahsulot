"use client";

import { useEffect, useState } from 'react';
import { ContentCard, Language, SiteContent } from '../../types';
import FileUploader from '../components/FileUploader';
import MultiImageUploader from '../components/MultiImageUploader';
import LangTabs from '../components/LangTabs';

type Section = keyof SiteContent;

const SECTIONS: { key: Section; title: string; icon: string; desc: string; imageLabel: string; imageHint: string; gallery?: boolean; body?: boolean; max: number }[] = [
  {
    key: 'process', title: 'Ishlab chiqarish bosqichlari', icon: 'fa-industry',
    desc: "Har bir bosqich kartasining tepasida rasm chiqadi. Rasm bo'lmasa — belgi (ikonka).",
    imageLabel: 'Bosqich rasmi', imageHint: "Gorizontal rasm (4:3) — shu bosqich jarayoni", max: 8,
  },
  {
    key: 'team', title: 'Jamoa va texnika', icon: 'fa-users',
    desc: "Mahsulotlardan alohida bo'lim: jamoa, zamonaviy uskunalar, avtopark. Kartani bosganda rasm galereyasi va batafsil matn ochiladi.",
    imageLabel: 'Asosiy rasm (karta muqovasi)', imageHint: 'Gorizontal rasm (16:10)', gallery: true, body: true, max: 6,
  },
  {
    key: 'why', title: '«Nima uchun aynan bizni tanlashadi?»', icon: 'fa-star',
    desc: "Katta kartalar — rasm kartaning to'liq foni bo'ladi, ustiga matn yoziladi.",
    imageLabel: 'Karta fon rasmi', imageHint: "Kattaroq rasm; pastki qismi qoraytiriladi — matn o'qiladi", max: 6,
  },
];

const ICONS = ['fa-users', 'fa-industry', 'fa-truck', 'fa-tools', 'fa-hard-hat', 'fa-clipboard-check', 'fa-fill-drip', 'fa-flask', 'fa-shipping-fast', 'fa-clock', 'fa-check-circle', 'fa-award', 'fa-shield-alt', 'fa-cogs', 'fa-bolt', 'fa-warehouse', 'fa-cubes', 'fa-handshake', 'fa-star', 'fa-ruler-combined'];

const empty = () => ({ uz: '', ru: '', en: '' });

export default function AdminContentPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState<Section>('process');
  const [lang, setLang] = useState<Language>('uz');
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => r.json())
      .then((d) => setContent(d.content))
      .catch(() => setMsg({ ok: false, text: "Ma'lumotni yuklab bo'lmadi" }));
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  if (!content) return <div className="a-loading">{msg?.text || <><i className="fas fa-spinner fa-spin"></i> Yuklanmoqda...</>}</div>;

  const sec = SECTIONS.find((s) => s.key === tab)!;
  const cards = content[tab];

  function update(list: ContentCard[]) {
    setContent((c) => (c ? { ...c, [tab]: list } : c));
    setDirty(true);
    setMsg(null);
  }
  const patch = (i: number, p: Partial<ContentCard>) => update(cards.map((c, k) => (k === i ? { ...c, ...p } : c)));
  const patchText = (i: number, field: 'title' | 'desc' | 'body', v: string) =>
    patch(i, { [field]: { ...(cards[i][field] || empty()), [lang]: v } });
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= cards.length) return;
    const next = [...cards];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  }
  function add() {
    update([...cards, { id: `${tab}-${Date.now().toString(36)}`, icon: 'fa-star', image: '', images: [], title: empty(), desc: empty(), body: empty() }]);
  }
  function remove(i: number) {
    if (!confirm("Bu kartani o'chirishni tasdiqlaysizmi? (Saqlash tugmasini bosgandan keyin saytdan o'chadi)")) return;
    update(cards.filter((_, k) => k !== i));
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Xatolik');
      setContent(d.content);
      setDirty(false);
      setMsg({ ok: true, text: "Saqlandi ✓ — saytda darhol ko'rinadi" });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Xatolik' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="a-page-head">
        <div>
          <h1>Sayt bo&apos;limlari</h1>
          <p>Bosh sahifadagi bo&apos;limlar matni va rasmlari. Barcha bo&apos;limlar bitta «Saqlash» bilan saqlanadi.</p>
        </div>
      </div>

      <div className="a-tabs">
        {SECTIONS.map((s) => (
          <button key={s.key} type="button" className={`a-tab${tab === s.key ? ' on' : ''}`} onClick={() => setTab(s.key)}>
            <i className={`fas ${s.icon}`}></i> {s.title} <small style={{ opacity: 0.6 }}>{content[s.key].length}</small>
          </button>
        ))}
      </div>

      <div className="a-card">
        <div className="a-card-head">
          <div>
            <h2><i className={`fas ${sec.icon}`}></i> {sec.title}</h2>
            <p>{sec.desc}</p>
          </div>
          <LangTabs value={lang} onChange={setLang} missing={cards.map((c) => c.title)} />
        </div>

        {cards.map((c, i) => (
          <div key={c.id} className="a-editor-card">
            <div className="a-editor-head">
              <span className="num">{i + 1}</span>
              <b>{c.title[lang] || c.title.uz || 'Nomsiz karta'}</b>
              <button type="button" className="a-btn a-btn-sm a-btn-ghost a-icon-btn" onClick={() => move(i, -1)} disabled={i === 0} title="Yuqoriga"><i className="fas fa-arrow-up"></i></button>
              <button type="button" className="a-btn a-btn-sm a-btn-ghost a-icon-btn" onClick={() => move(i, 1)} disabled={i === cards.length - 1} title="Pastga"><i className="fas fa-arrow-down"></i></button>
              <button type="button" className="a-btn a-btn-sm a-btn-danger a-icon-btn" onClick={() => remove(i)} title="O'chirish"><i className="fas fa-trash-alt"></i></button>
            </div>
            <div className="a-editor-body">
              <div>
                <FileUploader label={sec.imageLabel} hint={sec.imageHint} kind="image" value={c.image} onUploaded={(url) => patch(i, { image: url })} onRemove={() => patch(i, { image: '' })} />
                <div className="a-field">
                  <label>Belgi (ikonka)</label>
                  <div className="a-icon-pick">
                    {ICONS.map((ic) => (
                      <button key={ic} type="button" className={c.icon === ic ? 'on' : ''} onClick={() => patch(i, { icon: ic })} title={ic}>
                        <i className={`fas ${ic}`}></i>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div className="a-field">
                  <label>Sarlavha ({lang})</label>
                  <input value={c.title[lang]} onChange={(e) => patchText(i, 'title', e.target.value)} />
                </div>
                <div className="a-field">
                  <label>Qisqa matn ({lang})</label>
                  <textarea rows={2} value={c.desc[lang]} onChange={(e) => patchText(i, 'desc', e.target.value)} />
                </div>
                {sec.body && (
                  <div className="a-field">
                    <label>Batafsil matn ({lang}) — kartani bosganda ochiladi</label>
                    <textarea rows={5} value={c.body?.[lang] || ''} onChange={(e) => patchText(i, 'body', e.target.value)} />
                  </div>
                )}
                {sec.gallery && (
                  <MultiImageUploader
                    label="Qo'shimcha rasmlar (galereya)"
                    hint="Kartani bosganda asosiy rasm bilan birga ko'rsatiladi"
                    coverLabel={false}
                    value={c.images || []}
                    onChange={(images) => patch(i, { images })}
                  />
                )}
              </div>
            </div>
          </div>
        ))}

        {cards.length < sec.max && (
          <button type="button" className="a-btn" style={{ marginTop: 14 }} onClick={add}>
            <i className="fas fa-plus"></i> Karta qo&apos;shish
          </button>
        )}
      </div>

      <div className="a-savebar">
        {msg && <div className={`a-msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
        {dirty && !msg && <span className="a-hint" style={{ marginRight: 'auto' }}><i className="fas fa-circle" style={{ color: '#f79009', fontSize: 8 }}></i> Saqlanmagan o&apos;zgarishlar bor</span>}
        <button type="button" disabled={saving || !dirty} className="a-btn a-btn-primary" onClick={save}>
          {saving ? <><i className="fas fa-spinner fa-spin"></i> Saqlanmoqda...</> : <><i className="fas fa-check"></i> Saqlash</>}
        </button>
      </div>
    </div>
  );
}
