const arithmetic = `
  <form class="demo-form" data-calculator autocomplete="off">
    <label for="arithmetic-input">Expression</label>
    <input id="arithmetic-input" name="expression" type="text" value="(12 + 3) × 4" maxlength="160" spellcheck="false" aria-describedby="arithmetic-help">
    <p id="arithmetic-help">Use +, −, × and ÷, or type +, -, * and /. Press Enter to calculate.</p>
    <div class="demo-actions"><button type="submit" class="button button-primary">Calculate</button><button type="reset" class="button button-outline">Clear</button></div>
    <output for="arithmetic-input" aria-live="polite"></output>
  </form>`;

const life = `
  <form class="demo-form" data-life autocomplete="off" novalidate>
    <label for="life-date">Starting date</label>
    <input id="life-date" name="start" type="date" aria-describedby="life-help">
    <p id="life-help">Try any past date. Each total is measured from midnight in your time zone using fixed 24-hour days. Your date stays in this page.</p>
    <div class="demo-actions"><button type="submit" class="button button-primary">Calculate elapsed time</button><button type="reset" class="button button-outline">Clear</button></div>
    <p data-message role="status"></p>
    <dl class="elapsed-units" hidden>
      <div><dt>Days</dt><dd data-unit="days"></dd></div>
      <div><dt>Hours</dt><dd data-unit="hours"></dd></div>
      <div><dt>Minutes</dt><dd data-unit="minutes"></dd></div>
      <div><dt>Seconds</dt><dd data-unit="seconds"></dd></div>
    </dl>
  </form>`;

const regions = `
  <div class="demo-form" data-regions>
    <fieldset class="demo-options">
      <legend>Fictional service region</legend>
      <label><input type="radio" name="region" value="coast" checked> Coast</label>
      <label><input type="radio" name="region" value="highlands"> Highlands</label>
    </fieldset>
    <div class="demo-columns">
      <div><h3>Configuration</h3><pre data-config></pre></div>
      <div><h3>Rendered fields</h3><div class="demo-fields" data-fields></div></div>
    </div>
    <p role="status" class="demo-status"></p>
  </div>`;

const shipment = `
  <div class="demo-form" data-shipment>
    <fieldset class="demo-options">
      <legend>Example shipment</legend>
      <label><input type="radio" name="shipment" value="standard" checked> Standard freight</label>
      <label><input type="radio" name="shipment" value="cooled"> Temperature-controlled freight</label>
    </fieldset>
    <ol class="shipment-tasks" data-tasks></ol>
    <p role="status" class="demo-status"></p>
  </div>`;

const demos = {
  calculator: {
    title: "The first calculator",
    copy: "A modern recreation. My original supported multiple operands and BODMAS; this version also accepts parentheses and decimals. For example, multiplication takes precedence in 2 + 3 × 4, which gives 14.",
    panel: arithmetic,
  },
  life: {
    title: "Life Calculator",
    copy: "A modern recreation of my Android app. It expresses the same stretch of elapsed time in days, hours, minutes and seconds. For example, one fixed 24-hour day is 1,440 minutes.",
    panel: life,
  },
  regions: {
    title: "One renderer, two regions",
    copy: "A public illustration using fictional support regions. Coast asks for a berth and callback window. Highlands asks for a site and access notes. Both use the same rendering rules.",
    panel: regions,
  },
  shipment: {
    title: "Explore a fictional shipment",
    copy: "A standard shipment might start with a filing review. In this example, a temperature-controlled shipment adds a cold-chain check. The selected configuration sets the sequence and the assigned roles.",
    panel: shipment,
  },
};

export function demo(id) {
  if (id === "desktop") return `
    <details class="demo retro-demo" id="retro-desktop">
      <summary>The first computer</summary>
      <p>A modern recreation inspired by the computer I explored as a child.</p>
      <div class="retro-desktop">
        <div class="retro-bar"><span>Home computer</span><span aria-hidden="true">▁ □</span></div>
        <details><summary>▤ <span>Notepad</span></summary><div><h3>Notes</h3><p>What does this button do? That was usually enough to keep me busy for another hour.</p></div></details>
        <details><summary>▦ <span>Applications</span></summary><div><h3>Applications</h3><p>Paint was for experimenting. Word and Excel were for finding menu items no one else at home had clicked yet.</p></div></details>
      </div>
    </details>`;
  const { title, copy, panel } = demos[id];
  return `<details class="demo" data-demo="${id}">
    <summary>${title}</summary>
    <p>${copy}</p>
    <div class="demo-interactive" hidden>${panel}</div>
    <noscript><p>The interactive version requires JavaScript.</p></noscript>
  </details>`;
}
