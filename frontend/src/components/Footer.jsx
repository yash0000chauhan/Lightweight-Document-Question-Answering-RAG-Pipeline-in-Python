import React from 'react';

const tech = [
  { label: 'Python',    color: 'bg-blue-100 text-blue-700' },
  { label: 'LangChain', color: 'bg-purple-100 text-purple-700' },
  { label: 'Gemini AI', color: 'bg-sky-100 text-sky-700' },
  { label: 'FAISS',     color: 'bg-orange-100 text-orange-700' },
  { label: 'FastAPI',   color: 'bg-teal-100 text-teal-700' },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-surface-border dark:border-gray-800 bg-white dark:bg-gray-950 py-8 mt-16 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-neutral-secondary dark:text-gray-400 flex items-center gap-1.5">
          <span className="text-danger">♥</span>
          Built with care — Lightweight RAG Pipeline
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {tech.map(t => (
            <span key={t.label} className={`text-xs font-medium px-2.5 py-1 rounded-full ${t.color} dark:opacity-80`}>
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
