/* ====== CHANGE THE APPLICATION LINK HERE (one place for the whole site) ====== */
var BIOBRAIN_APP_URL='https://biobrain-scientific-intelligence.onrender.com/';
/* =========================================================================== */
document.querySelectorAll('a[data-app]').forEach(function(a){a.setAttribute('href',BIOBRAIN_APP_URL)});
// Mobile menu
const btn = document.querySelector('.menu-btn');
const menu = document.getElementById('menu');
if (btn && menu) {
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
}

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Logo: make "NEUROSCIENCE-BASED AI" exactly as wide as "BioBrain" (stacked, same width)
function fitLogoTags() {
  document.querySelectorAll('.logo-text').forEach(box => {
    const b = box.querySelector('b'), s = box.querySelector('small');
    if (!b || !s) return;
    s.style.letterSpacing = '';
    const target = b.getBoundingClientRect().width;
    const cs = getComputedStyle(s);
    const fs = parseFloat(cs.fontSize);
    const base = parseFloat(cs.letterSpacing) || 0;
    const n = s.textContent.length;
    const w0 = s.getBoundingClientRect().width - n * base;      // width without letter-spacing
    let ls = (target - w0) / (n - 1);
    ls = Math.max(0, Math.min(ls, fs * 0.4));
    s.style.letterSpacing = ls + 'px';
  });
}
window.addEventListener('DOMContentLoaded', fitLogoTags);
window.addEventListener('load', fitLogoTags);
window.addEventListener('resize', fitLogoTags);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitLogoTags);
