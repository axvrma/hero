import { escape as e } from "../../scripts/lib/content.mjs";
import { prismArt } from "./illustrations.mjs";

function screenshot(name, alt, height, sizes = "(max-width: 760px) 90vw, (max-width: 1330px) 58vw, 770px") {
  return `<img src="/images/${name}-1440.webp" srcset="/images/${name}-720.webp 720w, /images/${name}-1440.webp 1440w" sizes="${e(sizes)}" width="1440" height="${height}" loading="lazy" decoding="async" alt="${e(alt)}">`;
}

const visuals = {
  atlas: () => `<figure class="product-visual atlas-visual" data-reveal>
    ${screenshot("atlas", "Atlas workflow editor showing connected nodes and the configuration inspector", 1100)}
    <figcaption>Atlas Studio / Workflow editor</figcaption>
  </figure>`,
  prism: () => prismArt,
  envision: () => `<figure class="product-visual envision-visual" data-reveal>
    ${screenshot("envision", "Envision studio with a procedural gold rocket and object inspector", 1000)}
    <figcaption>Envision / Browser studio</figcaption>
  </figure>`,
  vibes: () => `<figure class="product-visual vibes-visual" data-reveal>
    <div class="vibes-word" aria-hidden="true">vibes<span>.</span></div>
    <div class="vibes-player"><img src="/images/vibes-alpine.webp" alt="Original alpine sample artwork from Vibes" width="540" height="960" loading="lazy" decoding="async"><div aria-hidden="true"><span>YOUR LIBRARY</span><strong>Alpine</strong><span>▶ &nbsp; ━━━━━</span></div></div>
    <figcaption>Vibes / Illustrative player with original demo media</figcaption>
  </figure>`,
  servio: () => `<figure class="product-visual" data-reveal>${screenshot("servio", "Servio desktop workspace showing local processes and lifecycle controls", 1089)}<figcaption>Servio / Local processes</figcaption></figure>`,
  auditbench: () => `<figure class="product-visual" data-reveal><img src="/images/auditbench-workspace.webp" width="1440" height="1040" loading="lazy" decoding="async" alt="Auditbench workspace showing website audit scores and performance history"><figcaption>Auditbench / Audit workspace</figcaption></figure>`,
  luminescent: () => `<figure class="product-visual luminescent-visual" data-reveal><div aria-hidden="true"><span>✧</span><strong>Luminescent</strong><div><i></i><i></i><i></i><i></i></div></div><figcaption>Illustrative component composition</figcaption></figure>`,
};

export function productVisual({ id }) {
  return visuals[id]();
}
