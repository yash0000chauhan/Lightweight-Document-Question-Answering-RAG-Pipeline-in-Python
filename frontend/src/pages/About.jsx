import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Shield, Layers, FileText } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'PDF Document Processing',
    description: 'Upload any PDF and the system will extract text, split it into meaningful chunks, and create a searchable vector index.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Layers,
    title: 'Retrieval-Augmented Generation',
    description: 'Using FAISS vector search, the pipeline retrieves the most semantically relevant passages and feeds them to the language model.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Zap,
    title: 'Gemini AI Integration',
    description: 'Google Gemini AI generates accurate, grounded answers strictly from the retrieved context — no hallucinations.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Shield,
    title: 'Strict Context Grounding',
    description: 'The LLM is instructed to only use provided context. If the answer is not in the document, it says so explicitly.',
    color: 'bg-green-50 text-green-600',
  },
];

const stack = [
  { name: 'Python 3.10+',    role: 'Backend runtime' },
  { name: 'FastAPI',         role: 'REST API framework' },
  { name: 'LangChain',       role: 'RAG orchestration' },
  { name: 'Google Gemini AI',role: 'LLM + Embeddings' },
  { name: 'FAISS',           role: 'Vector similarity search' },
  { name: 'PyPDF2',          role: 'PDF text extraction' },
  { name: 'React + Vite',    role: 'Frontend' },
  { name: 'Tailwind CSS',    role: 'UI styling' },
];

export default function About() {
  return (
    <main className="min-h-screen bg-surface-bg dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-6 py-12 lg:py-16">

        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-secondary dark:text-gray-400 hover:text-neutral-text dark:hover:text-gray-200 transition-colors mb-10"
          aria-label="Go back to home"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to home
        </Link>

        {/* Hero */}
        <div className="mb-14 animate-fade-in">
          <span className="badge-blue mb-4">About this project</span>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-text dark:text-gray-50 leading-tight mt-3 mb-4">
            How it works
          </h1>
          <p className="text-base text-neutral-secondary dark:text-gray-400 max-w-2xl leading-7">
            DocQA is a lightweight, end-to-end Retrieval-Augmented Generation (RAG) system that lets you
            upload any PDF document and get precise, grounded answers — powered entirely by open tools and Gemini AI.
          </p>
        </div>

        {/* Feature grid */}
        <section aria-label="Key features" className="mb-14">
          <h2 className="section-label mb-6">Key features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map(f => (
              <div key={f.title} className="card hover:shadow-hover transition-all duration-300 animate-slide-up">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-text dark:text-gray-100 mb-2">{f.title}</h3>
                <p className="text-sm text-neutral-secondary dark:text-gray-400 leading-6">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture diagram */}
        <section aria-label="Architecture overview" className="mb-14">
          <h2 className="section-label mb-6">Pipeline Architecture</h2>
          <div className="card">
            <ol className="relative space-y-0" aria-label="RAG pipeline steps">
              {[
                { step: '01', title: 'PDF Upload',        desc: 'User uploads a PDF via drag-and-drop or file picker.' },
                { step: '02', title: 'Text Extraction',   desc: 'PyPDF2 extracts raw text from all pages of the document.' },
                { step: '03', title: 'Text Chunking',     desc: 'LangChain splits the document into overlapping 1000-token chunks.' },
                { step: '04', title: 'Embedding',         desc: 'Google Embedding API converts each chunk into a dense vector.' },
                { step: '05', title: 'Vector Indexing',   desc: 'FAISS stores and indexes all vectors for fast similarity search.' },
                { step: '06', title: 'Query & Retrieval', desc: 'User question is embedded and top-K most similar chunks are retrieved.' },
                { step: '07', title: 'Answer Generation', desc: 'Gemini AI generates a precise answer using only the retrieved context.' },
              ].map((item, i, arr) => (
                <li key={item.step} className={`flex gap-5 ${i < arr.length - 1 ? 'pb-6' : ''}`}>
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-white">{item.step}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-px flex-1 bg-surface-border dark:bg-gray-700 mt-2" aria-hidden="true" />
                    )}
                  </div>
                  <div className="pb-1">
                    <p className="text-sm font-semibold text-neutral-text dark:text-gray-100">{item.title}</p>
                    <p className="text-sm text-neutral-secondary dark:text-gray-400 mt-1 leading-6">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Tech stack */}
        <section aria-label="Technology stack" className="mb-14">
          <h2 className="section-label mb-6">Technology Stack</h2>
          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm" aria-label="Technology stack table">
              <thead>
                <tr className="border-b border-surface-border dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left text-xs font-semibold text-neutral-secondary dark:text-gray-400 px-6 py-3">Technology</th>
                  <th className="text-left text-xs font-semibold text-neutral-secondary dark:text-gray-400 px-6 py-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {stack.map((t, i) => (
                  <tr
                    key={t.name}
                    className={`border-b last:border-b-0 border-surface-border dark:border-gray-800 ${i % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-gray-800/20'}`}
                  >
                    <td className="px-6 py-3.5 font-medium text-neutral-text dark:text-gray-200">{t.name}</td>
                    <td className="px-6 py-3.5 text-neutral-secondary dark:text-gray-400">{t.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link to="/" className="btn-primary">
            Try it now
          </Link>
        </div>
      </div>
    </main>
  );
}
