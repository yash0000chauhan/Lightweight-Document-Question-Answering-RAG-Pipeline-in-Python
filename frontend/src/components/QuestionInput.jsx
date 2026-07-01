import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, RotateCcw } from 'lucide-react';

export default function QuestionInput({ onSubmit, loading, disabled, onClear }) {
  const [question, setQuestion] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, [question]);

  const handleSubmit = useCallback(() => {
    const q = question.trim();
    if (!q || loading || disabled) return;
    onSubmit(q);
  }, [question, loading, disabled, onSubmit]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="card animate-fade-in" role="region" aria-label="Question input">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-neutral-text dark:text-gray-100">Ask a Question</h2>
        {onClear && (
          <button
            id="clear-btn"
            onClick={onClear}
            className="btn-ghost text-xs gap-1.5 rounded-lg"
            aria-label="Clear results and start over"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Clear
          </button>
        )}
      </div>

      <div className="relative">
        <label htmlFor="question-input" className="sr-only">Ask anything about the uploaded document</label>
        <textarea
          id="question-input"
          ref={textareaRef}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={2}
          placeholder="Ask anything about the uploaded document…"
          aria-label="Question input"
          aria-describedby="question-hint"
          className={`
            input-field resize-none pr-14 text-sm leading-6 transition-all duration-300
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        <button
          id="ask-btn"
          onClick={handleSubmit}
          disabled={!question.trim() || loading || disabled}
          aria-label="Submit question"
          className="
            absolute right-3 bottom-3
            w-9 h-9 rounded-xl bg-primary-600 text-white
            flex items-center justify-center
            transition-all duration-300
            hover:bg-primary-700 hover:shadow-hover
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary-600 disabled:hover:shadow-none
            active:scale-90 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2
          "
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin-slow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <Send className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      <p id="question-hint" className="mt-2.5 text-xs text-neutral-secondary dark:text-gray-500">
        Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono border border-surface-border dark:border-gray-700">Enter</kbd> to submit · <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono border border-surface-border dark:border-gray-700">Shift + Enter</kbd> for new line
      </p>
    </div>
  );
}
