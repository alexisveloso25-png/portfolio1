/* ================================
   ELISA MOREAU — main.js (clean)
   ================================ */

/* NAV scroll shadow */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* Scroll reveal */
document.addEventListener('DOMContentLoaded', () => {

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      setTimeout(() => {
        e.target.classList.add('in');
        e.target.querySelectorAll('.skill-fill').forEach(b => b.classList.add('animated'));
      }, (Array.from(document.querySelectorAll('[data-r]')).indexOf(e.target) % 5) * 80);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('[data-r]').forEach(el => obs.observe(el));

  /* Skill bars visible on load (hero area) */
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('animated');
      skillObs.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.skill-fill').forEach(b => skillObs.observe(b));

  /* Live clock */
  const clock = document.getElementById('live-time');
  if (clock) {
    const t = () => { clock.textContent = new Date().toLocaleTimeString('fr-FR'); };
    t(); setInterval(t, 1000);
  }

  /* Burger */
  const burger = document.getElementById('burger');
  const links = document.querySelector('.nav-links');
  if (burger && links) {
    let open = false;
    burger.addEventListener('click', () => {
      open = !open;
      links.style.cssText = open
        ? 'display:flex;flex-direction:column;position:absolute;top:68px;left:0;right:0;background:rgba(255,255,255,.97);backdrop-filter:blur(20px);padding:12px 20px 20px;border-bottom:1px solid #ddd9d2;gap:2px;z-index:899'
        : '';
      if (!open) links.removeAttribute('style');
    });
  }
});

/* Contact form */
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
