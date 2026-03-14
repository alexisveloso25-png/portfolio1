/* ================================
   ELISA HUART-VASAK — main.js
   ================================ */

/* NAV scroll */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {

  /* ── Compteurs animés (KPIs hero) ──────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (!target) return;
    const dur = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * ease) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* Compteurs — lancés 800ms après chargement */
  setTimeout(() => {
    document.querySelectorAll('[data-count]').forEach(el => animateCounter(el));
  }, 800);

  /* ── Scroll reveal ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll('[data-r], [data-stagger]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const siblings = el.parentElement
          ? Array.from(el.parentElement.querySelectorAll('[data-r],[data-stagger]'))
          : [];
        const delay = Math.min(siblings.indexOf(el) * 85, 400);
        setTimeout(() => {
          el.classList.add('in');
          el.querySelectorAll('.skill-fill').forEach(b => b.classList.add('animated'));
        }, delay);
        obs.unobserve(el);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(el => {
      el.classList.add('will-animate');
      obs.observe(el);
    });
  }

  /* Skill bars */
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      setTimeout(() => e.target.classList.add('animated'), 200);
      skillObs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-fill').forEach(b => skillObs.observe(b));

  /* ── Barre de lecture ───────────────────────────────────── */
  const bar = document.getElementById('read-progress');
  if (bar) {
    window.addEventListener('scroll', () => {
      const d = document.documentElement;
      bar.style.width = (d.scrollTop / (d.scrollHeight - d.clientHeight) * 100) + '%';
    }, { passive: true });
  }

  /* ── Parallax photo hero ────────────────────────────────── */
  const photo = document.querySelector('.hero-photo');
  if (photo) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        photo.style.transform = `translateY(${window.scrollY * 0.07}px)`;
      }
    }, { passive: true });
  }

  /* ── Burger menu ────────────────────────────────────────── */
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
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => { open = false; links.removeAttribute('style'); })
    );
  }

  /* ── Contact form ───────────────────────────────────────── */
  const form = document.getElementById('contact-form');
  if (form) form.addEventListener('submit', handleForm);

});

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
