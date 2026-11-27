import { openPhoto } from "./photos.js";

const root = document.documentElement;
root.classList.add("js");
const motion = matchMedia("(prefers-reduced-motion: reduce)");
const menu = document.querySelector("#mobile-menu");
const toggle = document.querySelector(".menu-toggle");
const mobileFaqToggle = document.querySelector(".mobile-faq-toggle");
const faqQuestions = document.querySelector("#faq-questions");

function setMobileFaq(open) {
  faqQuestions.classList.toggle("mobile-open", open);
  mobileFaqToggle.setAttribute("aria-expanded", String(open));
}
mobileFaqToggle?.addEventListener("click", () => setMobileFaq(mobileFaqToggle.getAttribute("aria-expanded") === "false"));

function setMenu(open) {
  menu.hidden = !open;
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

toggle.addEventListener("click", () => setMenu(menu.hidden));
menu.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  setMenu(false);
  if (link.hash === "#faq" && mobileFaqToggle) setMobileFaq(true);
  const target = document.querySelector(link.hash);
  if (target) {
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !menu.hidden) {
    setMenu(false);
    toggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!menu.hidden && !event.target.closest(".mobile-nav")) setMenu(false);
});

const reveal = new IntersectionObserver((entries, observer) => {
  for (const { target, isIntersecting } of entries) {
    if (!isIntersecting) continue;
    target.classList.add("revealed");
    observer.unobserve(target);
  }
}, { rootMargin: "0px 0px 10% 0px" });
document.querySelectorAll("[data-reveal]").forEach((element) => reveal.observe(element));

const reading = document.querySelector(".reading-dialog");
let readingLink;
reading?.addEventListener("close", () => readingLink?.focus());
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-photo], a[data-article]");
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (link.hasAttribute("data-photo")) {
    openPhoto(link);
    return;
  }
  const excerpt = document.getElementById(link.dataset.article);
  reading.querySelector("h2").textContent = link.firstChild.textContent;
  reading.querySelector(".reading-body").replaceChildren(...excerpt.querySelector("div").cloneNode(true).children);
  readingLink = link;
  reading.showModal();
});

function followFragment() {
  let id;
  try {
    id = decodeURIComponent(location.hash.slice(1));
  } catch {
    return;
  }
  const target = document.getElementById(id);
  if (id === "faq" && mobileFaqToggle) setMobileFaq(true);
  if (!target) return;
  const article = target.closest(".secondary-card, .archive-entry");
  const disclosure = article?.querySelector(":scope > details.disclosure");
  if (disclosure) disclosure.open = true;
  if (article) requestAnimationFrame(() => article.scrollIntoView({ behavior: "instant" }));
}
window.addEventListener("hashchange", followFragment);
followFragment();

const carousel = document.querySelector("[data-carousel]");
const controls = document.querySelectorAll("[data-carousel-step]");
const motionButton = document.querySelector("[data-motion-toggle]");
let motionPaused = false;
let hoveringCarousel = false;

function moveCarousel(direction) {
  const card = carousel.firstElementChild;
  const gap = parseFloat(getComputedStyle(carousel).gap);
  const end = carousel.scrollWidth - carousel.clientWidth;
  const next = carousel.scrollLeft + direction * (card.offsetWidth + gap);
  const position = next > end + card.offsetWidth / 2 ? 0 : next < -card.offsetWidth / 2 ? end : next;
  carousel.scrollTo({ left: position, behavior: motion.matches || motionPaused ? "instant" : "smooth" });
}
controls.forEach((button) => button.addEventListener("click", () => moveCarousel(Number(button.dataset.carouselStep))));
carousel?.addEventListener("pointerenter", () => { hoveringCarousel = true; });
carousel?.addEventListener("pointerleave", () => { hoveringCarousel = false; });
if (carousel) {
  const visible = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    const tick = () => {
      const bounds = carousel.getBoundingClientRect();
      if (!motion.matches && !motionPaused && !hoveringCarousel && !carousel.parentElement.contains(document.activeElement) &&
          document.visibilityState === "visible" && bounds.bottom > 0 && bounds.top < innerHeight) moveCarousel(1);
    };
    window.setInterval(tick, 5000);
    visible.disconnect();
  });
  visible.observe(carousel);
}
motionButton.addEventListener("click", () => {
  motionPaused = !motionPaused;
  root.classList.toggle("motion-paused", motionPaused);
  motionButton.setAttribute("aria-pressed", String(motionPaused));
  motionButton.textContent = motionPaused ? "Resume motion" : "Pause motion";
});
document.querySelector("[data-print]")?.addEventListener("click", () => window.print());
let demoModule;
for (const demo of document.querySelectorAll("[data-demo]")) {
  const mount = () => {
    if (!demo.open) return;
    demoModule ??= import("./demos.js");
    demoModule.then(({ mountDemo }) => mountDemo(demo));
    demo.removeEventListener("toggle", mount);
  };
  demo.addEventListener("toggle", mount);
  mount();
}
