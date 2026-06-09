// --- i18n ---
function setLang(lang) {
  if (!window.T[lang]) lang = "es";
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const k = el.dataset.i18n;
    if (window.T[lang][k]) el.textContent = window.T[lang][k];
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    const k = el.dataset.i18nHtml;
    if (window.T[lang][k]) el.innerHTML = window.T[lang][k];
  });
  document.querySelectorAll(".lang button[data-lang]").forEach(b => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });

  try { localStorage.setItem("lang", lang); } catch (e) {}
}

const savedLang = (() => { try { return localStorage.getItem("lang"); } catch (e) { return null; } })();
const browserLang = (navigator.language || "es").slice(0, 2);
setLang(savedLang || (window.T[browserLang] ? browserLang : "es"));

document.querySelectorAll(".lang button[data-lang]").forEach(b => {
  b.addEventListener("click", () => setLang(b.dataset.lang));
});

// --- tema ---
function setTheme(theme) {
  if (theme !== "light" && theme !== "dark") theme = "light";
  document.documentElement.dataset.theme = theme;
  const btn = document.querySelector(".theme-toggle");
  if (btn) btn.textContent = theme === "light" ? "☾" : "☀";
  try { localStorage.setItem("theme", theme); } catch (e) {}
}
setTheme(document.documentElement.dataset.theme || "light");

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const themeBtn = document.querySelector(".theme-toggle");
if (themeBtn) {
  themeBtn.addEventListener("click", e => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    const swap = () => setTheme(next);

    if (!document.startViewTransition || reduceMotion) {
      swap();
      return;
    }
    // wipe radial desde el botón
    const r = themeBtn.getBoundingClientRect();
    const x = e.clientX || (r.left + r.width / 2);
    const y = e.clientY || (r.top + r.height / 2);
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    document.documentElement.classList.add("vt");
    const vt = document.startViewTransition(swap);
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 560, easing: "cubic-bezier(.16,1,.3,1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
    vt.finished.finally(() => document.documentElement.classList.remove("vt"));
  });
}

// --- reveal al hacer scroll ---
(() => {
  const items = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    let n = 0;
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.setProperty("--reveal-delay", (n++ * 0.07) + "s");
      entry.target.classList.add("in");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
  items.forEach(el => io.observe(el));
})();

// --- contadores ---
(() => {
  const counters = document.querySelectorAll(".count[data-count]");
  const run = el => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (reduceMotion) { el.textContent = String(target).padStart(2, "0"); return; }
    const dur = 800, t0 = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(eased * target)).padStart(2, "0");
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!("IntersectionObserver" in window)) { counters.forEach(run); return; }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      run(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 1 });
  counters.forEach(el => io.observe(el));
})();
