import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import UploadCard from '../components/UploadCard';
import StatusCard from '../components/StatusCard';
import QuestionInput from '../components/QuestionInput';
import RetrievedChunks from '../components/RetrievedChunks';
import AnswerCard from '../components/AnswerCard';
import Sidebar from '../components/Sidebar';
import { FileQuestion } from 'lucide-react';

function EmptyState() {
  return (
    <div className="card text-center py-16 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-5">
        <FileQuestion className="w-8 h-8 text-neutral-secondary dark:text-gray-500" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-neutral-text dark:text-gray-200 mb-2">No question asked yet</h3>
      <p className="text-xs text-neutral-secondary dark:text-gray-400 max-w-xs mx-auto leading-5">
        Upload a PDF and type your question above to get started with AI-powered document question answering.
      </p>
    </div>
  );
}

export default function Home() {
  const { addToast } = useToast();
  const [status, setStatus] = useState(null);
  const [answer, setAnswer] = useState('');
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState(null);
  const [queryCount, setQueryCount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');

  // Fetch status on mount and after uploads
  const fetchStatus = useCallback(async () => {
    try {
      const data = await api.status();
      setStatus(data);
    } catch {
      // silently fail on status check
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const handleUploadSuccess = useCallback((data) => {
    fetchStatus();
    setAnswer(''); setChunks([]); setProcessingTime(null);
  }, [fetchStatus]);

  const handleQuestion = useCallback(async (q) => {
    if (!status?.status === 'ready') {
      addToast({ message: 'Please upload a PDF first.', type: 'warning' });
      return;
    }
    setCurrentQuestion(q);
    setLoading(true);
    setAnswer('');
    setChunks([]);
    setProcessingTime(null);

    const start = performance.now();
    try {
      const data = await api.ask(q, 3);
      setAnswer(data.answer);
      setChunks(data.retrieved_chunks || []);
      setQueryCount(c => c + 1);
      const elapsed = (performance.now() - start) / 1000;
      setProcessingTime(elapsed);
    } catch (e) {
      addToast({ message: e.message || 'Failed to get an answer.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [status, addToast]);

  const handleClear = () => {
    setAnswer(''); setChunks([]); setProcessingTime(null); setCurrentQuestion('');
  };

  const handleRegenerate = () => {
    if (currentQuestion) handleQuestion(currentQuestion);
  };

  return (
    <main className="min-h-screen bg-surface-bg dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-6 py-12 lg:py-16">

        {/* Hero */}
        <div className="text-center mb-14 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse-dot" aria-hidden="true" />
            <span className="text-xs font-semibold text-primary-700 dark:text-primary-300 tracking-wide">RAG-Powered · Gemini AI</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-text dark:text-gray-50 leading-tight mb-4">
            Lightweight Document<br />Question Answering
          </h1>
          <p className="text-base text-neutral-secondary dark:text-gray-400 max-w-xl mx-auto leading-7">
            Upload any PDF and ask questions using Retrieval-Augmented Generation powered by Gemini AI.
          </p>
        </div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">

          {/* Left column: all main content */}
          <div className="flex flex-col gap-6">
            {/* Upload + Status row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UploadCard onUploadSuccess={handleUploadSuccess} />
              <StatusCard status={status} />
            </div>

            {/* Question input */}
            <QuestionInput
              onSubmit={handleQuestion}
              loading={loading}
              disabled={status?.status !== 'ready'}
              onClear={(answer || chunks.length > 0) ? handleClear : undefined}
            />

            {/* Results */}
            {loading || answer ? (
              <>
                <AnswerCard
                  answer={answer}
                  loading={loading}
                  question={currentQuestion}
                  onRegenerate={handleRegenerate}
                  processingTime={processingTime}
                />
                {!loading && chunks.length > 0 && (
                  <RetrievedChunks chunks={chunks} />
                )}
              </>
            ) : (
              <EmptyState />
            )}
          </div>

          {/* Right column: sidebar */}
          <div className="hidden lg:block">
            <Sidebar
              status={status}
              processingTime={processingTime}
              queryCount={queryCount}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
