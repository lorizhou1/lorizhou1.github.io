// life.js — photo gallery with shuffle and lightbox

// ── Your photos ─────────────────────────────────────
// Put images in assets/photos/ and add one line per photo.
// Caption is optional: leave it as '' for none.
const PHOTOS = [
  { file: 'photo-01.jpg', caption: '' },
  { file: 'photo-02.jpg', caption: '' },
  { file: 'photo-03.jpg', caption: '' },
  { file: 'photo-04.jpg', caption: '' },
  { file: 'photo-05.jpg', caption: '' },
  { file: 'photo-06.jpg', caption: '' },
  { file: 'photo-07.jpg', caption: '' },
  { file: 'photo-08.jpg', caption: '' },
  { file: 'photo-09.jpg', caption: '' },
  { file: 'photo-10.jpg', caption: '' },
  { file: 'photo-11.jpg', caption: '' },
  { file: 'photo-12.jpg', caption: '' },
];
const src = f => 'assets/photos/' + encodeURIComponent(f);

const gallery = document.getElementById('gallery');
let order = PHOTOS.slice();   // current display order
let current = 0;              // index of photo open in lightbox

// Fade each photo in when it scrolls into view
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.05 });

// Build one <figure> per photo and put them in the gallery
function render() {
  gallery.innerHTML = '';
  order.forEach((p, i) => {
    const fig = document.createElement('figure');
    fig.innerHTML = `<img src="${src(p.file)}" alt="${p.caption}" loading="lazy" />` +
                    (p.caption ? `<figcaption>${p.caption}</figcaption>` : '');
    fig.style.transitionDelay = (i % 6) * 60 + 'ms';   // small stagger
    fig.addEventListener('click', () => openLightbox(i));
    gallery.appendChild(fig);
    observer.observe(fig);
  });
}

// Shuffle button: Fisher–Yates shuffle, then rebuild
document.getElementById('shuffle-photos').addEventListener('click', () => {
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  render();
});

// ── Lightbox ────────────────────────────────────────
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCap = document.getElementById('lb-cap');

function show(i) {
  current = (i + order.length) % order.length;   // wrap around at the ends
  lbImg.src = src(order[current].file);
  lbCap.textContent = order[current].caption;
}
function openLightbox(i) { show(i); lb.classList.add('open'); }
function closeLightbox() { lb.classList.remove('open'); }

document.getElementById('lb-close').onclick = closeLightbox;
document.getElementById('lb-prev').onclick = () => show(current - 1);
document.getElementById('lb-next').onclick = () => show(current + 1);
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });   // click backdrop
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') show(current - 1);
  if (e.key === 'ArrowRight') show(current + 1);
});

render();

// Footer clock (same as other pages)
const clock = document.getElementById('clock');
if (clock) {
  const tick = () => clock.textContent = new Date().toLocaleTimeString('en-US',
    { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' }) + ' PT';
  tick(); setInterval(tick, 10000);
}
