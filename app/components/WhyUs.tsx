"use client";

interface WhyProps {
  t: (key: string) => string;
}

export default function WhyUs({ t }: WhyProps) {
  const items = [
    { icon: 'fa-clock', titleKey: 'why1_title', descKey: 'why1_desc' },
    { icon: 'fa-check-circle', titleKey: 'why2_title', descKey: 'why2_desc' },
    { icon: 'fa-truck-fast', titleKey: 'why3_title', descKey: 'why3_desc' },
  ];

  return (
    <section className="container">
      <h2 className="section-title">{t('why_title')}</h2>
      <p className="section-subtitle">{t('why_subtitle')}</p>
      <div className="why-grid">
        {items.map((item) => (
          <div key={item.titleKey} className="why-item">
            <i className={`fas ${item.icon}`}></i>
            <h4>{t(item.titleKey)}</h4>
            <p>{t(item.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
