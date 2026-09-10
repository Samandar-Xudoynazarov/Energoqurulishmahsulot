"use client";

interface TeamProps {
  t: (key: string) => string;
  openModal: (key: string) => void;
}

export default function Team({ t, openModal }: TeamProps) {
  const cards = [
    { key: 'jamoa', icon: 'fa-users', titleKey: 'card1_title', descKey: 'card1_desc' },
    { key: 'texnika', icon: 'fa-tools', titleKey: 'card2_title', descKey: 'card2_desc' },
    { key: 'avtopark', icon: 'fa-truck', titleKey: 'card3_title', descKey: 'card3_desc' },
  ];

  return (
    <section className="bg-light">
      <div className="container">
        <h2 className="section-title">{t('team_title')}</h2>
        <p className="section-subtitle">{t('team_subtitle')}</p>
        <div className="card-grid">
          {cards.map((card) => (
            <div key={card.key} className="card" onClick={() => openModal(card.key)}>
              <i className={`fas ${card.icon}`}></i>
              <h4>{t(card.titleKey)}</h4>
              <p>{t(card.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
