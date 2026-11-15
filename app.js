(() => {
  const items = Array.from(document.querySelectorAll('.check-list input[type="checkbox"]'));
  const count = document.getElementById('check-count');
  const updateChecklist = () => {
    if (count) count.textContent = `${items.filter(item => item.checked).length} / ${items.length} 已准备`;
  };
  items.forEach(item => item.addEventListener('change', updateChecklist));
  updateChecklist();

  // Keep direct links usable if GitHub's API is unreachable; update them only when
  // the latest release contains all three expected production assets.
  fetch('https://api.github.com/repos/liuzexier/dsv-client-guide/releases/latest')
    .then(response => {
      if (!response.ok) throw new Error('Release unavailable');
      return response.json();
    })
    .then(release => {
      if (!/^client-v\d+\.\d+\.\d+$/.test(release.tag_name) || !Array.isArray(release.assets)) return;
      const version = release.tag_name.slice('client-v'.length);
      const names = {
        'mac-arm': `DSV-v${version}-production-macOS-arm64.zip`,
        'mac-intel': `DSV-v${version}-production-macOS-x64.zip`,
        windows: `DSV-v${version}-production-Windows-x64.exe`
      };
      const assets = Object.entries(names).map(([platform, name]) => {
        const asset = release.assets.find(item => item.name === name);
        const expected = `https://github.com/liuzexier/dsv-client-guide/releases/download/${release.tag_name}/${name}`;
        return asset && asset.browser_download_url === expected ? [platform, expected] : null;
      });
      if (assets.some(asset => !asset)) return;
      assets.forEach(([platform, url]) => {
        const link = document.querySelector(`[data-download="${platform}"]`);
        if (link) link.href = url;
      });
      const versionLabel = document.getElementById('download-version');
      if (versionLabel) versionLabel.textContent = release.tag_name;
    })
    .catch(() => {});

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
