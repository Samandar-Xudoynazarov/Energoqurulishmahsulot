"use client";

interface ClientsProps {
  t: (key: string) => string;
}

export default function Clients({ t }: ClientsProps) {
  const clients = ['client1', 'client2', 'client3', 'client4'];

  return (
    <section className="bg-light">
      <div className="container">
        <h2 className="section-title">{t('clients_title')}</h2>
        <p className="section-subtitle">{t('clients_subtitle')}</p>
        <div className="clients-grid">
          {clients.map((c) => (
            <span key={c} className="client-logo">{t(c)}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
