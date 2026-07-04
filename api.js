/* =========================================================
   AGRIMASTER — Couche d'accès à l'API RESTful Table
   ========================================================= */
const API_BASE = 'tables';

async function apiList(table, params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/${table}${query ? '?' + query : ''}`);
  if (!res.ok) throw new Error(`Erreur API GET ${table}`);
  return res.json();
}

async function apiGet(table, id) {
  const res = await fetch(`${API_BASE}/${table}/${id}`);
  if (!res.ok) throw new Error(`Erreur API GET ${table}/${id}`);
  return res.json();
}

async function apiCreate(table, data) {
  const res = await fetch(`${API_BASE}/${table}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Erreur API POST ${table}`);
  return res.json();
}

async function apiUpdate(table, id, data) {
  const res = await fetch(`${API_BASE}/${table}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Erreur API PATCH ${table}/${id}`);
  return res.json();
}

async function apiDelete(table, id) {
  const res = await fetch(`${API_BASE}/${table}/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error(`Erreur API DELETE ${table}/${id}`);
  return true;
}

/* Récupère TOUTES les lignes d'une table (gère la pagination) */
async function apiListAll(table, params = {}) {
  let page = 1;
  const limit = 100;
  let all = [];
  while (true) {
    const data = await apiList(table, { ...params, page, limit });
    all = all.concat(data.data || []);
    if (!data.data || data.data.length < limit) break;
    page++;
    if (page > 50) break;
  }
  return all;
}
