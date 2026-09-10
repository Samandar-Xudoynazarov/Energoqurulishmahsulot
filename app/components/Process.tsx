"use client";

interface ProcessProps {
  t: (key: string) => string;
}

export default function Process({ t }: ProcessProps) {
  const steps = [
    { num: 1, titleKey: 'step1_title', descKey: 'step1_desc' },
    { num: 2, titleKey: 'step2_title', descKey: 'step2_desc' },
    { num: 3, titleKey: 'step3_title', descKey: 'step3_desc' },
    { num: 4, titleKey: 'step4_title', descKey: 'step4_desc' },
  ];

  return (
    <section id="process" className="bg-light">
      <div className="container">
        <h2 className="section-title">{t('process_title')}</h2>
        <p className="section-subtitle">{t('process_subtitle')}</p>
        <div className="process-steps">
          {steps.map((step) => (
            <div key={step.num} className="step">
              <div className="step-num">{step.num}</div>
              <h5>{t(step.titleKey)}</h5>
              <p>{t(step.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
