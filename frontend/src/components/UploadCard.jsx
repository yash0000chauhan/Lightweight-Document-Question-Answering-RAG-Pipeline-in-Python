import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

const MAX_SIZE_MB = 50;

export default function UploadCard({ onUploadSuccess }) {
  const { addToast } = useToast();
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setFile(null);
    setProgress(0);
    setUploading(false);
    setUploadDone(false);
    setError('');
  };

  const validate = (f) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) {
      return 'Only PDF files are supported.';
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File size must be under ${MAX_SIZE_MB} MB.`;
    }
    return '';
  };

  const handleFile = useCallback((f) => {
    const err = validate(f);
    if (err) { setError(err); addToast({ message: err, type: 'error' }); return; }
    setError('');
    setFile(f);
    setUploadDone(false);
    setProgress(0);
  }, [addToast]);

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file || uploading) return;
    setUploading(true); setProgress(0); setError('');
    // Fake progress bar animation
    const timer = setInterval(() => setProgress(p => Math.min(p + 8, 88)), 200);
    try {
      const data = await api.upload(file);
      clearInterval(timer);
      setProgress(100);
      setUploadDone(true);
      addToast({ message: `"${file.name}" uploaded successfully!`, type: 'success' });
      onUploadSuccess?.(data);
    } catch (e) {
      clearInterval(timer);
      setProgress(0);
      setError(e.message);
      addToast({ message: e.message, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card animate-fade-in" role="region" aria-label="Upload PDF document">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
          <Upload className="w-4.5 h-4.5 text-primary-600" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-neutral-text dark:text-gray-100">Upload Document</h2>
          <p className="text-xs text-neutral-secondary dark:text-gray-400 mt-0.5">PDF only · Max {MAX_SIZE_MB} MB</p>
        </div>
      </div>

      {/* Drop Zone */}
      {!file ? (
        <div
          role="button"
          tabIndex={0}
          aria-label="Drag and drop a PDF file, or click to browse"
          onClick={() => fileRef.current?.click()}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
            transition-all duration-300 select-none
            ${dragging
              ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
              : 'border-surface-border dark:border-gray-700 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }
          `}
        >
          <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${dragging ? 'bg-primary-100' : 'bg-gray-100 dark:bg-gray-800'}`}>
            <FileText className={`w-7 h-7 ${dragging ? 'text-primary-600' : 'text-neutral-secondary dark:text-gray-400'}`} aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-neutral-text dark:text-gray-200 mb-1">
            {dragging ? 'Drop to upload' : 'Drag & drop your PDF here'}
          </p>
          <p className="text-xs text-neutral-secondary dark:text-gray-400 mb-4">or click to browse files</p>
          <span className="badge-blue text-xs">PDF · Up to {MAX_SIZE_MB} MB</span>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            className="sr-only"
            aria-hidden="true"
            onChange={e => handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        /* File Selected State */
        <div className="rounded-xl border border-surface-border dark:border-gray-700 p-4 space-y-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-text dark:text-gray-100 truncate">{file.name}</p>
              <p className="text-xs text-neutral-secondary dark:text-gray-400 mt-0.5">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {!uploading && !uploadDone && (
              <button
                onClick={reset}
                aria-label="Remove selected file"
                className="btn-ghost p-1.5 rounded-lg text-neutral-secondary hover:text-danger"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            {uploadDone && (
              <CheckCircle className="w-5 h-5 text-success shrink-0" aria-hidden="true" />
            )}
          </div>

          {/* Progress bar */}
          {(uploading || uploadDone) && (
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-neutral-secondary dark:text-gray-400">{uploadDone ? 'Uploaded' : 'Uploading…'}</span>
                <span className="font-medium text-primary-600">{progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-xs text-danger">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {error}
            </div>
          )}

          {!uploadDone && (
            <div className="flex gap-3">
              <button onClick={reset} className="btn-secondary flex-1" disabled={uploading}>
                Remove
              </button>
              <button
                id="upload-btn"
                onClick={handleUpload}
                disabled={uploading}
                className="btn-primary flex-1"
              >
                {uploading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin-slow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Uploading…
                  </>
                ) : 'Upload'}
              </button>
            </div>
          )}

          {uploadDone && (
            <button onClick={reset} className="btn-secondary w-full text-sm">
              Upload another PDF
            </button>
          )}
        </div>
      )}
    </div>
  );
}
