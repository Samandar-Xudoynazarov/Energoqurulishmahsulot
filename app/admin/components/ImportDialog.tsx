"use client";

import { useEffect, useState } from 'react';
import { Product } from '../../types';
import { fmtSum } from '../lib/format';

interface Change {
  code: string;
  catalogCode: string;
  action: 'add' | 'update' | 'same';
  fields: string[];
  price: number;
  oldPrice?: number;
}

const OPTS = [
  { key: 'addNew', title: "Yangi mahsulotlarni qo'shish", desc: "Saytda yo'q mahsulotlar katalogdan qo'shiladi (rasmsiz — keyin yuklaysiz)" },
  { key: 'prices', title: 'Narxlarni yangilash', desc: 'QQSsiz narx PTO kalkulyatsiyasidan olinadi' },
  { key: 'specs', title: 'Xarakteristikalarni yangilash', desc: "O'lcham, og'irlik, beton klassi, seriya va h.k. katalogdagi qiymatlar bilan yangilanadi. O'zingiz qo'shgan boshqa qatorlar saqlanadi" },
  { key: 'texts', title: 'Tavsiflarni kengaytirish', desc: "Faqat qisqa (boshlang'ich) tavsifli mahsulotlarga — siz yozgan uzun matnlarga tegmaydi" },
] as const;

type Opts = Record<(typeof OPTS)[number]['key'], boolean>;

/** PTO katalogidan mahsulotlarni qo'shish/yangilash — avval nima o'zgarishini ko'rsatadi */
export default function ImportDialog({ onClose, onDone }: { onClose: () => void; onDone: (p: Product[]) => void }) {
  const [opts, setOpts] = useState<Opts>({ addNew: true, prices: true, specs: true, texts: true });
  const [changes, setChanges] = useState<Change[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    setChanges(null);
    const qs = Object.entries(opts).map(([k, v]) => `${k}=${v ? 1 : 0}`).join('&');
    fetch(`/api/admin/products/import?${qs}`)
      .then((r) => r.json())
      .then((d) => setChanges(d.changes || []))
      .catch(() => setMsg({ ok: false, text: "Ko'rib chiqishni yuklab bo'lmadi" }));
  }, [opts]);

  const added = changes?.filter((c) => c.action === 'add') || [];
  const updated = changes?.filter((c) => c.action === 'update') || [];

  async function apply() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opts),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Xatolik');
      onDone(d.products);
      setMsg({ ok: true, text: `Tayyor: ${added.length} ta qo'shildi, ${updated.length} ta yangilandi` });
      setChanges([]);
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Xatolik' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="a-modal-bg" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="a-modal" role="dialog" aria-modal="true">
        <div className="a-modal-head">
          <h2><i className="fas fa-file-import"></i> PTO katalogidan yangilash</h2>
          <button type="button" className="a-btn a-btn-ghost a-icon-btn" onClick={onClose} aria-label="Yopish"><i className="fas fa-times"></i></button>
        </div>
        <div className="a-modal-body">
          <div className="a-msg info">
            <i className="fas fa-info-circle"></i>
            <span>Katalog — PTO kalkulyatsiyasi va zavod ma&apos;lumotlari jadvali (2026-oktabr, 55 ta mahsulot). Rasmlar, PDF hujjatlar va kategoriyalar <b>o&apos;zgartirilmaydi</b>. Narxlarni keyin har bir mahsulotda qo&apos;lda ham o&apos;zgartirish mumkin.</span>
          </div>
          <div className="a-grid-2" style={{ marginBottom: 16 }}>
            {OPTS.map((o) => (
              <label key={o.key} className="a-check">
                <input type="checkbox" checked={opts[o.key]} onChange={(e) => setOpts((s) => ({ ...s, [o.key]: e.target.checked }))} />
                <div><b>{o.title}</b><span>{o.desc}</span></div>
              </label>
            ))}
          </div>

          {!changes && <div className="a-loading"><i className="fas fa-spinner fa-spin"></i> Hisoblanmoqda...</div>}
          {changes && (added.length > 0 || updated.length > 0) && (
            <div className="a-diff">
              <table className="a-table">
                <thead>
                  <tr><th>Mahsulot</th><th>O&apos;zgarish</th><th className="n">Narx (QQSsiz)</th></tr>
                </thead>
                <tbody>
                  {[...added, ...updated].map((c) => (
                    <tr key={c.catalogCode}>
                      <td>
                        <span className="a-code">{c.code}</span>
                        {c.code !== c.catalogCode && <span className="a-sub">katalogda: {c.catalogCode}</span>}
                      </td>
                      <td>
                        {c.action === 'add' ? <span className="a-badge ok">yangi</span> : c.fields.map((f) => <span key={f} className="a-badge blue" style={{ marginRight: 4 }}>{f}</span>)}
                      </td>
                      <td className="n">
                        {c.oldPrice && c.oldPrice !== c.price && <span className="a-sub" style={{ textDecoration: 'line-through' }}>{fmtSum(c.oldPrice)}</span>}
                        <b>{fmtSum(c.price) || '—'}</b>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {changes && added.length === 0 && updated.length === 0 && !msg && (
            <div className="a-empty"><i className="fas fa-check-circle"></i>Hamma narsa katalog bilan bir xil — o&apos;zgarish yo&apos;q</div>
          )}
          {msg && <div className={`a-msg ${msg.ok ? 'ok' : 'err'}`} style={{ marginTop: 14 }}>{msg.text}</div>}
        </div>
        <div className="a-modal-foot">
          <span className="a-hint" style={{ marginRight: 'auto' }}>
            {changes ? `${added.length} ta yangi · ${updated.length} ta yangilanadi` : ''}
          </span>
          <button type="button" className="a-btn" onClick={onClose}>Yopish</button>
          <button type="button" className="a-btn a-btn-primary" disabled={busy || !changes || (added.length === 0 && updated.length === 0)} onClick={apply}>
            {busy ? <><i className="fas fa-spinner fa-spin"></i> Saqlanmoqda...</> : <><i className="fas fa-check"></i> Qo&apos;llash</>}
          </button>
        </div>
      </div>
    </div>
  );
}
