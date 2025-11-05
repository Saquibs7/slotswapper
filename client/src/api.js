const API_URL = import.meta.env.VITE_API_URL || 'https://slotswapper-1-ap6m.onrender.com';

export async function apiFetch(path, { token, method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || data.message || 'API error');
    err.response = data;
    throw err;
  }
  return data;
}
