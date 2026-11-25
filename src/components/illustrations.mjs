import { escape as e } from "../../scripts/lib/content.mjs";

const monogram = "M5 24 16 5l11 19M9 18h14M5 7l11 19L27 7";
export const brandMark = (size = 29) => `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none"><path d="${monogram}" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/></svg>`;

export function assembly(id, count = 5) {
  const plates = Array.from({ length: count }, (_, index) => {
    const offset = (index - (count - 1) / 2) * 54;
    const rim = index === 2 ? "#ffc18d" : "#bd623b";
    return `<g class="optic-plate optic-plate-${index}" transform="translate(${offset} 0)">
      <path d="M0 -108L15 -108A55 108 0 0 1 15 108H0A55 108 0 0 0 0 -108Z" fill="url(#${id}-metal)" stroke="${rim}" stroke-width=".8"/>
      <ellipse rx="55" ry="108" fill="url(#${id}-face)" stroke="${rim}" stroke-width="1.2"/>
      <ellipse rx="47" ry="98" fill="none" stroke="#f19b67" stroke-opacity=".65" stroke-dasharray="1 3"/>
      <ellipse rx="38" ry="83" fill="none" stroke="${rim}" stroke-opacity=".75"/>
      <ellipse rx="28" ry="64" fill="url(#${id}-core)" stroke="${rim}" stroke-opacity=".8"/>
      <path d="M-5 -101H5M-5 101H5M-54 0h12m84 0h12" stroke="#ffcda4" stroke-width="1.4"/>
      <path d="M-32 -54Q0 -105 32 -54M-30 60Q0 101 30 60" stroke="#ffb389" stroke-opacity=".5" fill="none"/>
    </g>`;
  }).join("");
  return `<svg class="assembly" viewBox="0 0 600 370" aria-hidden="true" fill="none">
    <defs>
      <linearGradient id="${id}-metal" x2="0" y2="1"><stop stop-color="#ffc794"/><stop offset=".28" stop-color="#8f3f22"/><stop offset=".61" stop-color="#2a1310"/><stop offset="1" stop-color="#db7949"/></linearGradient>
      <linearGradient id="${id}-face" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#f58349" stop-opacity=".38"/><stop offset=".47" stop-color="#170e0b" stop-opacity=".8"/><stop offset="1" stop-color="#b94b25" stop-opacity=".58"/></linearGradient>
      <radialGradient id="${id}-core"><stop stop-color="#ffbd88" stop-opacity=".75"/><stop offset=".5" stop-color="#f3783d" stop-opacity=".28"/><stop offset="1" stop-color="#9b3d21" stop-opacity=".1"/></radialGradient>
    </defs>
    <g stroke="#e59360" stroke-opacity=".37">
      <path d="M30 186h540M300 15v340" stroke-dasharray="2 6"/>
      <ellipse cx="300" cy="185" rx="226" ry="133" transform="rotate(-17 300 185)" stroke-dasharray="2 5"/>
      <ellipse cx="300" cy="185" rx="247" ry="148" transform="rotate(-17 300 185)"/>
      <path d="M56 285h90l49-34M546 83h-75l-50 26M128 40h68m-34-11v22M522 319h33m-16-16v32"/>
      <circle cx="146" cy="285" r="3" fill="#f19b67"/><circle cx="471" cy="83" r="3" fill="#f19b67"/>
    </g>
    <g transform="translate(300 185) rotate(-16)">
      <path d="M-224 0h448" stroke="#ff944f" stroke-width="2"/>
      <path d="M-224 0h448" stroke="#fff0db" stroke-width="1" stroke-dasharray="2 7"/>
      ${plates}
    </g>
    ${id === "closing-optic" ? `<g class="assembly-mark" transform="translate(254 139) scale(2.875)"><path d="${monogram}" stroke="#ffe3c8" stroke-width="1.6" stroke-linejoin="round"/></g>` : ""}
  </svg>`;
}

