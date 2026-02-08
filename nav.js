// nav.js — Plasma-style top bar + optional homepage storyboard (no logic changes)
(function () {
  // NAV LINKS (your request: the "Dashboard" tab should go to index/home)
  const links = [
    { href: "send.html", label: "Send" },
    { href: "claim.html", label: "Claim" },
    { href: "index.html", label: "Dashboard" }, // ✅ Dashboard tab returns to index
  ];

  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  // CTA (your request: text says "Sign in page", not dashboard)
  const ctaHref = "login.html";
  const ctaLabel = "Sign in page →";

  // Build header
  const header = document.createElement("header");
  header.className = "plasma-topbar";
  header.innerHTML = `
    <div class="plasma-topbar__inner">
      <a class="plasma-brand" href="index.html" aria-label="Plasma home">
        <img class="plasma-brand__logo" id="plasmaLogo" alt="Plasma" />
        <span class="plasma-brand__text" id="plasmaLogoText" style="display:none;">Plasma</span>
      </a>

      <nav class="plasma-nav" aria-label="Primary">
        ${links
          .map((l) => {
            const active = l.href.toLowerCase() === current ? "is-active" : "";
            return `<a class="plasma-nav__link ${active}" href="${l.href}">${l.label}</a>`;
          })
          .join("")}
      </nav>

      <div class="plasma-actions">
        <button class="plasma-iconbtn" type="button" aria-label="Language / region (placeholder)" title="Language / region">
          <a class="plasma-iconbtn plasma-iconbtn--logo" href="index.html" aria-label="Home">
  <img src="assets/Logo_symbol_dark.svg" alt="" />
</a>

        </button>
        <a id="plasmaCta" class="plasma-cta" href="${ctaHref}">
          ${ctaLabel}
        </a>
      </div>
    </div>
  `;

  document.body.prepend(header);

  // Try your real logo files in order
  const logoCandidates = [
    "assets/Logo_horizontal_dark.svg",
    "assets/Logo_horizontal_light.svg",
    "assets/Logo_boxed_dark.svg",
    "assets/Logo_symbol_dark.svg",
    "assets/Logo_symbol_light.svg",
  ];

  const img = document.getElementById("plasmaLogo");
  const fallbackText = document.getElementById("plasmaLogoText");

  let i = 0;
  function tryNext() {
    if (!img) return;
    if (i >= logoCandidates.length) {
      img.style.display = "none";
      if (fallbackText) fallbackText.style.display = "inline-block";
      return;
    }
    img.src = logoCandidates[i++];
  }

  if (img) {
    img.onerror = tryNext;
    tryNext();
  }

  // -------------------------------
  // Optional: Homepage storyboard/slideshow
  // Runs ONLY if the markup exists (class .mediaStoryboard).
  // -------------------------------
  function initHomepageStoryboard() {
    const root = document.querySelector(".mediaStoryboard");
    if (!root) return;

    // Respect reduced motion (keep first frame)
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const first = root.querySelector(".sbStep");
      if (first) first.classList.add("is-active");
      return;
    }

    const steps = Array.from(root.querySelectorAll(".sbStep"));
    const bar = root.querySelector(".sbProgress span");
    if (!steps.length || !bar) return;

    let idx = 0;
    const stepMs = 2400;

    function show(i) {
      steps.forEach((el, j) => el.classList.toggle("is-active", j === i));

      // restart progress bar animation
      bar.style.transition = "none";
      bar.style.width = "0%";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bar.style.transition = `width ${stepMs}ms linear`;
          bar.style.width = "100%";
        });
      });
    }

    show(idx);
    setInterval(() => {
      idx = (idx + 1) % steps.length;
      show(idx);
    }, stepMs);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHomepageStoryboard);
  } else {
    initHomepageStoryboard();
  }
})();
