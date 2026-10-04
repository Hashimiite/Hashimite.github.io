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

// Visual animations start the first time they scroll into view, then play once
const player = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-playing'); player.unobserve(e.target); } });
}, { threshold: 0.4 });
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

// Feed visual: replay a fixed re-ranking (three score updates) the first time it is seen
const feed = document.querySelector('.feed-list');
if (feed && !reduceMotion) {
    const rows = [...feed.children];
    const steps = [[0.88, 0.79, 0.93, 0.61], [0.86, 0.95, 0.90, 0.58], [0.84, 0.97, 0.89, 0.71]];
    const rank = scores => {
        rows.forEach((r, i) => { r.querySelector('b').textContent = scores[i].toFixed(2); });
        [...rows].sort((a, b) => b.querySelector('b').textContent - a.querySelector('b').textContent)
            .forEach((r, i) => {
                r.style.transform = `translateY(${i * 56}px)`;
                r.classList.toggle('top', i === 0);
            });
    };
    new IntersectionObserver(([e], obs) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        steps.forEach((scores, i) => setTimeout(() => rank(scores), 1400 + i * 2200));
    }, { threshold: 0.5 }).observe(feed);
}

// AdBlocker visual: count the two blocks the first time it is seen
const adCount = document.querySelector('.ad-count');
if (adCount && !reduceMotion) {
    new IntersectionObserver(([e], obs) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        [1600, 2400].forEach((ms, i) => setTimeout(() => { adCount.textContent = +adCount.dataset.count + i + 1; }, ms));
    }, { threshold: 0.5 }).observe(adCount);
}
