"use client";

interface ProjectsProps {
  t: (key: string) => string;
}

export default function Projects({ t }: ProjectsProps) {
  return (
    <section id="projects" className="bg-light">
      <div className="container">
        <h2 className="section-title">{t('projects_title')}</h2>
        <p className="section-subtitle">{t('projects_subtitle')}</p>
        <div className="project-placeholder">{t('projects_placeholder')}</div>
        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--gray-text)' }}>
          <i className="fas fa-check-circle" style={{ color: 'var(--accent)' }}></i> {t('projects_note')}
        </p>
      </div>
    </section>
  );
}
