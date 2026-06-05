/* ═══════════════════════════════════════
   NEXUS LANDING PAGE — script.js
═══════════════════════════════════════ */

(function () {
  "use strict";

  /* ── Selectors ── */
  const navbar    = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("navLinks");
  const form      = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  /* ─────────────────────────────────────
     1. Navbar scroll effect
  ───────────────────────────────────── */
  function handleNavScroll() {
    if (window.scrollY > 30) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load

  /* ─────────────────────────────────────
     2. Mobile hamburger menu
  ───────────────────────────────────── */
  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("open");
    navLinks.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });

  /* ─────────────────────────────────────
     3. Active nav link highlight on scroll
  ───────────────────────────────────── */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = navLinks.querySelectorAll("a[href^='#']");

  function setActiveLink() {
    let current = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute("id");
    });

    navAnchors.forEach((a) => {
      a.classList.remove("active");
      if (a.getAttribute("href") === `#${current}`) {
        a.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", setActiveLink, { passive: true });

  /* ─────────────────────────────────────
     4. Scroll reveal (Intersection Observer)
  ───────────────────────────────────── */
  const revealTargets = [
    // About
    { el: ".about-visual",       delay: 0   },
    { el: ".about-text",         delay: 0.1 },

    // Features
    { el: ".section-header",     delay: 0   },
    { el: ".feature-card:nth-child(1)", delay: 0   },
    { el: ".feature-card:nth-child(2)", delay: 0.12 },
    { el: ".feature-card:nth-child(3)", delay: 0.24 },

    // Contact
    { el: ".contact-left",       delay: 0   },
    { el: ".contact-form",       delay: 0.1 },
  ];

  revealTargets.forEach(({ el, delay }) => {
    document.querySelectorAll(el).forEach((node) => {
      node.classList.add("reveal");
      node.style.transitionDelay = `${delay}s`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  /* ─────────────────────────────────────
     5. Contact form submission
  ───────────────────────────────────── */
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const inputs = form.querySelectorAll("input, textarea");
      let valid = true;

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = "#ff5a5a";
          input.addEventListener(
            "input",
            () => (input.style.borderColor = ""),
            { once: true }
          );
        }
      });

      if (!valid) return;

      // Simulate async send
      const btn = form.querySelector("button[type='submit']");
      btn.textContent = "Sending…";
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = "Sent ✓";
        btn.style.background = "#22c55e";
        formSuccess.classList.add("show");
        form.reset();

        setTimeout(() => {
          btn.textContent = "Send Message →";
          btn.style.background = "";
          btn.disabled = false;
          formSuccess.classList.remove("show");
        }, 4000);
      }, 1200);
    });
  }

  /* ─────────────────────────────────────
     6. Smooth scroll for anchor links
        (polyfill for older browsers; modern
         browsers use CSS scroll-behavior)
  ───────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ─────────────────────────────────────
     7. Parallax effect on hero orbs
  ───────────────────────────────────── */
  const orbs = document.querySelectorAll(".orb");

  window.addEventListener(
    "mousemove",
    (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 14;
        orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
      });
    },
    { passive: true }
  );

  /* ─────────────────────────────────────
     8. Animate stat numbers
  ───────────────────────────────────── */
  function animateCounter(el, target, suffix, duration) {
    let start = 0;
    const step = (target / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start) + suffix;
      }
    }, 16);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const raw = el.textContent;

        if (raw.includes("%")) animateCounter(el, 99.9, "%", 1200);
        if (raw.includes("+")) animateCounter(el, 200, "+", 1000);

        statsObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  document
    .querySelectorAll(".stat-num")
    .forEach((el) => statsObserver.observe(el));

})();
const email = document.getElementById("email");

if (!email.value.includes("@")) {
  valid = false;
  email.style.borderColor = "#ff5a5a";
}