import { mark } from "./icons.mjs";
import { escape as e } from "../../scripts/lib/content.mjs";
export function ecosystem(products, name) {
  return `<div class="ecosystem" aria-label="Explore the five-product ecosystem">
    <div class="map-top mono"><span><i class="status-dot"></i> THE PRODUCT ECOSYSTEM</span><span>01 — 05</span></div>
    <svg class="map-lines" viewBox="0 0 540 400" fill="none" aria-hidden="true"><circle cx="270" cy="200" r="154" stroke="currentColor" stroke-dasharray="2 7"/><circle cx="270" cy="200" r="93" stroke="currentColor"/><path d="M270 200 270 49M270 200 441 141M270 200 392 321M270 200 142 321M270 200 97 141" stroke="currentColor"/><circle cx="270" cy="200" r="42" stroke="currentColor"/></svg>
    <a class="map-center" href="/about" aria-label="About ${e(name)}"><span class="center-mark">a<span>↗</span></span></a>
    ${products.map((p, i) => `<a class="map-node node-${i} ${p.id}" href="/work/${p.id}" data-product="${p.id}"><span class="node-symbol">${mark(p.id)}</span><span>${p.name}</span><span class="node-kind">${["Workflow studio", "Private media", "Spatial computing", "Process manager", "Developer tooling"][i]}</span></a>`).join("")}
    <div class="map-bottom mono"><span>INDEPENDENT IDEAS. CONNECTED THINKING.</span><span>SELECT A PRODUCT ↗</span></div>
  </div>`;
}
function picture(name, alt, extra = "") {
  return `<img class="product-screenshot ${extra}" src="/images/${name}-1440.webp" srcset="/images/${name}-720.webp 720w, /images/${name}-1440.webp 1440w" sizes="(max-width: 680px) 90vw, (max-width: 1000px) 80vw, 960px" width="1440" height="900" loading="lazy" decoding="async" alt="${e(alt)}">`;
}
export function visual(p) {
  if (p.id === "atlas")
    return `<div class="showcase atlas-showcase"><div class="showcase-label mono">${mark("atlas", 16)} ATLAS STUDIO<span>MAKE LOGIC VISIBLE</span></div><div class="atlas-window"><div class="window-bar"><span class="window-dots">● ● ●</span><span class="mono">Support triage / Workflow editor</span><span class="window-status">LOCAL WORKSPACE</span></div>${picture("atlas", "Actual Atlas workflow editor with connected nodes and configuration inspector")}</div><span class="visual-index mono">FIG. 01 / FROM INTENT TO EXECUTION</span></div>`;
  if (p.id === "vibes")
    return `<div class="showcase vibes-showcase"><div class="vibes-type" aria-hidden="true">your feed.<br><span>your rules.</span></div><div class="phone"><div class="phone-top mono">9:41 <span>••• ▰</span></div><img src="/images/vibes-alpine.webp" alt="Original alpine sample artwork from the Vibes product website" width="360" height="640" loading="lazy"><div class="phone-ui"><span class="mono">YOUR LIBRARY</span><strong>A little further<br>from the noise.</strong><div><span>vibes.</span><span>♡ &nbsp; ⋯</span></div></div></div><span class="visual-index mono">ILLUSTRATIVE PLAYER / ORIGINAL DEMO MEDIA</span></div>`;
  if (p.id === "envision")
    return `<div class="showcase envision-showcase"><div class="showcase-label mono">${mark("envision", 16)} SPEAK IT. SEE IT.<span>THREE.JS / WEBXR</span></div>${picture("envision", "Actual Envision studio with a procedural 3D object and object inspector")}<div class="command-caption mono"><span class="command-dot"></span> “gold rocket”<span>→ A NEW PERSPECTIVE</span></div></div>`;
  if (p.id === "servio")
    return `<div class="showcase servio-showcase"><div class="showcase-label mono">${mark("servio", 16)} YOUR LOCAL COMMAND CENTER</div>${picture("servio", "Actual Servio desktop workspace showing local processes and lifecycle controls")}<span class="visual-index mono">ELECTRON DESKTOP / REAL PRODUCT CAPTURE</span></div>`;
  return `<div class="showcase prism-showcase"><div class="showcase-label mono">${mark("prism", 16)} BRANCH FLOW<span>INSIDE VS CODE</span></div><svg class="branch-lines" viewBox="0 0 540 240" fill="none" aria-hidden="true"><path d="M55 57h400" stroke="#72b4a2"/><path d="M115 57c35 0 15 90 60 90h180c45 0 20-90 65-90" stroke="#b39ae8"/><path d="M225 147c35 0 15 62 55 62h80" stroke="#d8b572"/><g fill="#1d1e25" stroke-width="3"><circle cx="75" cy="57" r="6" stroke="#72b4a2"/><circle cx="115" cy="57" r="6" stroke="#72b4a2"/><circle cx="420" cy="57" r="6" stroke="#72b4a2"/><circle cx="185" cy="147" r="6" stroke="#b39ae8"/><circle cx="355" cy="147" r="6" stroke="#b39ae8"/><circle cx="305" cy="209" r="6" stroke="#d8b572"/></g><g fill="#c9c7d5" font-size="12" font-family="monospace"><text x="55" y="29">main</text><text x="180" y="121">feature / next</text><text x="310" y="188">review</text></g></svg><div class="prism-caption"><span class="prism-evidence"><i></i> Plan → analyze → review</span><span class="mono">INTENT ≠ EVIDENCE</span></div><span class="visual-index mono">INTERFACE-INSPIRED / ILLUSTRATIVE BRANCH PLAN</span></div>`;
}
