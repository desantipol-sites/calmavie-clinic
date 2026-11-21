const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
}

function closeMenu() {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open menu");
  mobileMenu.hidden = true;
  document.body.classList.remove("menu-open");
}

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const opening = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(opening));
    menuButton.setAttribute("aria-label", opening ? "Close menu" : "Open menu");
    mobileMenu.hidden = !opening;
    document.body.classList.toggle("menu-open", opening);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) closeMenu();
  });
}

const serviceAccordions = document.querySelectorAll(".service-accordion");

serviceAccordions.forEach((accordion) => {
  accordion.addEventListener("toggle", () => {
    if (!accordion.open) return;

    serviceAccordions.forEach((otherAccordion) => {
      if (otherAccordion !== accordion) otherAccordion.open = false;
    });
  });
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const revealTargets = document.querySelectorAll([
  ".hero-media",
  ".work-tile",
  ".medical-feature-images",
  ".service-collage",
  ".studio-photo",
  ".medical-hero-media",
  ".environment-grid figure",
  ".treatment-hero-media",
  ".treatment-results-grid figure"
].join(","));

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  revealTargets.forEach((target) => target.classList.add("image-reveal"));

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      imageObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: "0px 0px -5% 0px"
  });

  revealTargets.forEach((target) => imageObserver.observe(target));
}

/* Rebrand notice: Surrey Nail Artisan is now Calmavie Foot Clinic.
   Shown once; closing it sets a first-party cookie for 12 months. */
(function rebrandNotice() {
  const COOKIE = "calmavie_rebrand_notice";
  const params = new URLSearchParams(window.location.search);
  const forceShow = params.has("rebrand-preview");

  if (!forceShow && document.cookie.split("; ").some((c) => c.indexOf(COOKIE + "=") === 0)) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const overlay = document.createElement("div");
  overlay.className = "rebrand-notice";
  overlay.innerHTML = `
    <div class="rebrand-card" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="rebrand-title" aria-describedby="rebrand-text">
      <button class="rebrand-close" type="button" aria-label="Close this message">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <p class="rebrand-eyebrow">A new name, the same care</p>
      <div class="rebrand-logos">
        <figure class="rebrand-brand rebrand-brand--old">
          <img src="assets/rebrand-surrey-nail-artisan.webp" width="360" height="291" alt="Surrey Nail Artisan logo">
          <figcaption><span>Before</span><strong>Surrey Nail Artisan</strong></figcaption>
        </figure>
        <svg class="rebrand-arrow" viewBox="0 0 40 16" aria-hidden="true"><path d="M2 8h34M29 2l7 6-7 6"/></svg>
        <figure class="rebrand-brand rebrand-brand--new">
          <img src="assets/rebrand-calmavie-emblem.webp" width="300" height="250" alt="Calmavie Foot Clinic logo">
          <figcaption><span>Now</span><strong>Calmavie Foot Clinic</strong></figcaption>
        </figure>
      </div>
      <h2 class="rebrand-title" id="rebrand-title">Surrey Nail Artisan is now Calmavie Foot Clinic</h2>
      <p class="rebrand-text" id="rebrand-text">Same private studio in Hampton and the same one-to-one appointments &ndash; with a new name that reflects our focus on professional foot care.</p>
      <p class="rebrand-natalia">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M7.5 12.3l3 3 6-6.3"/></svg>
        <span><strong>Natalia Pol</strong> is still your foot health professional.</span>
      </p>
      <button class="rebrand-continue" type="button">Continue to the website</button>
    </div>`;

  let lastFocus = null;

  function remember() {
    document.cookie = COOKIE + "=dismissed; max-age=31536000; path=/; SameSite=Lax" +
      (window.location.protocol === "https:" ? "; Secure" : "");
  }

  function close() {
    remember();
    overlay.classList.remove("is-open");
    document.body.classList.remove("rebrand-open");
    document.removeEventListener("keydown", onKey);
    window.setTimeout(() => overlay.remove(), reduceMotion ? 0 : 350);
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function onKey(event) {
    if (event.key === "Escape") {
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = overlay.querySelectorAll("button");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function open() {
    lastFocus = document.activeElement;
    document.body.appendChild(overlay);
    document.body.classList.add("rebrand-open");
    overlay.querySelector(".rebrand-close").addEventListener("click", close);
    overlay.querySelector(".rebrand-continue").addEventListener("click", close);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });
    document.addEventListener("keydown", onKey);
    window.requestAnimationFrame(() => {
      overlay.classList.add("is-open");
      overlay.querySelector(".rebrand-card").focus({ preventScroll: true });
    });
  }

  window.setTimeout(open, forceShow ? 0 : 900);
})();
