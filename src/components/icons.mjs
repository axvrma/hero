export const arrow =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
export const diagonal =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
export const marks = {
  atlas: '<path d="m4 20 8-16 8 16M7 14h10M10 20l2-4 2 4"/>',
  vibes: '<path d="M3 9v6m5-11v16M13 7v10m5-13v16m5-11v6"/>',
  envision: '<path d="m12 3 9 5v8l-9 5-9-5V8l9-5ZM3 8l9 5 9-5m-9 5v8"/>',
  servio:
    '<rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h1m-1 10h1m5-10h5m-5 10h5"/>',
  prism: '<path d="m12 3 9 17H3L12 3Zm0 0v17M3 20l13-10"/>',
};
export const mark = (name, size = 24) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${marks[name] ?? marks.atlas}</svg>`;
