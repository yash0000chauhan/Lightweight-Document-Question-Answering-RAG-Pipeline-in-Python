import React from 'react';
import { FileText, Layers, Cpu, Database, Activity } from 'lucide-react';

function InfoRow({ icon: Icon, label, value, badgeClass = 'badge-blue' }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-surface-border dark:border-gray-800 last:border-b-0">
      <div className="flex items-center gap-2.5 text-sm text-neutral-secondary dark:text-gray-400">
        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
        {label}
      </div>
      {value != null ? (
        <span className={badgeClass}>{value}</span>
      ) : (
        <span className="h-4 w-20 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" aria-hidden="true" />
      )}
    </div>
  );
}

export default function StatusCard({ status }) {
  const isReady = status?.status === 'ready';

  return (
    <div className="card animate-fade-in" role="region" aria-label="Document status">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
            <Activity className="w-4.5 h-4.5 text-success" aria-hidden="true" />
          </div>
          <h2 className="text-sm font-semibold text-neutral-text dark:text-gray-100">Document Status</h2>
        </div>
        <span className={isReady ? 'badge-green' : 'badge-gray'} role="status" aria-live="polite">
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse-dot inline-block ${isReady ? 'bg-success' : 'bg-gray-400'}`} aria-hidden="true" />
          {isReady ? 'Ready' : 'Idle'}
        </span>
      </div>

      <div className="divide-y divide-surface-border dark:divide-gray-800">
        <InfoRow
          icon={FileText}
          label="Active PDF"
          value={status?.active_pdf ?? undefined}
          badgeClass="badge-blue"
        />
        <InfoRow
          icon={Layers}
          label="Vector Index"
          value={status?.active_index ?? undefined}
          badgeClass="badge-gray"
        />
        <InfoRow
          icon={Cpu}
          label="Embedding Model"
          value="models/embedding-001"
          badgeClass="badge-gray"
        />
        <InfoRow
          icon={Database}
          label="Vector Database"
          value="FAISS"
          badgeClass="badge-gray"
        />
      </div>

      {!isReady && (
        <p className="mt-4 text-xs text-neutral-secondary dark:text-gray-400 text-center">
          Upload a PDF to initialize the pipeline.
        </p>
      )}
    </div>
  );
}
