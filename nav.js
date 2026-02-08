// nav.js — Plasma-style top bar (safe to load in <head>)
(function () {
  function init() {
    const links = [
      { href: "send.html", label: "Send" },
      { href: "claim.html", label: "Claim" },
      { href: "dashboard.html", label: "Dashboard" },
    ];

    const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();

    const hasSession =
      !!sessionStorage.getItem("plasmaPrivateKey") ||
      !!sessionStorage.getItem("plasmaUser") ||
      !!localStorage.getItem("plasmaUserWallet");

    const header = document.createElement("header");
    header.className = "plasma-topbar";
    header.innerHTML = `
      <div class="plasma-topbar__inner">
        <a class="plasma-brand" href="index.html" aria-label="Plasma home">
          <img class="plasma-brand__logo" src="assets/plasma-logo.svg" alt="Plasma"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';" />
          <span class="plasma-brand__text" style="display:none;">Plasma</span>
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
            🌐
          </button>
          <a id="plasmaCta" class="plasma-cta" href="${hasSession ? "dashboard.html" : "login.html"}">
            Go to Dashboard →
          </a>
        </div>
      </div>
    `;

    // Inject topbar
    document.body.prepend(header);

    // Remove the old per-page header (the green title bar)
    const legacyHeader = document.querySelector("body > header:not(.plasma-topbar)");
    if (legacyHeader) legacyHeader.remove();
  }

  // Make sure body exists (because nav.js is loaded in <head>)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
