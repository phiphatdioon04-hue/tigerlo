const BASE = '/api';

export async function publicGet(slug) {
  const r = await fetch(`${BASE}/public/${slug}`);
  if (!r.ok) throw new Error('Network error');
  return r.json();
}

function authHeaders() {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function adminLogin(username, password) {
  const r = await fetch(`${BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!r.ok) throw new Error('Invalid credentials');
  return r.json();
}

export async function adminGet(slug) {
  const r = await fetch(`${BASE}/admin/${slug}`, { headers: authHeaders() });
  if (r.status === 401) throw new Error('Unauthorized');
  if (!r.ok) throw new Error('Fetch failed');
  return r.json();
}

export async function adminPut(slug, body) {
  const r = await fetch(`${BASE}/admin/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body)
  });
  if (r.status === 401) throw new Error('Unauthorized');
  if (!r.ok) throw new Error('Save failed');
  return r.json();
}
