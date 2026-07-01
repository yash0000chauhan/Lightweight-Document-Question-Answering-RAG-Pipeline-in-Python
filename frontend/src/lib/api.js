const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail?.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  status: () => request('/status'),
  ask:    (question, top_k = 3) =>
    request('/ask', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ question, top_k }),
    }),
  upload: (file) => {
    const form = new FormData();
    form.append('file', file);
    return request('/upload', { method: 'POST', body: form });
  },
};
