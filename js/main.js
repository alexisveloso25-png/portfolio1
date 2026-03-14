/* ================================
   ELISA HUART-VASAK — main.js
   ================================ */

/* ── NAV scroll ─────────────────────────────────────────── */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {

  /* ── Scroll reveal ──────────────────────────────────────
     Système progressif :
     1. JS marque les éléments comme .will-animate
     2. IntersectionObserver ajoute .in au scroll
     3. CSS gère l'animation selon le type (data-r value)
  ─────────────────────────────────────────────────────── */
  const allReveal  = document.querySelectorAll('[data-r], [data-stagger]');
  const skillFills = document.querySelectorAll('.skill-fill');

  if ('IntersectionObserver' in window && allReveal.length) {

    /* Marquer tous les éléments comme animables */
    allReveal.forEach(el => el.classList.add('will-animate'));

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        /* Délai basé sur la position dans le groupe */
        const siblings = el.parentElement
          ? Array.from(el.parentElement.querySelectorAll('[data-r], [data-stagger]'))
          : [];
        const idx = siblings.indexOf(el);
        const delay = Math.min(idx * 90, 400);

        setTimeout(() => {
          el.classList.add('in');
          /* Déclencher les barres de compétences */
          el.querySelectorAll('.skill-fill').forEach(b => b.classList.add('animated'));
        }, delay);

        obs.unobserve(el);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    allReveal.forEach(el => obs.observe(el));

    /* Barres de skills indépendantes */
    const skillObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        setTimeout(() => e.target.classList.add('animated'), 200);
        skillObs.unobserve(e.target);
      });
    }, { threshold: 0.3 });
    skillFills.forEach(b => skillObs.observe(b));

  } else {
    /* Fallback — tout visible */
    skillFills.forEach(b => b.classList.add('animated'));
  }

  /* ── Compteurs animés ────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el  = e.target;
        const end = parseInt(el.dataset.count);
        const sfx = el.dataset.suffix || '';
        let   cur = 0;
        const dur = 1200;
        const step = end / (dur / 16);
        const timer = setInterval(() => {
          cur = Math.min(cur + step, end);
          el.textContent = Math.round(cur) + sfx;
          if (cur >= end) clearInterval(timer);
        }, 16);
        countObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObs.observe(c));
  }

  /* ── Parallax léger sur le hero ─────────────────────── */
  const heroPhoto = document.querySelector('.hero-photo');
  if (heroPhoto) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroPhoto.style.transform = `translateY(${y * 0.08}px)`;
      }
    }, { passive: true });
  }

  /* ── Progress bar de lecture ─────────────────────────── */
  const progressBar = document.getElementById('read-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const doc  = document.documentElement;
      const top  = doc.scrollTop;
      const h    = doc.scrollHeight - doc.clientHeight;
      progressBar.style.width = (top / h * 100) + '%';
    }, { passive: true });
  }

  /* ── Burger menu ─────────────────────────────────────── */
  const burger = document.getElementById('burger');
  const links  = document.querySelector('.nav-links');
  if (burger && links) {
    let open = false;
    burger.addEventListener('click', () => {
      open = !open;
      links.style.cssText = open
        ? 'display:flex;flex-direction:column;position:absolute;top:64px;left:0;right:0;background:rgba(255,255,255,.97);backdrop-filter:blur(20px);padding:16px 24px 20px;border-bottom:1px solid #ddd9d2;gap:4px;z-index:899'
        : '';
      if (!open) links.removeAttribute('style');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => { open = false; links.removeAttribute('style'); });
    });
  }

  /* ── Contact form ────────────────────────────────────── */
  const form = document.getElementById('contact-form');
  if (form) form.addEventListener('submit', handleForm);

});

/* Contact form handler */
function handleForm(e) {
  e.preventDefault();
  const btn = document.getElementById('form-btn');
  const msg = document.getElementById('form-msg');
  if (!btn) return;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
    btn.style.background = '#5a8a6a';
    if (msg) { msg.style.display = 'block'; msg.textContent = 'Merci ! Elisa vous répondra très bientôt.'; }
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-regular fa-paper-plane"></i> Envoyer';
      btn.disabled = false; btn.style.background = '';
      if (msg) msg.style.display = 'none';
    }, 4000);
  }, 1500);
}
