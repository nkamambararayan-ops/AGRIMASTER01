/* =========================================================
   AGRIMASTER — Authentification (côté client, stockage table Users)
   Hachage simple SHA-256 via Web Crypto API (suffisant pour démo statique)
   ========================================================= */

const SESSION_KEY = 'agrimaster_session';
const ADMIN_EMAIL = 'admin@agrimaster.africa';

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function genId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch { return null; }
}

function setSession(user) {
  const safeUser = { id: user.id, full_name: user.full_name, email: user.email, role: user.role, avatar_seed: user.avatar_seed };
  localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function requireAuth(redirectTo = 'connexion.html') {
  const session = getSession();
  if (!session) {
    window.location.href = redirectTo;
    return null;
  }
  return session;
}

function requireAdmin(redirectTo = 'index.html') {
  const session = getSession();
  if (!session || session.role !== 'admin') {
    window.location.href = redirectTo;
    return null;
  }
  return session;
}

async function registerUser({ full_name, email, phone, password }) {
  const existing = await apiList('users', { search: email });
  const clash = (existing.data || []).find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
  if (clash) throw new Error('Un compte existe déjà avec cet email.');

  const password_hash = await sha256(password);
  const role = email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user';
  const user = await apiCreate('users', {
    id: genId('user'),
    full_name, email: email.toLowerCase(), phone: phone || '',
    password_hash, role, avatar_seed: full_name.slice(0, 2).toUpperCase(),
    reset_token: '', reset_token_expiry: 0, status: 'actif'
  });

  await apiCreate('notifications', {
    id: genId('notif'), user_id: user.id, user_email: user.email,
    title: 'Bienvenue sur AgriMaster 🌱',
    message: `Bonjour ${full_name}, votre compte a été créé avec succès. Abonnez-vous pour débloquer toutes les formations !`,
    type: 'succes', is_read: false
  });

  return user;
}

async function loginUser({ email, password }) {
  const existing = await apiList('users', { search: email, limit: 200 });
  const user = (existing.data || []).find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error('Aucun compte trouvé avec cet email.');
  if (user.status === 'suspendu') throw new Error('Ce compte a été suspendu. Contactez le support.');
  const hash = await sha256(password);
  if (hash !== user.password_hash) throw new Error('Mot de passe incorrect.');
  setSession(user);
  return user;
}

async function requestPasswordReset(email) {
  const existing = await apiList('users', { search: email, limit: 200 });
  const user = (existing.data || []).find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error('Aucun compte trouvé avec cet email.');
  const token = Math.random().toString(36).slice(2, 10).toUpperCase();
  await apiUpdate('users', user.id, { reset_token: token, reset_token_expiry: Date.now() + 30 * 60 * 1000 });
  return token; // Simulation : dans une vraie app, un email serait envoyé.
}

async function resetPassword({ email, token, newPassword }) {
  const existing = await apiList('users', { search: email, limit: 200 });
  const user = (existing.data || []).find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error('Aucun compte trouvé.');
  if (!user.reset_token || user.reset_token !== token.toUpperCase()) throw new Error('Code de réinitialisation invalide.');
  if (Date.now() > user.reset_token_expiry) throw new Error('Ce code a expiré. Refaites une demande.');
  const password_hash = await sha256(newPassword);
  await apiUpdate('users', user.id, { password_hash, reset_token: '', reset_token_expiry: 0 });
  return true;
}

function logout() {
  clearSession();
  window.location.href = 'index.html';
}
