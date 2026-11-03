// Synchronous and local: honor the existing preference before the first paint.
try {
  var saved = localStorage.getItem('theme');
  document.documentElement.dataset.theme = saved === 'light' || saved === 'dark' ? saved : matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
} catch (_) { document.documentElement.dataset.theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; }
