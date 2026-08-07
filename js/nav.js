/* ShieldBox — mobile nav disclosure.
   Below 640px the secondary nav links are hidden (.nav-link-desktop).
   Before this file existed they were hidden with no replacement, which made
   Services and Brief Example unreachable on a phone. This wires the hamburger
   that reveals them. Shared by index.html and quote.html. */
(() => {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  const toggle = nav.querySelector(".nav-toggle");
  const panel = nav.querySelector(".nav-panel");
  if (!toggle || !panel) return;

  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", () => {
    const next = !isOpen();
    setOpen(next);
    /* Move focus into the panel so keyboard and screen reader users land on
       the links they just revealed instead of being stranded on the button. */
    if (next) {
      const first = panel.querySelector("a");
      if (first) first.focus();
    }
  });

  /* Escape closes and returns focus to the trigger. */
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  /* Tapping outside the nav closes it. */
  document.addEventListener("click", event => {
    if (isOpen() && !nav.contains(event.target)) setOpen(false);
  });

  /* Following a link closes the panel so it never covers the destination. */
  panel.addEventListener("click", event => {
    if (event.target.closest("a")) setOpen(false);
  });

  /* Reset state if the viewport grows past the breakpoint while open. */
  const wide = window.matchMedia("(min-width: 641px)");
  const reset = () => { if (wide.matches) setOpen(false); };
  if (wide.addEventListener) wide.addEventListener("change", reset);
  else if (wide.addListener) wide.addListener(reset);
})();
