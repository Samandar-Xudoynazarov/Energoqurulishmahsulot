"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Product, Category } from '../types';
import { fmtSum } from './lib/format';
import { adminProductApi, adminProductEdit, mainImage, productImages } from '../lib/product-utils';
import ImportDialog from './components/ImportDialog';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [importOpen, setImportOpen] = useState(false);

  useEffect(() => {
    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setError("Mahsulotlarni yuklab bo'lmadi"));
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  // Jamoa/texnika endi «Sayt bo'limlari»da — mahsulotlar ro'yxatida ko'rsatilmaydi
  const real = useMemo(() => (products || []).filter((p) => p.category !== 'jamoa'), [products]);
  const cats = categories.filter((c) => c.id !== 'jamoa').sort((a, b) => a.order - b.order);
  const shown = real.filter(
    (p) => (!cat || p.category === cat) && (!q || `${p.code} ${p.name.uz} ${p.name.ru}`.toLowerCase().includes(q.toLowerCase()))
  );
  const withPrice = real.filter((p) => p.price && p.price > 0).length;
  const noImage = real.filter((p) => !mainImage(p)).length;

  const categoryLabel = (id: string) => categories.find((c) => c.id === id)?.name.uz || id;

  async function handleDelete(code: string) {
    if (!confirm(`"${code}" mahsulotini o'chirishni tasdiqlaysizmi?`)) return;
    setDeletingCode(code);
    try {
      const res = await fetch(adminProductApi(code), { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) setProducts(data.products);
      else alert(data.error || "O'chirishda xatolik");
    } finally {
      setDeletingCode(null);
    }
  }

  return (
    <div>
      <div className="a-page-head">
        <div>
          <h1>Mahsulotlar</h1>
          <p>Saytdagi katalog: narx (QQSsiz), xarakteristika, tavsif, rasm va hujjatlar.</p>
        </div>
        <div className="a-actions">
          <button type="button" className="a-btn" onClick={() => setImportOpen(true)}>
            <i className="fas fa-file-import"></i> PTO katalogidan yangilash
          </button>
          <Link href="/admin/products/new" className="a-btn a-btn-primary">
            <i className="fas fa-plus"></i> Yangi mahsulot
          </Link>
        </div>
      </div>

      {products && (
        <div className="a-stats">
          <div className="a-stat"><span className="a-stat-ic"><i className="fas fa-cubes"></i></span><div><b>{real.length}</b><span>Mahsulotlar</span></div></div>
          <div className="a-stat"><span className="a-stat-ic ok"><i className="fas fa-tag"></i></span><div><b>{withPrice}</b><span>Narxi ko&apos;rsatilgan</span></div></div>
          <div className="a-stat"><span className="a-stat-ic warn"><i className="fas fa-image"></i></span><div><b>{noImage}</b><span>Rasmsiz</span></div></div>
          <div className="a-stat"><span className="a-stat-ic"><i className="fas fa-layer-group"></i></span><div><b>{cats.length}</b><span>Kategoriyalar</span></div></div>
        </div>
      )}

      {error && <div className="a-msg err">{error}</div>}

      <div className="a-card flush">
        <div className="a-toolbar">
          <div className="a-search">
            <i className="fas fa-search"></i>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Kod yoki nom bo'yicha qidirish" />
          </div>
          <div className="a-chips">
            <button type="button" className={`a-chip${!cat ? ' on' : ''}`} onClick={() => setCat('')}>Hammasi<small>{real.length}</small></button>
            {cats.map((c) => (
              <button type="button" key={c.id} className={`a-chip${cat === c.id ? ' on' : ''}`} onClick={() => setCat(c.id)}>
                {c.name.uz}<small>{real.filter((p) => p.category === c.id).length}</small>
              </button>
            ))}
          </div>
        </div>

        {!products && !error && <div className="a-loading"><i className="fas fa-spinner fa-spin"></i> Yuklanmoqda...</div>}
        {products && shown.length === 0 && (
          <div className="a-empty"><i className="fas fa-box-open"></i>{real.length ? 'Hech narsa topilmadi' : "Hozircha mahsulot yo'q"}</div>
        )}

        {shown.length > 0 && (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>Rasm</th>
                  <th>Mahsulot</th>
                  <th className="hide-sm">Kategoriya</th>
                  <th className="n">Narx (QQSsiz)</th>
                  <th className="hide-sm">Holat</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {shown.map((p) => (
                  <tr key={p.code}>
                    <td>
                      {mainImage(p) ? <img src={mainImage(p)} alt="" className="a-thumb" /> : <div className="a-thumb-empty"><i className="fas fa-image"></i></div>}
                      <div className="a-img-dots" title="Real surat · 3D · Chizma">
                        {(['photo', '3d', 'drawing'] as const).map((k) => (
                          <span key={k} className={productImages(p).some((x) => x.kind === k) ? 'on' : ''} />
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="a-code">{p.code}</span>
                      <span className="a-sub">{p.name?.uz}</span>
                    </td>
                    <td className="hide-sm"><span className="a-badge">{categoryLabel(p.category)}</span></td>
                    <td className="n">{p.price ? <b>{fmtSum(p.price)}</b> : <span className="a-badge warn">narx yo&apos;q</span>}</td>
                    <td className="hide-sm">
                      <div className="a-chips">
                        {p.specs.length > 0 && <span className="a-badge blue" title="Xarakteristikalar">{p.specs.length} xar.</span>}
                        {(p.certificatePdf || p.passportPdf) && <span className="a-badge ok"><i className="fas fa-file-pdf"></i> PDF</span>}
                      </div>
                    </td>
                    <td>
                      <div className="a-row-actions">
                        <Link href={adminProductEdit(p.code)} className="a-btn a-btn-sm">
                          <i className="fas fa-pen"></i> Tahrirlash
                        </Link>
                        <button type="button" onClick={() => handleDelete(p.code)} disabled={deletingCode === p.code} className="a-btn a-btn-sm a-btn-danger a-icon-btn" title="O'chirish">
                          <i className={`fas ${deletingCode === p.code ? 'fa-spinner fa-spin' : 'fa-trash-alt'}`}></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {importOpen && <ImportDialog onClose={() => setImportOpen(false)} onDone={(list) => setProducts(list)} />}
    </div>
  );
}
