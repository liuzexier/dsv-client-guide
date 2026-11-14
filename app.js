(() => {
  const items = Array.from(document.querySelectorAll('.check-list input[type="checkbox"]'));
  const count = document.getElementById('check-count');
  const updateChecklist = () => {
    if (count) count.textContent = `${items.filter(item => item.checked).length} / ${items.length} 已准备`;
  };
  items.forEach(item => item.addEventListener('change', updateChecklist));
  updateChecklist();

  const links = Array.from(document.querySelectorAll('.sidebar nav a'));
  const sections = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => link.classList.toggle('is-active', link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    sections.forEach(section => observer.observe(section));
  }
})();
