"use client";

import { ContentCard, Language } from '../types';
import { realImage } from '../lib/product-utils';
import ProtectedImage from './ProtectedImage';

interface ProcessProps {
  t: (key: string) => string;
  lang: Language;
  steps: ContentCard[];
}

export default function Process({ t, lang, steps }: ProcessProps) {
  return (
    <section id="process" className="bg-light">
      <div className="container">
        <h2 className="section-title">{t('process_title')}</h2>
        <p className="section-subtitle">{t('process_subtitle')}</p>
        <ol className="process-grid">
          {steps.map((step, i) => {
            const img = realImage(step.image);
            return (
              <li key={step.id} className={`process-card${img ? '' : ' no-img'}`}>
                <div className="process-img">
                  {img ? <ProtectedImage src={img} alt={step.title[lang] || step.title.uz} loading="lazy" /> : <i className={`fas ${step.icon}`}></i>}
                  <span className="process-num">{i + 1}</span>
                </div>
                <div className="process-body">
                  <h5>{step.title[lang] || step.title.uz}</h5>
                  <p>{step.desc[lang] || step.desc.uz}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