export function opticalField() {
  const contours = Array.from({ length: 126 }, (_, index) => {
    const radius = index * 5.4 + 64;
    const sweep = Math.sin(index * 0.075) * 90;
    const flare = Math.max(0, Math.cos(index * 0.16));
    const x = 1270 + (radius - 390) * 0.38;
    const y = 410 + (radius - 390) * 0.23;
    const path = `M${Math.round(x - radius * 1.84)} -70C${Math.round(x - radius * 1.03)} ${Math.round(110 + sweep)} ${Math.round(x - radius * 1.42)} ${Math.round(y + 28)} ${Math.round(x - radius * 0.45)} ${Math.round(y + radius * .54)}S${Math.round(x + radius * .86)} ${Math.round(560 + radius * .55)} ${Math.round(x + radius * 1.05)} 875`;
    const pulse = index === 72 || index === 96 ? `<path class="hero-field-trace" pathLength="100" d="${path}"/>` : "";
    return `<path d="${path}" opacity="${(0.1 + flare * 0.37).toFixed(2)}"/>${pulse}`;
  }).join("");
  return `<svg viewBox="0 0 1440 850" preserveAspectRatio="xMaxYMid slice" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="field-light" x1=".18" y1=".08" x2=".88" y2=".82">
        <stop stop-color="#592218"/><stop offset=".32" stop-color="#8d371f"/>
        <stop offset=".63" stop-color="#e47737"/><stop offset=".81" stop-color="#fda15e"/><stop offset="1" stop-color="#5c2016"/>
      </linearGradient>
      <radialGradient id="field-heat" cx=".75" cy=".78" r=".76" gradientTransform="translate(0 .25) scale(1 .65)">
        <stop stop-color="#953c20" stop-opacity=".79"/><stop offset=".54" stop-color="#4d1b12" stop-opacity=".72"/>
        <stop offset="1" stop-color="#100b0a" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <path fill="url(#field-heat)" d="M0 0h1440v850H0z"/>
    <g stroke="url(#field-light)" stroke-width="1.5">${contours}</g>
  </svg>`;
}

const backgroundLines = {
  enterprise: `<path d="M185 49h300l88 88h258m-472-9h93l110 110h331m-588 57h128l78 78h380m-278-236v63l38 38m110 0v-38l63-63m-279 136 58 58h157m-566-12h142l50-50h36"/>
      <path class="ambient-trace" pathLength="100" d="M185 49h300l88 88h258M359 128h93l110 110h331M305 295h128l78 78h380"/>
      <g fill="currentColor" stroke="none"><circle cx="185" cy="49" r="3"/><circle cx="573" cy="137" r="3"/><circle cx="651" cy="238" r="3"/><circle cx="621" cy="331" r="3"/><circle cx="655" cy="373" r="3"/><circle cx="828" cy="137" r="3"/></g>`,
  products: `<g transform="rotate(-26 630 206)">
        <ellipse cx="630" cy="206" rx="320" ry="98"/><ellipse cx="630" cy="206" rx="282" ry="76"/>
        <ellipse cx="630" cy="206" rx="246" ry="53"/><ellipse cx="630" cy="206" rx="203" ry="32"/>
        <path d="M277 206h704m-351-114v228" stroke-dasharray="3 8"/>
        <ellipse class="ambient-trace" pathLength="100" cx="630" cy="206" rx="320" ry="98"/>
        <ellipse class="ambient-trace" pathLength="100" cx="630" cy="206" rx="246" ry="53"/>
        <g fill="currentColor" stroke="none"><circle cx="310" cy="206" r="3"/><circle cx="630" cy="130" r="3"/><circle cx="630" cy="304" r="3"/></g>
      </g>`,
};

export function ambientBackground(kind) {
  return `<div class="ambient-scene ambient-${kind}" data-motion aria-hidden="true">
    <div class="ambient-viewport">
      <div class="ambient-glow"></div>
      <svg viewBox="0 0 920 420" fill="none" stroke="currentColor">${backgroundLines[kind]}</svg>
    </div>
  </div>`;
}

