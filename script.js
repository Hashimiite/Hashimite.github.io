const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const links = document.getElementById('nav-links');
const setMenu = open => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
links.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && links.classList.contains('open')) { setMenu(false); toggle.focus(); }
});

// Scroll reveals, and animations that only run while on screen
const revealer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); revealer.unobserve(e.target); } });
}, { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.reveal').forEach(el => revealer.observe(el));

const player = new IntersectionObserver(entries => {
    entries.forEach(e => e.target.classList.toggle('is-playing', e.isIntersecting));
});
document.querySelectorAll('.anim').forEach(el => player.observe(el));

// Highlight the nav link for the section in view
const navLinks = [...links.querySelectorAll('a[href^="#"]')];
const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        navLinks.forEach(a => a.getAttribute('href') === '#' + e.target.id
            ? a.setAttribute('aria-current', 'true')
            : a.removeAttribute('aria-current'));
    });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

// Copy email
const copyBtn = document.querySelector('.copy');
const copyStatus = document.querySelector('.copy-status');
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(copyBtn.dataset.copy);
        copyStatus.textContent = 'Copied to clipboard';
    } catch {
        copyStatus.textContent = 'Copy failed. Select the address above instead.';
    }
    setTimeout(() => { copyStatus.textContent = ''; }, 2500);
});

// Feed visual: re-score and re-rank rows while visible
// ponytail: random scores are decorative; swap for a recorded sample if you want real data
const feed = document.querySelector('.feed-list');
if (feed && !reduceMotion) {
    const rows = [...feed.children];
    let visible = false;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(feed);
    setInterval(() => {
        if (!visible) return;
        rows.forEach(r => { r.querySelector('b').textContent = (0.4 + Math.random() * 0.58).toFixed(2); });
        [...rows].sort((a, b) => b.querySelector('b').textContent - a.querySelector('b').textContent)
            .forEach((r, i) => {
                r.style.transform = `translateY(${i * 56}px)`;
                r.classList.toggle('top', i === 0);
            });
    }, 2600);
}
