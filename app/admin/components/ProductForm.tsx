"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product, ProductSpec, Language, Category } from '../../types';
import FileUploader from './FileUploader';
import LangTabs, { LANGS } from './LangTabs';
import { fmtSum } from '../lib/format';

// Rus tilidagi matnlarda Lotin harflari (a-z, A-Z) ishlatilishini taqiqlaymiz.
// Mahsulot kodlari (Ф5-УСУ kabi) bu tekshiruvga kirmaydi — faqat nomi/teg/tavsif/tex.jadval uchun.
function hasLatinLetters(text: string): boolean {
  return /[a-zA-Z]/.test(text);
}

function emptyProduct(): Product {
  return {
    code: '',
    category: '',
    name: { uz: '', ru: '', en: '' },
    tag: { uz: '', ru: '', en: '' },
    description: { uz: '', ru: '', en: '' },
    image: '',
    specs: [],
    order: 0,
    price: undefined,
  };
}

export default function ProductForm({ initial, isEdit }: { initial?: Product; isEdit?: boolean }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product>(initial || emptyProduct());
  const [priceText, setPriceText] = useState(initial?.price ? String(initial.price) : '');
  const [categories, setCategories] = useState<Category[]>([]);
  const [lang, setLang] = useState<Language>('uz');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        const cats: Category[] = (data.categories || []).filter((c: Category) => c.id !== 'jamoa');
        setCategories(cats);
        setProduct((p) => (p.category ? p : { ...p, category: cats[0]?.id || '' }));
      })
      .catch(() => {});
  }, []);

  const ruBad = (s: string) => lang === 'ru' && hasLatinLetters(s);

  function updateField(field: 'name' | 'tag' | 'description', value: string) {
    setProduct((p) => ({ ...p, [field]: { ...p[field], [lang]: value } }));
  }
  function addSpec() {
    const s: ProductSpec = { id: `spec_${Date.now()}`, label: { uz: '', ru: '', en: '' }, value: '' };
    setProduct((p) => ({ ...p, specs: [...p.specs, s] }));
  }
  const updateSpecLabel = (id: string, value: string) =>
    setProduct((p) => ({ ...p, specs: p.specs.map((s) => (s.id === id ? { ...s, label: { ...s.label, [lang]: value } } : s)) }));
  const updateSpecValue = (id: string, value: string) =>
    setProduct((p) => ({ ...p, specs: p.specs.map((s) => (s.id === id ? { ...s, value } : s)) }));
  const removeSpec = (id: string) => setProduct((p) => ({ ...p, specs: p.specs.filter((s) => s.id !== id) }));
  function moveSpec(i: number, dir: -1 | 1) {
    setProduct((p) => {
      const j = i + dir;
      if (j < 0 || j >= p.specs.length) return p;
      const specs = [...p.specs];
      [specs[i], specs[j]] = [specs[j], specs[i]];
      return { ...p, specs };
    });
  }

  const priceNum = Math.round(Number(priceText.replace(/[\s,]/g, '')));
  const priceValid = !priceText.trim() || (Number.isFinite(priceNum) && priceNum > 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!product.code.trim()) return setError('Mahsulot kodi kiritilishi shart');
    if (!product.name.uz.trim() || !product.name.ru.trim() || !product.name.en.trim()) {
      return setError('Nom barcha 3 tilda (uz/ru/en) kiritilishi shart');
    }
    if (!priceValid) return setError("Narx noto'g'ri — faqat raqam kiriting (masalan: 6121507)");
    const ruFieldsInvalid =
      hasLatinLetters(product.name.ru) || hasLatinLetters(product.tag.ru) || hasLatinLetters(product.description.ru) || product.specs.some((s) => hasLatinLetters(s.label.ru));
    if (ruFieldsInvalid) {
      setLang('ru');
      return setError('Rus tilidagi maydonlarda Lotin harflari ishlatilmasin — faqat Kirill alifbosida yozing (masalan: "Фундамент", "Опора", "Лоток").');
    }

    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/products/${encodeURIComponent(product.code)}` : '/api/admin/products';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, price: priceText.trim() ? priceNum : 0 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Saqlashda xatolik');
        setSaving(false);
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError("Server bilan bog'lanishda xatolik");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="a-page-head">
        <div>
          <h1>{isEdit ? `Tahrirlash: ${product.code}` : 'Yangi mahsulot'}</h1>
          <p><Link href="/admin"><i className="fas fa-arrow-left"></i> Mahsulotlar ro&apos;yxati</Link></p>
        </div>
      </div>

      <div className="a-card">
        <div className="a-card-head"><h2><i className="fas fa-info-circle"></i> Asosiy ma&apos;lumot</h2></div>
        <div className="a-grid-3">
          <div className="a-field">
            <label>Mahsulot kodi</label>
            <input value={product.code} onChange={(e) => setProduct((p) => ({ ...p, code: e.target.value }))} disabled={isEdit} placeholder="Ф5-УСУ" />
            {isEdit && <span className="a-hint">Kod saytdagi manzil (URL) — o&apos;zgarmaydi</span>}
          </div>
          <div className="a-field">
            <label>Kategoriya</label>
            <select value={product.category} onChange={(e) => setProduct((p) => ({ ...p, category: e.target.value }))}>
              {categories.length === 0 && <option value="">Yuklanmoqda...</option>}
              {[...categories].sort((a, b) => a.order - b.order).map((c) => (
                <option key={c.id} value={c.id}>{c.name.uz}</option>
              ))}
            </select>
            <Link href="/admin/categories" target="_blank" className="a-hint">+ Yangi kategoriya (yangi oynada)</Link>
          </div>
          <div className="a-field">
            <label>Narx — QQSsiz, 1 dona</label>
            <div className="a-input-group">
              <input value={priceText} onChange={(e) => setPriceText(e.target.value)} inputMode="numeric" placeholder="masalan: 6121507" className={priceValid ? '' : 'a-invalid'} />
              <span>so&apos;m</span>
            </div>
            <span className="a-hint">
              {priceText.trim() && priceValid ? <>Saytda: <b>{fmtSum(priceNum)} so&apos;m</b> (QQSsiz)</> : "Bo'sh qoldirilsa saytda «Narxi so'rov bo'yicha» chiqadi"}
            </span>
          </div>
        </div>
      </div>

      <div className="a-card">
        <div className="a-card-head">
          <h2><i className="fas fa-align-left"></i> Matnlar</h2>
          <LangTabs value={lang} onChange={setLang} missing={[product.name, product.description]} />
        </div>
        {lang === 'ru' && (
          <div className="a-msg warn"><i className="fas fa-exclamation-triangle"></i> Faqat Kirill alifbosida yozing (masalan: «Фундамент Ф5-УСУ»). Lotin harflari bo&apos;lsa, forma saqlanmaydi.</div>
        )}
        <div className="a-grid-2">
          <div className="a-field">
            <label>Nomi ({lang})</label>
            <input value={product.name[lang]} onChange={(e) => updateField('name', e.target.value)} className={ruBad(product.name.ru) ? 'a-invalid' : ''} />
            {ruBad(product.name.ru) && <span className="a-field-warn">Lotin harflari topildi — Kirillchaga o&apos;zgartiring</span>}
          </div>
          <div className="a-field">
            <label>Teg / qisqa yorliq ({lang})</label>
            <input value={product.tag[lang]} onChange={(e) => updateField('tag', e.target.value)} className={ruBad(product.tag.ru) ? 'a-invalid' : ''} />
            {ruBad(product.tag.ru) && <span className="a-field-warn">Lotin harflari topildi — Kirillchaga o&apos;zgartiring</span>}
          </div>
        </div>
        <div className="a-field">
          <label>Tavsif ({lang})</label>
          <textarea
            rows={12}
            value={product.description[lang]}
            onChange={(e) => updateField('description', e.target.value)}
            className={ruBad(product.description.ru) ? 'a-invalid' : ''}
            placeholder="Qayerda ishlatiladi, qanday tayyorlanadi, afzalliklari... Xatboshilarni bo'sh qator bilan ajrating."
          />
          <span className="a-hint">{product.description[lang].length} belgi · bo&apos;sh qator — yangi xatboshi</span>
          {ruBad(product.description.ru) && <span className="a-field-warn">Lotin harflari topildi — Kirillchaga o&apos;zgartiring</span>}
        </div>
      </div>

      <div className="a-card">
        <div className="a-card-head">
          <div>
            <h2><i className="fas fa-list-ul"></i> Xarakteristikalar</h2>
            <p>Saytda jadval ko&apos;rinishida, uning ostida narx va «Sotib olish» tugmasi chiqadi</p>
          </div>
          <button type="button" onClick={addSpec} className="a-btn a-btn-sm"><i className="fas fa-plus"></i> Qator qo&apos;shish</button>
        </div>
        {product.specs.length === 0 && <p className="a-hint">Hali qator yo&apos;q. Masalan: «Beton markasi» — «М 400».</p>}
        {product.specs.length > 0 && (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr><th>Nomi ({lang})</th><th>Qiymati</th><th className="hide-sm">Boshqa tillarda</th><th></th></tr>
              </thead>
              <tbody>
                {product.specs.map((spec, i) => (
                  <tr key={spec.id}>
                    <td style={{ minWidth: 180 }}>
                      <input className={`a-input${ruBad(spec.label.ru) ? ' a-invalid' : ''}`} placeholder={`Nomi (${lang})`} value={spec.label[lang]} onChange={(e) => updateSpecLabel(spec.id, e.target.value)} />
                    </td>
                    <td style={{ minWidth: 150 }}>
                      <input className="a-input" placeholder="masalan: М 400" value={spec.value} onChange={(e) => updateSpecValue(spec.id, e.target.value)} />
                    </td>
                    <td className="hide-sm"><span className="a-sub">{LANGS.filter((t) => t.value !== lang).map((t) => spec.label[t.value] || '—').join(' / ')}</span></td>
                    <td>
                      <div className="a-row-actions">
                        <button type="button" className="a-btn a-btn-sm a-btn-ghost a-icon-btn" onClick={() => moveSpec(i, -1)} disabled={i === 0} title="Yuqoriga"><i className="fas fa-arrow-up"></i></button>
                        <button type="button" className="a-btn a-btn-sm a-btn-ghost a-icon-btn" onClick={() => moveSpec(i, 1)} disabled={i === product.specs.length - 1} title="Pastga"><i className="fas fa-arrow-down"></i></button>
                        <button type="button" className="a-btn a-btn-sm a-btn-danger a-icon-btn" onClick={() => removeSpec(spec.id)} title="O'chirish"><i className="fas fa-times"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="a-card">
        <div className="a-card-head"><h2><i className="fas fa-paperclip"></i> Rasm va hujjatlar</h2></div>
        <div className="a-grid-3">
          <FileUploader label="Mahsulot rasmi" kind="image" value={product.image} onUploaded={(url) => setProduct((p) => ({ ...p, image: url }))} onRemove={() => setProduct((p) => ({ ...p, image: '' }))} />
          <FileUploader label="Sertifikat (PDF)" kind="pdf" value={product.certificatePdf} onUploaded={(url) => setProduct((p) => ({ ...p, certificatePdf: url }))} onRemove={() => setProduct((p) => ({ ...p, certificatePdf: '' }))} />
          <FileUploader label="Pasport (PDF)" kind="pdf" value={product.passportPdf} onUploaded={(url) => setProduct((p) => ({ ...p, passportPdf: url }))} onRemove={() => setProduct((p) => ({ ...p, passportPdf: '' }))} />
        </div>
      </div>

      <div className="a-savebar">
        {error && <div className="a-msg err">{error}</div>}
        <button type="button" onClick={() => router.push('/admin')} className="a-btn">Bekor qilish</button>
        <button type="submit" disabled={saving} className="a-btn a-btn-primary">
          {saving ? <><i className="fas fa-spinner fa-spin"></i> Saqlanmoqda...</> : <><i className="fas fa-check"></i> Saqlash</>}
        </button>
      </div>
    </form>
  );
}
