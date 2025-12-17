export function init() {
  const dots = document.querySelectorAll('.timeline-dot');
  const cards = document.querySelectorAll('.timeline-card');

  let activeIndex = 0;

  function setActive(index) {
    activeIndex = Math.max(0, Math.min(dots.length - 1, index));
    dots.forEach((d) => d.classList.toggle('active', Number(d.dataset.index) === activeIndex));
    cards.forEach((c) => {
      const isActive = Number(c.dataset.index) === activeIndex;
      c.classList.toggle('active', isActive);
      c.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  dots.forEach((d) => d.addEventListener('click', () => setActive(Number(d.dataset.index))));
  cards.forEach((c) => c.addEventListener('click', () => setActive(Number(c.dataset.index))));

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') setActive(activeIndex - 1);
    if (e.key === 'ArrowRight') setActive(activeIndex + 1);
  });

  setActive(0);
}
