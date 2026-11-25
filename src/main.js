const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const page = document.documentElement;
const scenes = document.querySelectorAll("[data-motion], [data-reveal]");
const supportsObserver = "IntersectionObserver" in window;

if (supportsObserver) {
  const view = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      target.classList.toggle("in-view", isIntersecting);
      if (isIntersecting && target.hasAttribute("data-reveal")) {
        target.classList.add("revealed");
        if (!target.hasAttribute("data-motion")) view.unobserve(target);
      }
    }
  }, { threshold: 0.14 });
  scenes.forEach((scene) => view.observe(scene));
}

const syncVisibility = () => page.classList.toggle("page-hidden", document.hidden);
document.addEventListener("visibilitychange", syncVisibility);
syncVisibility();

const backgroundControl = document.querySelector("[data-background-motion-toggle]");
let backgroundPaused = false;
if (backgroundControl && supportsObserver) {
  const storageKey = "axvrma-background-paused";
  try { backgroundPaused = sessionStorage.getItem(storageKey) === "true"; } catch {}
  const syncBackgroundMotion = () => {
    page.classList.toggle("background-paused", backgroundPaused);
    backgroundControl.hidden = motionPreference.matches;
    backgroundControl.setAttribute("aria-pressed", String(backgroundPaused));
  };
  backgroundControl.addEventListener("click", () => {
    backgroundPaused = !backgroundPaused;
    try { sessionStorage.setItem(storageKey, String(backgroundPaused)); } catch {}
    syncBackgroundMotion();
  });
  motionPreference.addEventListener("change", syncBackgroundMotion);
  syncBackgroundMotion();
}

const marquee = document.querySelector("[data-marquee]");
if (marquee && supportsObserver) {
  const control = marquee.querySelector("[data-marquee-toggle]");
  const updateControl = () => {
    control.hidden = motionPreference.matches;
  };
  control.addEventListener("click", () => {
    const paused = marquee.classList.toggle("marquee-paused");
    control.setAttribute("aria-pressed", String(paused));
    control.querySelector("span").textContent = paused ? "▶" : "Ⅱ";
  });
  motionPreference.addEventListener("change", updateControl);
  updateControl();
}

const art = document.querySelector("[data-pointer]");
if (art && matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let frame = 0;
  art.addEventListener("pointermove", (event) => {
    if (motionPreference.matches || backgroundPaused) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const bounds = art.getBoundingClientRect();
      art.style.setProperty("--pointer-x", ((event.clientX - bounds.left) / bounds.width - 0.5) * 20 + "px");
      art.style.setProperty("--pointer-y", ((event.clientY - bounds.top) / bounds.height - 0.5) * 16 + "px");
    });
  }, { passive: true });
  const reset = () => {
    cancelAnimationFrame(frame);
    art.style.removeProperty("--pointer-x");
    art.style.removeProperty("--pointer-y");
  };
  art.addEventListener("pointerleave", reset);
  motionPreference.addEventListener("change", reset);
}

const assembly = document.querySelector("[data-assembly]");
if (assembly) {
  const control = assembly.querySelector("button");
  control.hidden = false;
  control.addEventListener("click", () => {
    const assembled = assembly.classList.toggle("assembled");
    control.setAttribute("aria-pressed", String(assembled));
  });
}

function openFragment() {
  let id;
  try {
    id = decodeURIComponent(location.hash.slice(1));
  } catch {
    return;
  }
  const target = document.getElementById(id);
  if (!target) return;
  const entry = target.closest(".work-entry, .archive-entry");
  const homeDetail = target.closest(".principles-scene, .recognition-scene");
  const disclosure = target.closest("details") ?? (entry || homeDetail)?.querySelector("details.disclosure");
  if (disclosure && !disclosure.open) {
    disclosure.open = true;
    if (target.closest("details") && target !== disclosure) target.scrollIntoView();
  }
}
openFragment();
addEventListener("hashchange", openFragment);

let demos;
for (const demo of document.querySelectorAll("[data-demo]")) {
  const mount = () => {
    if (!demo.open) return;
    demos ??= import("./demos.js");
    demos.then(({ mountDemo }) => mountDemo(demo));
    demo.removeEventListener("toggle", mount);
  };
  demo.addEventListener("toggle", mount);
  mount();
}

if ("HTMLDialogElement" in window) {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-photo]");
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    import("./photos.js").then(({ openPhoto }) => openPhoto(link));
  });
}

const print = document.querySelector(".print-resume");
if (print) {
  print.hidden = false;
  print.addEventListener("click", () => {
    page.classList.add("printing-resume");
    window.print();
  });
  addEventListener("afterprint", () => page.classList.remove("printing-resume"));
}
