import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, Copy, RotateCcw, Download, CheckCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

function AnswerSkeleton() {
  return (
    <div className="space-y-3 animate-pulse" aria-label="Loading answer" aria-live="polite">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800" />
        <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded" />
      </div>
      <div className="space-y-2.5">
        {[100, 90, 75, 60, 80].map((w, i) => (
          <div key={i} className={`h-3 bg-gray-100 dark:bg-gray-800 rounded`} style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

export default function AnswerCard({ answer, loading, question, onRegenerate, processingTime }) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  // Auto-scroll to answer when it arrives
  useEffect(() => {
    if (answer && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [answer]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      addToast({ message: 'Answer copied to clipboard!', type: 'success' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast({ message: 'Failed to copy answer.', type: 'error' });
    }
  };

  const handleDownload = () => {
    const content = `Question:\n${question}\n\nAnswer:\n${answer}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'answer.txt';
    a.click();
    URL.revokeObjectURL(url);
    addToast({ message: 'Answer downloaded as TXT.', type: 'success' });
  };

  if (!loading && !answer) return null;

  return (
    <div ref={cardRef} className="card animate-slide-up" role="region" aria-label="AI generated answer">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-primary-600" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-text dark:text-gray-100">Answer</h2>
            {processingTime != null && !loading && (
              <p className="text-xs text-neutral-secondary dark:text-gray-400 mt-0.5">
                Generated in {processingTime.toFixed(1)}s
              </p>
            )}
          </div>
        </div>

        {answer && !loading && (
          <div className="flex items-center gap-1">
            <button
              id="copy-answer-btn"
              onClick={handleCopy}
              aria-label="Copy answer to clipboard"
              className="btn-ghost rounded-lg p-2"
            >
              {copied
                ? <CheckCheck className="w-4 h-4 text-success" aria-hidden="true" />
                : <Copy className="w-4 h-4" aria-hidden="true" />}
            </button>
            <button
              id="download-answer-btn"
              onClick={handleDownload}
              aria-label="Download answer as text file"
              className="btn-ghost rounded-lg p-2"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
            </button>
            {onRegenerate && (
              <button
                id="regenerate-btn"
                onClick={onRegenerate}
                aria-label="Regenerate answer"
                className="btn-ghost rounded-lg p-2"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <AnswerSkeleton />
      ) : (
        <div className="prose-answer text-sm text-neutral-text dark:text-gray-200 leading-7">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {answer}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
