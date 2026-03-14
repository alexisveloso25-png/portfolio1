/* ================================
   ELISA HUART-VASAK — main.js
   ================================ */

/* NAV scroll shadow */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {

  /* ── Scroll reveal ──────────────────────────────────── */
  const revealEls = document.querySelectorAll('[data-r]');

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll('.skill-fill').forEach(b => b.classList.add('animated'));
        obs.unobserve(e.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 4 * 0.07) + 's';
      obs.observe(el);
    });

  } else {
    /* Fallback — révèle tout immédiatement si pas d'IntersectionObserver */
    revealEls.forEach(el => {
      el.classList.add('in');
      el.querySelectorAll('.skill-fill').forEach(b => b.classList.add('animated'));
    });
  }

  /* Skill bars déjà visibles au chargement */
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('animated');
      skillObs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-fill').forEach(b => skillObs.observe(b));

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
    /* Fermer au clic sur un lien */
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
    if (msg) { msg.style.display = 'block'; msg.textContent = 'Merci ! Elisa vous répondra dans les plus brefs délais.'; }
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-regular fa-paper-plane"></i> Envoyer';
      btn.disabled = false; btn.style.background = '';
      if (msg) msg.style.display = 'none';
    }, 4000);
  }, 1500);
}
