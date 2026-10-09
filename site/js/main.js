// main.js — small effects shared by every page

// 1. Fade sections in as they scroll into view.
//    CSS hides .reveal elements; we add .visible when one enters the screen.
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);   // only animate once
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 2. Live Pacific-time clock in the footer.
const clock = document.getElementById('clock');
function tick() {
  if (!clock) return;
  clock.textContent = new Date().toLocaleTimeString('en-US', {
    timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit'
  }) + ' PT';
}
tick();
setInterval(tick, 10000);

// 3. "Shuffle" buttons: randomly reorder the children of a list.
//    <button data-shuffle="projects"> shuffles <ul id="projects">.
document.querySelectorAll('[data-shuffle]').forEach(btn => {
  btn.addEventListener('click', () => {
    const list = document.getElementById(btn.dataset.shuffle);
    const items = [...list.children];
    // Fisher–Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    list.animate([{ opacity: 0.2 }, { opacity: 1 }], { duration: 350 });
    items.forEach(item => list.appendChild(item));  // re-append in new order
  });
});