const art = {
  invoice: {
    description: "An incoming invoice is read, turned into structured fields and passed to downstream processing.",
    scene: `<g class="diagram-muted"><path d="M52 154h496M120 50v171m180-171v171m180-171v171" stroke-dasharray="3 7"/><path d="M82 92h62l18 18v76H82zM144 92v18h18M92 129h54m-54 12h43m-43 12h53m-53 12h27"/></g>
      <path class="channel" d="M162 152h104m68 0h100"/><path class="signal" pathLength="100" d="M162 152h104m68 0h100"/>
      <g class="diagram-edge"><rect x="266" y="112" width="68" height="80" rx="3"/><path d="M276 124h48m-48 17h48m-48 17h48m-48 17h48m-31-51v59"/><path class="scanner" d="M270 148h60"/></g>
      <g class="diagram-edge"><path d="M434 123h85v57h-85zM446 139h60m-60 11h43m-43 11h54"/><path d="M443 185h67m-58 5h49"/></g>
      <text x="120" y="224">Invoice</text><text x="300" y="224">Extract fields</text><text x="478" y="224">Post data</text>`,
  },
  shipment: {
    description: "Shipment configuration selects a task plan. Role-specific tasks run on separate branches and roll into filing progress.",
    scene: `<path class="channel" d="M105 137h92m60 0h32V77h74m-74 60h74m-74 0v60h74m58-120h35v120h-35m0-60h82"/>
      <path class="signal" pathLength="100" d="M105 137h92m60 0h32V77h74m-74 60h74m-74 0v60h74m58-120h35v120h-35m0-60h82"/>
      <g class="diagram-edge"><path d="M58 110h47v54H58zM67 120v34m10-34v34m10-34v34m9-34v34"/><path d="m227 107 30 30-30 30-30-30z"/><path d="M363 57h58v40h-58zM363 117h58v40h-58zM363 177h58v40h-58zM503 117h40v40h-40zM514 137l7 7 12-14"/></g>
      <text x="81" y="191">Shipment</text><text x="227" y="191">Config</text><text x="392" y="242">Role tasks</text><text x="523" y="191">Progress</text>`,
  },
  globe: {
    description: "A product interface connects to an illustrative globe. Lines represent worldwide access without depicting actual markets or volume.",
    scene: `<g class="diagram-muted"><rect x="68" y="99" width="132" height="91" rx="3"/><path d="M68 117h132m-115 18h38v39H85zm50 3h46m-46 12h38m-38 12h45"/><circle cx="86" cy="109" r="2"/><circle cx="96" cy="109" r="2"/></g>
      <path class="channel" d="M200 143C272 143 294 76 416 76M200 143c96 0 139 75 231 75m-231-75h292"/>
      <path class="signal" pathLength="100" d="M200 143C272 143 294 76 416 76M200 143c96 0 139 75 231 75m-231-75h292"/>
      <g class="diagram-edge"><circle cx="422" cy="141" r="84"/><ellipse cx="422" cy="141" rx="42" ry="84"/><ellipse cx="422" cy="141" rx="78" ry="34"/><path d="M338 141h168m-84-84v168"/></g>
      <text x="134" y="222">Product</text><text x="422" y="254">Global access</text>`,
  },
  modules: {
    description: "Two separate frontend modules coordinate through an explicit information boundary.",
    scene: `<path class="channel" d="M155 142h104m82 0h104"/><path class="signal" pathLength="100" d="M155 142h104m82 0h104"/>
      <g class="diagram-edge"><path d="M62 101h93v82H62zm383 0h93v82h-93zM77 120h62m-62 16h51m-51 16h37m385-32h39m-62 16h51m-51 16h37"/><rect x="259" y="112" width="82" height="60" stroke-dasharray="4 3"/></g>
      <text x="110" y="215">Module A</text><text x="300" y="215">Shared contract</text><text x="490" y="215">Module B</text>`,
  },
  config: {
    description: "Shared rendering rules turn two different configurations into region-specific forms.",
    scene: `<path class="channel" d="M148 100h59v89h-59m59-44h102m66 0h55V98h36m-36 47v44h36"/><path class="signal" pathLength="100" d="M148 100h59v89h-59m59-44h102m66 0h55V98h36m-36 47v44h36"/>
      <g class="diagram-edge"><path d="M78 75h70v50H78zm0 89h70v50H78zM309 111h66v66h-66zM466 65h69v66h-69zm0 91h69v66h-69zM92 90h42m-42 13h32m-32 76h42m-42 13h32m350-110h45m-45 12h36m-36 12h45m-45 66h45m-45 13h29m-29 13h39"/></g>
      <text x="113" y="244">Configure</text><text x="342" y="213">Render</text><text x="501" y="247">Forms</text>`,
  },
  calculator: {
    description: "A date goes into the Life Calculator and elapsed time comes out in different units.",
    scene: `<path class="channel" d="M148 144h106m92 0h106"/><path class="signal" pathLength="100" d="M148 144h106m92 0h106"/>
      <g class="diagram-edge"><rect x="77" y="110" width="71" height="67" rx="2"/><path d="M77 129h71m-55-26v15m39-15v15m-39 23h39m-39 12h39m-39 12h39"/><circle cx="300" cy="144" r="46"/><path d="M300 110v34l23 14"/><path d="M452 110h70v67h-70zM465 128h43m-43 13h43m-43 13h43"/></g>
      <text x="111" y="214">Start date</text><text x="300" y="214">Calculate</text><text x="486" y="214">Elapsed time</text>`,
  },
  root: {
    description: "A highlighted path traces a symptom back through a network to its source.",
    scene: `<g class="diagram-muted"><path d="M77 85 190 144 271 61 398 124 515 78M86 210l104-66 99 43 109-63 126 67m-235-4-18-126 35 177 92-114"/><circle cx="77" cy="85" r="6"/><circle cx="86" cy="210" r="6"/><circle cx="190" cy="144" r="6"/><circle cx="271" cy="61" r="6"/><circle cx="289" cy="187" r="6"/><circle cx="398" cy="124" r="6"/><circle cx="515" cy="78" r="6"/><circle cx="524" cy="191" r="6"/></g>
      <path class="channel" d="M524 191l-126-67-92 114"/><path class="signal" pathLength="100" d="M524 191l-126-67-92 114"/>
      <circle class="point" cx="306" cy="238" r="7"/><circle class="diagram-edge" cx="306" cy="238" r="15"/><text x="360" y="243">Source</text><text x="520" y="216">Symptom</text>`,
  },
  simplicity: {
    description: "Five inputs enter a single system, which exposes one clear path to the user.",
    scene: `<path class="channel" d="M121 57c87 0 56 83 179 83m-179-43c87 0 56 43 179 43M121 140h179m-179 43c87 0 56-43 179-43m-179 83c87 0 56-83 179-83m34 0h147"/>
      <path class="signal" pathLength="100" d="M121 57c87 0 56 83 179 83m-179-43c87 0 56 43 179 43M121 140h179m-179 43c87 0 56-43 179-43m-179 83c87 0 56-83 179-83m34 0h147"/>
      <g class="diagram-edge"><path d="m317 106 31 34-31 34-31-34z"/><circle cx="481" cy="140" r="12"/><path d="M106 57h15m-15 40h15m-15 43h15m-15 43h15m-15 40h15"/></g><text x="111" y="255">Inputs</text><text x="481" y="180">One path</text>`,
  },
  workshop: {
    description: "A personal computer connects conceptually to hardware, Android builds, self-hosted tools and local AI.",
    scene: `<path class="channel" d="M255 137h-60V78h-57m57 59v63h-57m207-63h60V78h57m-57 59v63h57"/><path class="signal" pathLength="100" d="M255 137h-60V78h-57m57 59v63h-57m207-63h60V78h57m-57 59v63h57"/>
      <g class="diagram-edge"><path d="M255 104h90v60h-90zM243 168h114l9 10H234zm-143-110h38v40h-38zm0 122h38v40h-38zm362-122h38v40h-38zm0 122h38v40h-38z"/><path d="M109 70h20m-20 8h20m-20 8h13m-17 111h26m338-124h24m-24 11h15m-16 111h25"/></g>
      <text x="119" y="122">Hardware</text><text x="119" y="244">Android</text><text x="481" y="122">Self-hosting</text><text x="481" y="244">Local AI</text><text x="300" y="213">Laptop</text>`,
  },
};

