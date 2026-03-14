/* ============================
   ELISA MOREAU — PORTFOLIO
   main.js
   ============================ */

/* --- NAV SCROLL SHADOW --- */
document.addEventListener('DOMContentLoaded', function initNav() {
    const bar = document.getElementById('top-bar');
    if (bar) window.addEventListener('scroll', () => {
        bar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
    // Active link
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
        if (a.getAttribute('href') === path) a.classList.add('active');
    });
});

/* --- SCROLL REVEAL --- */
document.addEventListener('DOMContentLoaded', function initReveal() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (!e.isIntersecting) return;
            const el = e.target;
            // Stagger based on DOM order
            const delay = (Array.from(document.querySelectorAll('.reveal')).indexOf(el) % 5) * 80;
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.classList.add('visible');
                // Animate skill bars
                el.querySelectorAll('.skill-fill').forEach(bar => {
                    const w = bar.getAttribute('data-width') || bar.style.width || '0%';
                    bar.style.width = w;
                });
            }, delay);
            observer.unobserve(el);
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(el => {
        // Save skill bar widths before zeroing
        el.querySelectorAll('.skill-fill').forEach(bar => {
            bar.setAttribute('data-width', bar.style.width || '0%');
            bar.style.width = '0%';
        });
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

/* --- LIVE CLOCK --- */
document.addEventListener('DOMContentLoaded', function initClock() {
    const el = document.getElementById('live-time');
    if (!el) return;
    const update = () => {
        el.textContent = new Date().toLocaleTimeString('fr-FR', { hour12: false });
    };
    update();
    setInterval(update, 1000);
});

/* --- AI CHATBOT --- */
document.addEventListener('DOMContentLoaded', function initAI() {
    const win  = document.getElementById('ai-window');
    const hist = document.getElementById('ai-history');
    const inp  = document.getElementById('ai-input');
    if (!win || !hist || !inp) return;

    const context = `Tu es l'assistant virtuel du portfolio d'Elisa Moreau.
Elisa est étudiante en BTS Communication, spécialisée en production audiovisuelle.
Elle a participé à deux productions : "Enfant Sauvage" et "Day for Night".
Elle écrit des poèmes et a une passion pour le cinéma, la littérature et la communication professionnelle.
Elle est en stage en entreprise et a plusieurs travaux académiques (devoirs) en communication.
Réponds en français, de manière claire et chaleureuse. Sois concis (2-3 phrases max).`;

    const messages = [
        { role: 'user', content: context + '\n\n[INIT — ne réponds pas à ce message]' },
        { role: 'assistant', content: 'Bonjour ! Je suis l\'assistant du portfolio d\'Elisa. Que souhaitez-vous savoir sur son parcours ?' }
    ];

    const addMsg = (text, cls) => {
        const div = document.createElement('div');
        div.className = 'ai-msg ' + cls;
        div.innerHTML = text.replace(/\n/g, '<br>');
        hist.appendChild(div);
        hist.scrollTop = hist.scrollHeight;
    };

    const showTyping = () => {
        const d = document.createElement('div');
        d.className = 'ai-msg bot-msg typing-dots';
        d.id = 'typing';
        d.innerHTML = '<span></span><span></span><span></span>';
        hist.appendChild(d);
        hist.scrollTop = hist.scrollHeight;
    };

    window.toggleChat = () => {
        win.classList.toggle('open');
        if (win.classList.contains('open') && inp) inp.focus();
    };

    window.handleKey = (e) => {
        if (e.key === 'Enter') window.askAI();
    };

    window.askAI = async () => {
        const text = inp.value.trim();
        if (!text) return;
        inp.value = '';
        addMsg(text, 'user-msg');
        messages.push({ role: 'user', content: text });
        showTyping();
        try {
            const res = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 300,
                    system: context,
                    messages: messages.slice(2)
                })
            });
            const data = await res.json();
            document.getElementById('typing')?.remove();
            const reply = data.content?.[0]?.text || 'Désolée, je n\'ai pas pu répondre.';
            messages.push({ role: 'assistant', content: reply });
            addMsg(reply, 'bot-msg');
        } catch {
            document.getElementById('typing')?.remove();
            addMsg('Erreur de connexion. Réessayez plus tard.', 'bot-msg');
        }
    };
});

/* --- THEME TOGGLE --- */
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    const btn = document.getElementById('theme-btn');
    if (btn) {
        const icon = btn.querySelector('i');
        if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch(e) {}
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            const btn = document.getElementById('theme-btn');
            if (btn) {
                const icon = btn.querySelector('i');
                if (icon) icon.className = 'fas fa-sun';
            }
        }
    } catch(e) {}
});
