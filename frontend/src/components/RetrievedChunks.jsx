import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Hash, FileText, BarChart2 } from 'lucide-react';

function ScoreBadge({ score }) {
  const pct = Math.round(score * 100);
  const color = score > 0.75 ? 'badge-green' : score > 0.5 ? 'badge-blue' : 'badge-yellow';
  return <span className={color}>{pct}% match</span>;
}

function ChunkCard({ chunk, index }) {
  return (
    <div className="rounded-xl border border-surface-border dark:border-gray-700 p-4 space-y-3 animate-slide-up bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge-gray">
          <Hash className="w-3 h-3" aria-hidden="true" />
          Chunk {chunk.chunk_id ?? index + 1}
        </span>
        {chunk.page_number != null && (
          <span className="badge-gray">
            <FileText className="w-3 h-3" aria-hidden="true" />
            Page {chunk.page_number}
          </span>
        )}
        {chunk.score != null && <ScoreBadge score={chunk.score} />}
      </div>

      {/* Content */}
      <div
        className="text-xs text-neutral-text dark:text-gray-300 leading-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 max-h-32 overflow-y-auto whitespace-pre-wrap"
        aria-label={`Retrieved text for chunk ${index + 1}`}
      >
        {chunk.content}
      </div>
    </div>
  );
}

export default function RetrievedChunks({ chunks }) {
  const [open, setOpen] = useState(true);

  if (!chunks?.length) return null;

  return (
    <div className="card animate-slide-up" role="region" aria-label="Retrieved context chunks">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-lg"
        aria-expanded={open}
        aria-controls="chunks-panel"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
            <BookOpen className="w-4.5 h-4.5 text-amber-600" aria-hidden="true" />
          </div>
          <div className="text-left">
            <h2 className="text-sm font-semibold text-neutral-text dark:text-gray-100">Retrieved Chunks</h2>
            <p className="text-xs text-neutral-secondary dark:text-gray-400 mt-0.5">Top {chunks.length} relevant passages</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-gray">{chunks.length}</span>
          {open
            ? <ChevronUp  className="w-4 h-4 text-neutral-secondary group-hover:text-neutral-text transition-colors" aria-hidden="true" />
            : <ChevronDown className="w-4 h-4 text-neutral-secondary group-hover:text-neutral-text transition-colors" aria-hidden="true" />
          }
        </div>
      </button>

      {open && (
        <div id="chunks-panel" className="mt-5 space-y-3">
          {chunks.map((c, i) => <ChunkCard key={i} chunk={c} index={i} />)}
        </div>
      )}
    </div>
  );
}
