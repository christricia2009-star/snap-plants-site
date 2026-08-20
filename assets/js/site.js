(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const year = document.querySelector("[data-year]");
  const form = document.querySelector("#beta-form");
  const status = document.querySelector("#beta-status");
  const modal = document.querySelector("#tester-modal");
  const persist = document.querySelector("#android-persist");
  const copyBtn = document.querySelector("#copy-tester-url");
  const copyPersist = document.querySelector("#copy-tester-url-persist");
  const ack = document.querySelector("#tester-copied");
  const doneBtn = document.querySelector("#tester-done");
  const urlInputs = document.querySelectorAll("[data-tester-url]");

  const BETA_INBOX = "admin@snapcollectibles.com";
  const BETA_ENDPOINT = `https://formsubmit.co/ajax/${BETA_INBOX}`;
  const ANDROID_TEST_URL = "https://play.google.com/apps/internaltest/4701169274084912075";
  const APP_NAME = "Snap Plants";

  if (year) year.textContent = String(new Date().getFullYear());
  const selectUrlNode = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  urlInputs.forEach((el) => {
    if ("value" in el) el.value = ANDROID_TEST_URL;
    else el.textContent = ANDROID_TEST_URL;
    el.addEventListener("focus", () => {
      if (el.select) el.select();
      else selectUrlNode(el);
    });
    el.addEventListener("click", () => {
      if (el.select) el.select();
      else selectUrlNode(el);
    });
  });

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const closeNav = () => {
    document.body.classList.remove("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  };

  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  const sectionIds = ["identify", "collection", "trades", "faq", "download"];
  const navLinks = [...document.querySelectorAll(".nav a[href^='#'], .nav a[href*='index.html#']")];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((link) => {
            const href = link.getAttribute("href") || "";
            link.classList.toggle("is-active", href.endsWith(`#${id}`));
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
    );
    sections.forEach((section) => io.observe(section));
  }

  const params = new URLSearchParams(window.location.search);
  const shot = params.get("shot");
  if (shot) {
    document.querySelectorAll("main > section, main > .strip, main > .ember-band").forEach((el) => {
      el.hidden = el.id !== shot;
    });
  }

  const flashCopied = (btn) => {
    if (!btn) return;
    const prev = btn.dataset.label || btn.textContent;
    btn.dataset.label = prev;
    btn.textContent = "Copied";
    window.setTimeout(() => {
      btn.textContent = btn.dataset.label;
    }, 1600);
  };

  const copyUrl = async (btn) => {
    try {
      await navigator.clipboard.writeText(ANDROID_TEST_URL);
      flashCopied(btn);
    } catch {
      const field = document.querySelector("#tester-url");
      if (field) selectUrlNode(field);
      try {
        document.execCommand("copy");
        flashCopied(btn);
      } catch {
        window.prompt("Copy this Android tester URL and keep it:", ANDROID_TEST_URL);
      }
    }
  };

  const openAndroidGate = (email) => {
    if (!modal) return;
    document.body.classList.add("tester-open");
    modal.hidden = false;
    modal.dataset.email = email || "";
    if (ack) ack.checked = false;
    if (doneBtn) doneBtn.disabled = true;
    const note = modal.querySelector("[data-tester-email]");
    if (note && email) note.textContent = email;
    (copyBtn || document.querySelector("#tester-url"))?.focus();
  };

  const closeAndroidGate = () => {
    document.body.classList.remove("tester-open");
    if (modal) modal.hidden = true;
  };

  const showAndroidPersist = () => {
    if (form) form.hidden = true;
    if (persist) persist.hidden = false;
    persist?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const preview = params.get("preview");
  if (preview === "android") {
    window.addEventListener("load", () => openAndroidGate("you@greenhouse.local"));
  } else if (preview === "android-kept") {
    window.addEventListener("load", () => {
      if (form) form.hidden = true;
      if (persist) persist.hidden = false;
      const download = document.getElementById("download");
      download?.scrollIntoView({ block: "start" });
    });
  }

  copyBtn?.addEventListener("click", () => copyUrl(copyBtn));
  copyPersist?.addEventListener("click", () => copyUrl(copyPersist));

  ack?.addEventListener("change", () => {
    if (doneBtn) doneBtn.disabled = !ack.checked;
  });

  doneBtn?.addEventListener("click", () => {
    if (!ack?.checked) {
      if (status) {
        status.dataset.state = "err";
        status.textContent = "Check the box after you copy the URL. Google will not email you this link.";
      }
      return;
    }
    closeAndroidGate();
    showAndroidPersist();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (document.body.classList.contains("tester-open")) {
        event.preventDefault();
        return;
      }
      closeNav();
    }
  });

  if (form && status) {
    const submitBtn = form.querySelector('button[type="submit"]');

    const mailtoFallback = (appName, os, email) => {
      const subject = "Snap Plants beta tester request";
      const body = [
        `App Name: ${appName}`,
        `Phone OS: ${os}`,
        `Email: ${email}`,
      ].join("\n");
      window.location.href = `mailto:${BETA_INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const emailInput = form.querySelector("#email");
      const appInput = form.querySelector("#app-name");
      const osInput = form.querySelector('input[name="Phone OS"]:checked');
      const honey = form.querySelector('input[name="_honey"]');
      const email = (emailInput?.value || "").trim().toLowerCase();
      const appName = (appInput?.value || APP_NAME).trim();
      const os = osInput?.value || "";

      if (honey?.value) return;

      if (!os) {
        status.dataset.state = "err";
        status.textContent = "Pick iOS or Android.";
        return;
      }

      if (!email || !emailInput?.checkValidity()) {
        status.dataset.state = "err";
        status.textContent = "Need a valid email so we can add you to the tester list.";
        return;
      }

      status.dataset.state = "";
      status.textContent = "Sending request…";
      if (submitBtn) submitBtn.disabled = true;

      const payload = {
        "App Name": appName,
        "Phone OS": os,
        email,
        _subject: "Snap Plants beta tester request",
        _template: "table",
        _captcha: "false",
      };

      const finishOk = (viaMailto) => {
        if (os === "Android") {
          status.dataset.state = "ok";
          status.textContent = viaMailto
            ? `Couldn't reach the mail service. Your mail app should open a message to ${BETA_INBOX}. Keep the Play test URL on the next screen.`
            : `Request sent. Copy the Play test URL next — Google will not email it to you.`;
          openAndroidGate(email);
          form.reset();
          if (appInput) appInput.value = APP_NAME;
          return;
        }

        status.dataset.state = "ok";
        status.textContent = viaMailto
          ? `Couldn't reach the mail service. Your mail app should open a message to ${BETA_INBOX} with App name, phone OS, and email.`
          : `Request sent. We'll follow up at ${email} for the ${os} beta.`;
        form.reset();
        if (appInput) appInput.value = APP_NAME;
      };

      try {
        const response = await fetch(BETA_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        finishOk(false);
      } catch {
        mailtoFallback(appName, os, email);
        finishOk(true);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
})();
