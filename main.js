/* =========================================================
   AGRIMASTER — Script principal (navbar, footer, animations, toasts)
   ========================================================= */

const CATEGORY_META = {
  'Agriculture': { icon: 'fa-seedling', color: '#1a8a45', image: 'images/cat-agriculture.jpg' },
  'Élevage': { icon: 'fa-cow', color: '#e0631a', image: 'images/cat-elevage.jpg' },
  'Agro-business': { icon: 'fa-chart-line', color: '#146c3a', image: 'images/cat-agribusiness.jpg' }
};

function toast(message, type = 'success', duration = 4200) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icon = type === 'error' ? 'fa-circle-exclamation' : type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-check';
  el.innerHTML = `<i class="fa-solid ${icon}" style="color:${type === 'error' ? '#c0392b' : type === 'warning' ? '#f9822c' : '#1a8a45'}"></i><span>${message}</span>`;
  container.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(60px)'; setTimeout(() => el.remove(), 300); }, duration);
}

function formatFCFA(n) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

function formatDate(ts) {
  if (!ts) return '—';
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(ts));
}

function initRevealAnimations() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}

function animateCounter(el, target, duration = 1800) {
  const start = 0;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(start + (target - start) * eased).toLocaleString('fr-FR');
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString('fr-FR');
  }
  requestAnimationFrame(tick);
}

function initStatCounters() {
  const stats = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseInt(entry.target.dataset.counter, 10));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  stats.forEach(el => observer.observe(el));
}

function renderNavbar(active = '') {
  const session = getSession();
  const mount = document.getElementById('navbar-mount');
  if (!mount) return;

  const links = [
    { href: 'index.html', label: 'Accueil', key: 'accueil' },
    { href: 'formations.html', label: 'Formations', key: 'formations' },
    { href: 'abonnement.html', label: 'Abonnement', key: 'abonnement' },
    { href: 'index.html#apropos', label: 'À propos', key: 'apropos' },
  ];

  let actionsHtml = '';
  if (session) {
    const dashHref = session.role === 'admin' ? 'admin-dashboard.html' : 'tableau-de-bord.html';
    actionsHtml = `
      <a href="${dashHref}" class="btn btn-ghost btn-sm"><i class="fa-solid fa-gauge"></i> <span class="hide-mobile">Mon espace</span></a>
      <button onclick="logout()" class="btn btn-primary btn-sm"><i class="fa-solid fa-right-from-bracket"></i> <span class="hide-mobile">Déconnexion</span></button>
    `;
  } else {
    actionsHtml = `
      <a href="connexion.html" class="btn btn-ghost btn-sm">Connexion</a>
      <a href="inscription.html" class="btn btn-primary btn-sm"><i class="fa-solid fa-user-plus"></i> <span class="hide-mobile">S'inscrire</span></a>
    `;
  }

  mount.innerHTML = `
    <nav class="navbar">
      <div class="navbar-inner glass">
        <a href="index.html" class="logo-wrap">
          <img src="images/logo.png" alt="Logo AgriMaster">
          <span class="logo-text">Agri<span>Master</span></span>
        </a>
        <ul class="nav-links" id="navLinks">
          ${links.map(l => `<li><a href="${l.href}" class="${active === l.key ? 'active' : ''}">${l.label}</a></li>`).join('')}
        </ul>
        <div class="nav-actions">
          ${actionsHtml}
          <button class="nav-toggle" id="navToggle" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
        </div>
      </div>
    </nav>
  `;

  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  toggle?.addEventListener('click', () => navLinks.classList.toggle('open'));
}

function renderFooter() {
  const mount = document.getElementById('footer-mount');
  if (!mount) return;
  mount.innerHTML = `
    <footer class="site-footer">
      <div class="footer-inner">
        <div>
          <div class="footer-logo">
            <img src="images/logo.png" alt="Logo AgriMaster">
            <span>AgriMaster</span>
          </div>
          <p class="footer-desc">Se former aujourd'hui pour mieux produire demain. La plateforme de référence pour la formation agricole et l'élevage en Afrique francophone.</p>
          <div class="footer-social">
            <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
            <a href="#" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
            <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Navigation</h4>
          <ul>
            <li><a href="index.html">Accueil</a></li>
            <li><a href="formations.html">Formations</a></li>
            <li><a href="abonnement.html">Abonnement</a></li>
            <li><a href="connexion.html">Connexion</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Catégories</h4>
          <ul>
            <li><a href="formations.html?cat=Agriculture">Agriculture</a></li>
            <li><a href="formations.html?cat=%C3%89levage">Élevage</a></li>
            <li><a href="formations.html?cat=Agro-business">Agro-business</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><i class="fa-solid fa-phone"></i> +237 6 91 91 73 65</li>
            <li><i class="fa-solid fa-envelope"></i> contact@agrimaster.africa</li>
            <li><i class="fa-solid fa-location-dot"></i> Douala, Cameroun</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} AgriMaster. Tous droits réservés.</span>
        <span>Fait avec 💚 pour l'agriculture africaine</span>
      </div>
    </footer>
  `;
}

function courseCardHtml(course) {
  const meta = CATEGORY_META[course.category] || CATEGORY_META['Agriculture'];
  const thumb = course.image_url
    ? `<img src="${course.image_url}" alt="${course.title}" loading="lazy">`
    : `<i class="fa-solid ${course.icon || meta.icon}"></i>`;
  return `
    <article class="course-card reveal">
      <div class="course-thumb" style="background:linear-gradient(135deg, ${meta.color}, #34c95f)">
        ${thumb}
        ${course.popular ? '<span class="course-badge popular"><i class="fa-solid fa-fire"></i> Populaire</span>' : `<span class="course-badge">${course.level}</span>`}
      </div>
      <div class="course-body">
        <span class="course-cat"><i class="fa-solid ${meta.icon}"></i> ${course.category}</span>
        <h3 class="course-title">${course.title}</h3>
        <p class="course-desc">${course.description}</p>
        <div class="course-meta">
          <span><i class="fa-regular fa-clock"></i> ${course.duration}</span>
          <span class="course-rating"><i class="fa-solid fa-star"></i> ${course.rating}</span>
        </div>
        <div class="course-footer">
          <a href="formation-detail.html?id=${course.id}" class="btn btn-primary btn-sm w-full">Voir la formation</a>
        </div>
      </div>
    </article>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  initRevealAnimations();
  initStatCounters();
});
