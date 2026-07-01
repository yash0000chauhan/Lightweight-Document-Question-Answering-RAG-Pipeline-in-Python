import React from 'react';
import { FileText, Layers, Clock, Cpu, Zap } from 'lucide-react';

function StatRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2 text-xs text-neutral-secondary dark:text-gray-400">
        <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        {label}
      </div>
      <span className="text-xs font-medium text-neutral-text dark:text-gray-200">
        {value ?? '—'}
      </span>
    </div>
  );
}

export default function Sidebar({ status, processingTime, queryCount }) {
  return (
    <aside
      className="card h-fit animate-fade-in"
      role="complementary"
      aria-label="Pipeline statistics"
    >
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-secondary dark:text-gray-400 mb-4">
        Statistics
      </h2>

      <div className="divide-y divide-surface-border dark:divide-gray-800">
        <StatRow
          icon={FileText}
          label="Active Document"
          value={status?.active_pdf ? status.active_pdf.replace('.pdf', '') : null}
        />
        <StatRow icon={Cpu}  label="Embedding Model" value="embedding-001" />
        <StatRow icon={Zap}  label="LLM"             value="Gemini AI" />
        <StatRow icon={Layers} label="Vector Store"  value="FAISS" />
        <StatRow
          icon={Clock}
          label="Last Response"
          value={processingTime != null ? `${processingTime.toFixed(1)}s` : null}
        />
        <StatRow
          icon={FileText}
          label="Queries Run"
          value={queryCount > 0 ? queryCount : null}
        />
      </div>

      <div className="mt-4 pt-4 border-t border-surface-border dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status?.status === 'ready' ? 'bg-success animate-pulse-dot' : 'bg-gray-300 dark:bg-gray-600'}`} aria-hidden="true" />
          <span className="text-xs font-medium text-neutral-secondary dark:text-gray-400">
            {status?.status === 'ready' ? 'Pipeline ready' : 'Awaiting document'}
          </span>
        </div>
      </div>
    </aside>
  );
}
