/**
 * Snap Plants — site interactions
 */
(function () {
  "use strict";

  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Year ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Nav scroll + mobile menu ---- */
  const nav = document.getElementById("nav");
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");

  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function closeMenu() {
    if (!nav || !menuToggle || !mobileNav) return;
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    mobileNav.hidden = true;
    document.body.style.overflow = "";
  }

  function openMenu() {
    if (!nav || !menuToggle || !mobileNav) return;
    nav.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
    mobileNav.hidden = false;
    document.body.style.overflow = "hidden";
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      if (mobileNav.hidden) openMenu();
      else closeMenu();
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  /* ---- Reveal on scroll ---- */
  const reveals = document.querySelectorAll(".reveal");

  if (prefersReduced) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---- Walkthrough ---- */
  const walk = document.querySelector("[data-walkthrough]");
  if (walk) {
    const panels = Array.from(walk.querySelectorAll("[data-step-panel]"));
    const tabs = Array.from(walk.querySelectorAll("[data-step]"));
    const pips = Array.from(walk.querySelectorAll(".walkthrough__pips span"));
    const prevBtn = walk.querySelector("[data-walk-prev]");
    const nextBtn = walk.querySelector("[data-walk-next]");
    let current = 0;
    const total = panels.length;

    function goTo(index) {
      if (index < 0 || index >= total) return;
      current = index;

      panels.forEach((panel, i) => {
        const active = i === current;
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
      });

      tabs.forEach((tab, i) => {
        const active = i === current;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });

      pips.forEach((pip, i) => {
        pip.classList.toggle("is-active", i === current);
      });

      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) {
        nextBtn.disabled = false;
        const label = nextBtn.childNodes[0];
        if (current === total - 1) {
          nextBtn.setAttribute("aria-label", "Back to first step");
        } else {
          nextBtn.setAttribute("aria-label", "Next step");
        }
      }
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const step = parseInt(tab.getAttribute("data-step"), 10);
        if (!Number.isNaN(step)) goTo(step);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", () => goTo(current - 1));
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (current >= total - 1) goTo(0);
        else goTo(current + 1);
      });
    }

    // Keyboard support when walkthrough is focused
    walk.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(Math.min(current + 1, total - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(Math.max(current - 1, 0));
      }
    });

    // Swipe support on stage
    const stage = walk.querySelector(".walkthrough__stage");
    if (stage) {
      let startX = 0;
      let startY = 0;

      stage.addEventListener(
        "touchstart",
        (e) => {
          const t = e.changedTouches[0];
          startX = t.screenX;
          startY = t.screenY;
        },
        { passive: true }
      );

      stage.addEventListener(
        "touchend",
        (e) => {
          const t = e.changedTouches[0];
          const dx = t.screenX - startX;
          const dy = t.screenY - startY;
          if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
          if (dx < 0) goTo(Math.min(current + 1, total - 1));
          else goTo(Math.max(current - 1, 0));
        },
        { passive: true }
      );
    }

    goTo(0);
  }

  /* ---- Lightbox ---- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCap = document.getElementById("lightboxCap");
  const lightboxClose = document.getElementById("lightboxClose");
  let lastFocus = null;

  function openLightbox(src, caption) {
    if (!lightbox || !lightboxImg) return;
    lastFocus = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = caption || "App screenshot";
    if (lightboxCap) lightboxCap.textContent = caption || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  document.querySelectorAll("[data-lightbox]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openLightbox(btn.getAttribute("data-lightbox"), btn.getAttribute("data-caption"));
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightbox && !lightbox.hidden) closeLightbox();
      if (mobileNav && !mobileNav.hidden) closeMenu();
    }
  });

  /* ---- Waitlist form (localStorage preview) ---- */
  const form = document.getElementById("waitlistForm");
  const success = document.getElementById("waitlistSuccess");
  const emailInput = document.getElementById("email");

  const STORAGE_KEY = "snap-plants-waitlist";

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function getEmails() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveEmail(email) {
    const list = getEmails();
    if (!list.includes(email)) {
      list.push(email);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  }

  // Restore success state if already signed up this browser
  if (form && success && getEmails().length > 0) {
    // Don't hide form permanently — allow another email, but that's fine
  }

  if (form && emailInput) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = emailInput.value.trim().toLowerCase();

      if (!isValidEmail(email)) {
        emailInput.classList.add("is-invalid");
        emailInput.setAttribute("aria-invalid", "true");
        emailInput.focus();
        return;
      }

      emailInput.classList.remove("is-invalid");
      emailInput.removeAttribute("aria-invalid");
      saveEmail(email);

      if (success) {
        success.hidden = false;
      }
      form.reset();

      // Soft hide form after success for a cleaner feel
      form.setAttribute("aria-hidden", "true");
      form.style.display = "none";
    });

    emailInput.addEventListener("input", () => {
      emailInput.classList.remove("is-invalid");
      emailInput.removeAttribute("aria-invalid");
    });
  }

  /* ---- Smooth anchor offset for fixed nav ---- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.offsetHeight : 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
      history.pushState(null, "", id);
    });
  });
})();
