(() => {
  "use strict";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const finePointer = window.matchMedia(
    "(pointer: fine)"
  ).matches;

  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  const navLinks = [...document.querySelectorAll(".nav-links a")];

  /* =========================================
     MOBILE NAVIGATION
     ========================================= */

  function isMobile() {
    return window.matchMedia("(max-width: 760px)").matches;
  }

  function isMenuOpen() {
    return menuButton?.getAttribute("aria-expanded") === "true";
  }

  function closeMenu() {
    nav?.classList.remove("open", "is-open");

    menuButton?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
  }

  function openMenu() {
    nav?.classList.add("open", "is-open");

    menuButton?.classList.add("is-open");
    menuButton?.setAttribute("aria-expanded", "true");
    menuButton?.setAttribute("aria-label", "Close navigation");

    // Keep the header visible while the menu is open.
    header?.classList.remove("nav-hidden");
  }

  // Set a consistent initial state.
  if (menuButton) {
    menuButton.setAttribute("type", "button");
    if (nav?.id) {
      menuButton.setAttribute("aria-controls", nav.id);
    }
    closeMenu();
  }

  menuButton?.addEventListener("click", (event) => {
    event.stopPropagation();

    if (isMenuOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close the menu when a navigation link is selected.
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close the menu when clicking outside the header.
  document.addEventListener("click", (event) => {
    if (
      nav &&
      header &&
      isMenuOpen() &&
      !header.contains(event.target)
    ) {
      closeMenu();
    }
  });

  // Escape closes the mobile menu and returns focus to the button.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMenuOpen()) {
      closeMenu();
      menuButton?.focus();
    }
  });

  // Close the menu when keyboard focus leaves the header.
  header?.addEventListener("focusout", (event) => {
    if (
      isMenuOpen() &&
      event.relatedTarget &&
      !header.contains(event.relatedTarget)
    ) {
      closeMenu();
    }
  });

  // Reset menu state when switching between mobile and desktop.
  window.addEventListener("resize", () => {
    if (!isMobile()) {
      closeMenu();
    }
  });

  /* =========================================
     CURRENT NAVIGATION LINK
     ========================================= */

  const sections = navLinks
    .map((link) => {
      const selector = link.getAttribute("href");

      if (!selector?.startsWith("#") || selector.length < 2) {
        return null;
      }

      return document.getElementById(selector.slice(1));
    })
    .filter(Boolean);

  function setActiveLink(id) {
    navLinks.forEach((link) => {
      const active =
        link.getAttribute("href") === `#${id}`;

      link.classList.toggle("active", active);

      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visible.length) {
          setActiveLink(visible[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );

    sections.forEach((section) => {
      activeObserver.observe(section);
    });
  }

  /* =========================================
     REVEAL ANIMATIONS
     ========================================= */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  if (reduceMotion) {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* =========================================
     CURSOR GLOW
     ========================================= */

  const glow = document.querySelector(".cursor-glow");

  if (glow && !reduceMotion && finePointer) {
    window.addEventListener(
      "pointermove",
      (event) => {
        glow.style.left = `${event.clientX}px`;
        glow.style.top = `${event.clientY}px`;
      },
      { passive: true }
    );
  }

  /* =========================================
     PROJECT CARD TILT
     ========================================= */

  if (!reduceMotion && finePointer) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) / rect.width - 0.5;

        const y =
          (event.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `
          perspective(900px)
          rotateY(${x * 3.5}deg)
          rotateX(${-y * 3.5}deg)
          translateY(-3px)
        `;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* =========================================
     COPYRIGHT YEAR
     ========================================= */

  const year = document.querySelector("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* =========================================
     ACHIEVEMENT / CERTIFICATE LIGHTBOX
     ========================================= */

  (() => {
    const lightbox = document.getElementById(
      "milestone-lightbox"
    );

    if (!lightbox) return;

    const title = document.getElementById(
      "milestone-lightbox-title"
    );

    const caption = document.getElementById(
      "milestone-lightbox-caption"
    );

    const image = document.getElementById(
      "milestone-lightbox-image"
    );

    const cards = document.querySelectorAll(
      "[data-milestone]"
    );

    const closeButtons = lightbox.querySelectorAll(
      "[data-close-lightbox]"
    );

    const milestones = {
      zenith: {
        title: "ZENITH’24 — Data Voyage",
        caption:
          "Runner-up · Three-day bootcamp and hackathon · MLR Institute of Technology · 7–9 November 2024",
        image: "assets/zenith-24-runner-up.jpg",
        alt:
          "Certificate of Achievement for runner-up in ZENITH’24: Data Voyage"
      },

      technovanza: {
        title: "Technovanza 4.0 — Team Straw Hats",
        caption:
          "Selected in the internal hackathon for Smart India Hackathon 2024 · CMR Technical Campus · 6 September 2024",
        image: "assets/technovanza-4-hackathon.jpg",
        alt:
          "Certificate of Appreciation for Technovanza 4.0"
      },

      graduation: {
        title: "Graduation Ceremony",
        caption:
          "Celebrating the completion of my Computer Science and Engineering degree at CMR Technical Campus, 2026.",
        image: "assets/graduation-ceremony.jpg",
        alt:
          "Rupas receiving a graduation certificate from faculty"
      },

      googlecloud: {
        title:
          "Google Cloud Career Launchpad — Data Analyst Track",
        caption:
          "Completed all courses and labs · Issued 30 September 2024 · Certificate ID: C6giXksR · Does not expire",
        image: "assets/google-cloud-data-analyst.png",
        alt:
          "Google Cloud Career Launchpad Data Analyst track certificate"
      }
    };

    let lastFocused = null;

    function openMilestone(key, trigger) {
      const item = milestones[key];

      if (!item) return;

      lastFocused = trigger;

      title.textContent = item.title;
      caption.textContent = item.caption;
      image.src = item.image;
      image.alt = item.alt;

      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");

      document.body.classList.add("lightbox-open");

      lightbox
        .querySelector(".milestone-lightbox-close")
        ?.focus();
    }

    function closeMilestone() {
      if (!lightbox.classList.contains("is-open")) return;

      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");

      document.body.classList.remove("lightbox-open");

      image.removeAttribute("src");

      if (lastFocused) {
        lastFocused.focus();
      }
    }

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        openMilestone(
          card.dataset.milestone,
          card
        );
      });
    });

    closeButtons.forEach((button) => {
      button.addEventListener("click", closeMilestone);
    });

    lightbox
      .querySelector(".milestone-lightbox-panel")
      ?.addEventListener("click", (event) => {
        event.stopPropagation();
      });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        lightbox.classList.contains("is-open")
      ) {
        closeMilestone();
      }
    });
  })();

  /* =========================================
     NAVBAR — HIDE ON SCROLL DOWN
     SHOW ON SCROLL UP
     ========================================= */

  if (header) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const scrollThreshold = 8;
    const topOffset = 80;

    function updateNavbar() {
      const currentScrollY = window.scrollY;

      const menuOpen = isMenuOpen();

      if (currentScrollY <= topOffset || menuOpen) {
        header.classList.remove("nav-hidden");
      } else if (
        currentScrollY - lastScrollY > scrollThreshold
      ) {
        header.classList.add("nav-hidden");
      } else if (
        lastScrollY - currentScrollY > scrollThreshold
      ) {
        header.classList.remove("nav-hidden");
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateNavbar);
          ticking = true;
        }
      },
      { passive: true }
    );

    updateNavbar();
  }
})();