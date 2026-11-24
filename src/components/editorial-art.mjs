const orbit = `<svg viewBox="0 0 560 550" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="orbit-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" stroke="#fff" stroke-opacity=".09"/></pattern>
    <pattern id="orbit-lines" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 1H5" stroke="#ffb198" stroke-opacity=".33"/></pattern>
    <linearGradient id="orbit-fill" x1="114" y1="107" x2="443" y2="468" gradientUnits="userSpaceOnUse"><stop stop-color="#ff9772"/><stop offset=".52" stop-color="#e86243"/><stop offset="1" stop-color="#a92925"/></linearGradient>
    <radialGradient id="orbit-bg" cx=".5" cy=".45" r=".75"><stop stop-color="#30312e"/><stop offset="1" stop-color="#161715"/></radialGradient>
    <clipPath id="orbit-disc"><circle cx="280" cy="274" r="145"/></clipPath>
  </defs>
  <path fill="url(#orbit-bg)" d="M0 0h560v550H0z"/><path fill="url(#orbit-grid)" d="M0 0h560v550H0z"/>
  <g stroke="#a7aaa0" stroke-opacity=".37"><path d="M24 274h512M280 24v500" stroke-dasharray="3 5"/><circle cx="280" cy="274" r="195"/><circle cx="280" cy="274" r="171"/><path d="M84 78h392v392H84z" stroke-dasharray="2 6"/><path d="M74 78h20m-10-10v20m382-10h20m-10-10v20M74 470h20m-10-10v20m382-10h20m-10-10v20"/></g>
  <circle cx="280" cy="274" r="145" fill="url(#orbit-fill)"/>
  <g clip-path="url(#orbit-disc)"><path d="M65 397 428 40l112 113-363 357z" fill="#202220"/><path d="M103 433 466 76l71 72-363 357z" fill="url(#orbit-lines)"/><circle cx="280" cy="274" r="111" stroke="#ffd6c7" stroke-opacity=".67"/><circle cx="280" cy="274" r="68" stroke="#ffd6c7" stroke-opacity=".7"/><path d="M137 274h286m-143-145v290" stroke="#fff2e9" stroke-opacity=".5"/></g>
  <path d="m103 450 354-352" stroke="#f5eeee" stroke-opacity=".62"/><path d="m103 98 354 352" stroke="#f5eeee" stroke-opacity=".28"/>
  <circle cx="280" cy="274" r="6" fill="#fff4ed"/><circle cx="457" cy="98" r="4" fill="#ff9772"/><circle cx="103" cy="450" r="4" fill="#ff9772"/><circle cx="280" cy="79" r="3" fill="#c1c3b9"/><circle cx="475" cy="274" r="3" fill="#c1c3b9"/><circle cx="280" cy="469" r="3" fill="#c1c3b9"/><circle cx="85" cy="274" r="3" fill="#c1c3b9"/>
  <path d="M24 40V24h16m480 0h16v16M24 510v16h16m480 0h16v-16" stroke="#f1eee7" stroke-opacity=".7"/>
</svg>`;

export const heroArt = () => `<div class="hero-art">${orbit}</div>`;

const principlePaths = {
  root: `<g stroke="currentColor" fill="none"><path d="M24 22h48l38 38h52m-138 0h48m-48 38h48l38-38"/><path d="M24 22h48M24 60h48M24 98h48" stroke-dasharray="3 5"/></g><g fill="currentColor"><circle cx="24" cy="22" r="3"/><circle cx="24" cy="60" r="3"/><circle cx="24" cy="98" r="3"/></g><circle cx="164" cy="60" r="13" fill="none" stroke="var(--accent)"/><circle cx="164" cy="60" r="4" fill="var(--accent)"/>`,
  simplicity: `<g fill="none" stroke="currentColor"><rect x="20" y="33" width="54" height="54"/><rect x="28" y="40" width="36" height="41" transform="rotate(24 46 60)"/><path d="m19 66 29-32 27 27-20 19zM88 60h42m-8-7 8 7-8 7"/></g><rect x="143" y="36" width="48" height="48" rx="4" fill="none" stroke="var(--accent)"/><path d="m157 60 7 7 13-14" fill="none" stroke="var(--accent)"/>`,
  execution: `<g stroke="currentColor" fill="none"><path d="M24 30h106m-82 30h82m-58 30h58m0-60 28 30-28 30"/><rect x="20" y="26" width="8" height="8"/><rect x="44" y="56" width="8" height="8"/><rect x="68" y="86" width="8" height="8"/></g><path d="M158 60h32m-9-9 9 9-9 9" fill="none" stroke="var(--accent)" stroke-width="2"/>`,
};
export function principleArt(id) {
  return `<svg class="principle-art" viewBox="0 0 210 120" fill="none" aria-hidden="true"><path d="M10 10h190v100H10zM10 60h190M105 10v100" stroke="currentColor" opacity=".19" stroke-dasharray="2 4"/>${principlePaths[id]}</svg>`;
}

export const moonshotArt = `<svg viewBox="0 0 330 240" fill="none" aria-hidden="true"><g stroke="currentColor"><circle cx="165" cy="120" r="86"/><circle cx="165" cy="120" r="66" stroke-dasharray="3 6"/><path d="M30 120h270M165 18v204"/><path d="m165 44 55 108-55 44-55-44z" stroke-width="2"/><path d="m165 82 34 63-34 25-34-25zM110 152l-30 24m140-24 30 24"/></g><circle cx="165" cy="120" r="12" fill="var(--accent)"/><path d="M44 37h22m-11-11v22m210 155h22m-11-11v22" stroke="var(--accent)"/></svg>`;
