"use client";

import { Language, LocalizedText } from '../../types';

export const LANGS: { value: Language; label: string }[] = [
  { value: 'uz', label: "O'zbekcha" },
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
];

/** Til tablari; `missing` berilsa — bo'sh tillar yonida qizil nuqta */
export default function LangTabs({ value, onChange, missing }: { value: Language; onChange: (l: Language) => void; missing?: LocalizedText | LocalizedText[] }) {
  const list = missing ? (Array.isArray(missing) ? missing : [missing]) : [];
  return (
    <div className="a-tabs" role="tablist">
      {LANGS.map((l) => (
        <button
          key={l.value}
          type="button"
          role="tab"
          aria-selected={value === l.value}
          className={`a-tab${value === l.value ? ' on' : ''}`}
          onClick={() => onChange(l.value)}
        >
          {l.label}
          {list.some((m) => !String(m?.[l.value] || '').trim()) && <span className="dot" title="To'ldirilmagan" />}
        </button>
      ))}
    </div>
  );
}