export function diagram(kind) {
  const { scene, description } = art[kind];
  return `<figure class="technical-diagram" data-motion>
    <svg viewBox="0 0 600 277" aria-hidden="true" fill="none"><path class="diagram-corners" d="M24 54V24h30m492 0h30v30M24 223v30h30m492 0h30v-30"/>${scene}</svg>
    <figcaption class="sr-only">${e(description)}</figcaption>
  </figure>`;
}

export const retroArt = `<svg viewBox="0 0 500 290" fill="none" aria-hidden="true" class="retro-art">
  <g stroke="#e58d60" stroke-width="1.5"><path d="M95 241h310M133 214v-155h231v155z" stroke-dasharray="3 6" opacity=".55"/>
  <path d="M158 54h176l14 16v130H144V69z" fill="#422317"/><path d="M161 73h168v103H161z" fill="#1c110e"/><path d="M203 200v21h80v-21m-94 21h112l16 17H173z" fill="#5c2c1b"/><circle cx="325" cy="187" r="3.5" fill="#ffb483"/><path d="M178 94h19l10 10-10 10h-19m35 0h18" stroke="#ffc291"/></g></svg>`;

export const prismArt = `<figure class="prism-visual" data-motion><svg viewBox="0 0 610 290" fill="none" aria-hidden="true"><g class="diagram-muted"><path d="M52 104h505M96 66v175m121-175v175m120-175v175m120-175v175" stroke-dasharray="3 8"/></g><path class="prism-main" d="M63 103h484"/><path class="channel" d="M111 103c59 0 37 83 104 83h159c63 0 40-83 104-83m-206 83c36 0 26 47 64 47h90"/><path class="signal" pathLength="100" d="M111 103c59 0 37 83 104 83h159c63 0 40-83 104-83m-206 83c36 0 26 47 64 47h90"/><g class="diagram-edge"><circle cx="86" cy="103" r="6"/><circle cx="111" cy="103" r="6"/><circle cx="217" cy="186" r="6"/><circle cx="340" cy="186" r="6"/><circle cx="478" cy="103" r="6"/><circle cx="373" cy="233" r="6"/></g><text x="88" y="81">main</text><text x="269" y="164">feature branch</text><text x="403" y="213">review</text></svg><figcaption class="sr-only">An illustrative branch plan shows a feature branch, review branch and return to main.</figcaption></figure>`;
