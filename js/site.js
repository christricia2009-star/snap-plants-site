/**
 * Snap Plants — shared site interactions
 */
(function () {
  "use strict";

  const reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Year */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* Nav scroll + mobile */
  const nav = document.getElementById("siteNav");
  const menuBtn = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 20);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function closeMenu() {
    if (!mobileMenu || !menuBtn) return;
    mobileMenu.hidden = true;
    mobileMenu.setAttribute("hidden", "");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function openMenu() {
    if (!mobileMenu || !menuBtn) return;
    mobileMenu.hidden = false;
    mobileMenu.removeAttribute("hidden");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      if (mobileMenu.hidden) openMenu();
      else closeMenu();
    });
    mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  }

  /* Reveal */
  const reveals = document.querySelectorAll(".reveal");
  if (reduced) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* Smooth anchor offset */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const banner = document.querySelector(".testing-banner");
      const navH = (nav ? nav.offsetHeight : 72) + (banner ? banner.offsetHeight : 0);
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
      if (history.pushState) history.pushState(null, "", id);
    });
  });

  /* Platform switcher (iOS / Android) */
  const PLATFORM_KEY = "snap-plants-platform";
  const platformBtns = document.querySelectorAll("[data-set-platform]");
  const platformPanels = document.querySelectorAll("[data-platform-panel]");
  const platformTexts = document.querySelectorAll("[data-platform-text]");

  function setPlatform(platform) {
    if (platform !== "ios" && platform !== "android") platform = "ios";
    document.body.setAttribute("data-platform", platform);
    try {
      localStorage.setItem(PLATFORM_KEY, platform);
    } catch (_) {}

    platformBtns.forEach((btn) => {
      const on = btn.getAttribute("data-set-platform") === platform;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });

    platformPanels.forEach((el) => {
      const match = el.getAttribute("data-platform-panel") === platform;
      if (match) {
        el.hidden = false;
        el.removeAttribute("hidden");
      } else {
        el.hidden = true;
        el.setAttribute("hidden", "");
      }
    });

    platformTexts.forEach((el) => {
      const match = el.getAttribute("data-platform-text") === platform;
      if (match) {
        el.hidden = false;
        el.removeAttribute("hidden");
      } else {
        el.hidden = true;
        el.setAttribute("hidden", "");
      }
    });

    // Sync hash for shareable platform view
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("platform", platform);
      history.replaceState(null, "", url.pathname + url.search + url.hash);
    } catch (_) {}
  }

  platformBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setPlatform(btn.getAttribute("data-set-platform"));
    });
  });

  // Init platform: URL > localStorage > default ios
  (function initPlatform() {
    let initial = "ios";
    try {
      const q = new URLSearchParams(window.location.search).get("platform");
      if (q === "ios" || q === "android") initial = q;
      else {
        const stored = localStorage.getItem(PLATFORM_KEY);
        if (stored === "ios" || stored === "android") initial = stored;
      }
    } catch (_) {}
    setPlatform(initial);
  })();

  /* Walkthrough (supports multiple platform panels) */
  function initWalkthrough(walk) {
    const panels = Array.from(walk.querySelectorAll("[data-step-panel]"));
    const tabs = Array.from(walk.querySelectorAll("[data-step]"));
    const pips = Array.from(walk.querySelectorAll("[data-pip]"));
    const prev = walk.querySelector("[data-walk-prev]");
    const next = walk.querySelector("[data-walk-next]");
    let current = 0;
    const total = panels.length;
    if (!total) return;

    function goTo(i) {
      if (i < 0 || i >= total) return;
      current = i;
      panels.forEach((p, idx) => {
        const on = idx === current;
        p.hidden = !on;
        if (on) p.removeAttribute("hidden");
        else p.setAttribute("hidden", "");
        p.classList.toggle("is-active", on);
      });
      tabs.forEach((t, idx) => {
        const on = idx === current;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      pips.forEach((pip, idx) => {
        pip.classList.toggle("bg-sage", idx === current);
        pip.classList.toggle("bg-forest/20", idx !== current);
        pip.classList.toggle("scale-125", idx === current);
      });
      if (prev) prev.disabled = current === 0;
    }

    tabs.forEach((t) => {
      t.addEventListener("click", () => {
        const s = parseInt(t.getAttribute("data-step"), 10);
        if (!Number.isNaN(s)) goTo(s);
      });
    });
    if (prev) prev.addEventListener("click", () => goTo(current - 1));
    if (next)
      next.addEventListener("click", () => {
        if (current >= total - 1) goTo(0);
        else goTo(current + 1);
      });

    const stage = walk.querySelector("[data-walk-stage]");
    if (stage) {
      let sx = 0,
        sy = 0;
      stage.addEventListener(
        "touchstart",
        (e) => {
          sx = e.changedTouches[0].screenX;
          sy = e.changedTouches[0].screenY;
        },
        { passive: true }
      );
      stage.addEventListener(
        "touchend",
        (e) => {
          const dx = e.changedTouches[0].screenX - sx;
          const dy = e.changedTouches[0].screenY - sy;
          if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
          if (dx < 0) goTo(Math.min(current + 1, total - 1));
          else goTo(Math.max(current - 1, 0));
        },
        { passive: true }
      );
    }

    goTo(0);
  }

  document.querySelectorAll("[data-walkthrough]").forEach(initWalkthrough);

  /* Lightbox */
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbCap = document.getElementById("lightboxCap");
  const lbClose = document.getElementById("lightboxClose");
  let lastFocus = null;

  function openLb(src, cap) {
    if (!lightbox || !lbImg) return;
    lastFocus = document.activeElement;
    lbImg.src = src;
    lbImg.alt = cap || "Screenshot";
    if (lbCap) lbCap.textContent = cap || "";
    lightbox.hidden = false;
    lightbox.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    if (lbClose) lbClose.focus();
  }

  function closeLb() {
    if (!lightbox || !lbImg) return;
    lightbox.hidden = true;
    lightbox.setAttribute("hidden", "");
    lbImg.removeAttribute("src");
    lbImg.src = "";
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.querySelectorAll("[data-lightbox]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openLb(btn.getAttribute("data-lightbox"), btn.getAttribute("data-caption"));
    });
  });
  if (lbClose) lbClose.addEventListener("click", closeLb);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLb();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightbox && !lightbox.hidden) closeLb();
      if (mobileMenu && !mobileMenu.hidden) closeMenu();
    }
  });

  /* Beta tester request form */
  const betaForm = document.getElementById("betaForm");
  if (betaForm) {
    const success = document.getElementById("betaSuccess");
    const again = document.getElementById("betaAgain");
    const KEY = "snap-plants-beta";
    const fields = {
      name: betaForm.querySelector('[name="name"]'),
      email: betaForm.querySelector('[name="email"]'),
      device: betaForm.querySelector('[name="device"]'),
      notes: betaForm.querySelector('[name="notes"]'),
    };

    function clearBetaErrors() {
      betaForm.querySelectorAll(".beta-input, .beta-platform__card").forEach((el) => {
        el.classList.remove("ring-2", "ring-red-400");
      });
    }

    betaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearBetaErrors();

      const name = (fields.name && fields.name.value.trim()) || "";
      const email = (fields.email && fields.email.value.trim().toLowerCase()) || "";
      const platformEl = betaForm.querySelector('input[name="platform"]:checked');
      const platform = (platformEl && platformEl.value) || "";
      const device = (fields.device && fields.device.value.trim()) || "";
      const notes = (fields.notes && fields.notes.value.trim()) || "";

      let ok = true;
      if (!name) {
        if (fields.name) fields.name.classList.add("ring-2", "ring-red-400");
        ok = false;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (fields.email) fields.email.classList.add("ring-2", "ring-red-400");
        ok = false;
      }
      if (!platform) {
        betaForm.querySelectorAll(".beta-platform__card").forEach((el) => {
          el.classList.add("ring-2", "ring-red-400");
        });
        ok = false;
      }
      if (!ok) return;

      const entry = {
        name,
        email,
        platform,
        device: device || null,
        notes: notes || null,
        at: new Date().toISOString(),
      };

      try {
        const list = JSON.parse(localStorage.getItem(KEY) || "[]");
        list.push(entry);
        localStorage.setItem(KEY, JSON.stringify(list));
      } catch (_) {}

      const subject = encodeURIComponent(`Snap Plants beta request — ${platform}`);
      const body = encodeURIComponent(
        [
          "I'd like to join the Snap Plants beta.",
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          `Platform: ${platform}`,
          `Device: ${device || "(not provided)"}`,
          "",
          "Brief details:",
          notes || "(none)",
          "",
          "— Sent from snapplants site",
        ].join("\n")
      );
      window.location.href = `mailto:admin@snapcollectibles.com?subject=${subject}&body=${body}`;

      betaForm.style.display = "none";
      if (success) {
        success.hidden = false;
        success.removeAttribute("hidden");
      }
    });

    betaForm.querySelectorAll(".beta-input").forEach((el) => {
      el.addEventListener("input", () => el.classList.remove("ring-2", "ring-red-400"));
    });
    betaForm.querySelectorAll('input[name="platform"]').forEach((el) => {
      el.addEventListener("change", clearBetaErrors);
    });

    if (again) {
      again.addEventListener("click", () => {
        if (success) {
          success.hidden = true;
          success.setAttribute("hidden", "");
        }
        betaForm.style.display = "";
        betaForm.reset();
        const both = betaForm.querySelector('input[name="platform"][value="Both"]');
        if (both) both.checked = true;
      });
    }
  }

  /* Support contact form */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const success = document.getElementById("contactSuccess");
    const KEY = "snap-plants-support";

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]');
      const email = contactForm.querySelector('[name="email"]');
      const message = contactForm.querySelector('[name="message"]');
      const n = name && name.value.trim();
      const em = email && email.value.trim().toLowerCase();
      const msg = message && message.value.trim();

      let ok = true;
      [name, email, message].forEach((el) => el && el.classList.remove("ring-2", "ring-red-400"));

      if (!n) {
        if (name) name.classList.add("ring-2", "ring-red-400");
        ok = false;
      }
      if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
        if (email) email.classList.add("ring-2", "ring-red-400");
        ok = false;
      }
      if (!msg || msg.length < 10) {
        if (message) message.classList.add("ring-2", "ring-red-400");
        ok = false;
      }
      if (!ok) return;

      try {
        const list = JSON.parse(localStorage.getItem(KEY) || "[]");
        list.push({ name: n, email: em, message: msg, at: new Date().toISOString() });
        localStorage.setItem(KEY, JSON.stringify(list));
      } catch (_) {}

      contactForm.style.display = "none";
      if (success) {
        success.hidden = false;
        success.classList.remove("hidden");
      }
    });
  }

  /* Light parallax on hero phone */
  const parallax = document.querySelector("[data-parallax]");
  if (parallax && !reduced) {
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          parallax.style.transform = `translateY(${y * 0.12}px)`;
        }
      },
      { passive: true }
    );
  }
})();
