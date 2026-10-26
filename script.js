const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const glow = document.querySelector('.cursor-glow');
if (glow && !reduceMotion && matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 3.5}deg) rotateX(${-y * 3.5}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

const sections = [...document.querySelectorAll('main section[id], main section.hero')];
const navLinks = [...document.querySelectorAll('.nav-links a')];
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id || 'top';
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => activeObserver.observe(section));

document.querySelector('#year').textContent = new Date().getFullYear();


// Clickable achievements/certificates lightbox
(() => {
  const lightbox = document.getElementById("milestone-lightbox");
  if (!lightbox) return;

  const title = document.getElementById("milestone-lightbox-title");
  const caption = document.getElementById("milestone-lightbox-caption");
  const image = document.getElementById("milestone-lightbox-image");
  const cards = document.querySelectorAll("[data-milestone]");
  const milestones = {
    zenith: {
      title: "ZENITH’24 — Data Voyage",
      caption: "Runner-up · Three-day bootcamp and hackathon · MLR Institute of Technology · 7–9 November 2024",
      image: "assets/zenith-24-runner-up.jpg",
      alt: "Certificate of Achievement for runner-up in ZENITH’24: Data Voyage"
    },
    technovanza: {
      title: "Technovanza 4.0 — Team Straw Hats",
      caption: "Selected in the internal hackathon for Smart India Hackathon 2024 · CMR Technical Campus · 6 September 2024",
      image: "assets/technovanza-4-hackathon.jpg",
      alt: "Certificate of Appreciation for Technovanza 4.0"
    },
    graduation: {
      title: "Graduation Ceremony",
      caption: "Celebrating the completion of my Computer Science and Engineering degree at CMR Technical Campus, 2026.",
      image: "assets/graduation-ceremony.jpg",
      alt: "Rupas receiving a graduation certificate from faculty"
    },
    googlecloud: {
      title: "Google Cloud Career Launchpad — Data Analyst Track",
      caption: "Completed all courses and labs · Issued 30 September 2024 · Certificate ID: C6giXksR · Does not expire",
      image: "assets/google-cloud-data-analyst.png",
      alt: "Google Cloud Career Launchpad Data Analyst track certificate"
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
    lightbox.querySelector(".milestone-lightbox-close")?.focus();
  }
  function closeMilestone() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    image.removeAttribute("src");
    if (lastFocused) lastFocused.focus();
  }

  cards.forEach(card => card.addEventListener("click", () => openMilestone(card.dataset.milestone, card)));
  lightbox.querySelectorAll("[data-close-lightbox]").forEach(button => button.addEventListener("click", closeMilestone));
  lightbox.querySelector(".milestone-lightbox-panel")?.addEventListener("click", event => event.stopPropagation());
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) closeMilestone();
  });
})();


/* =========================================
   NAVBAR — SCROLL DIRECTION DETECTION
   ========================================= */

(() => {
  const header = document.querySelector(".site-header");

  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const scrollThreshold = 8;
  const topOffset = 80;

  function updateNavbar() {
    const currentScrollY = window.scrollY;

    const menuToggle = header.querySelector(".menu-toggle");

    const mobileMenuOpen =
      menuToggle?.getAttribute("aria-expanded") === "true";

    // Always show the navbar near the top
    if (currentScrollY <= topOffset) {
      header.classList.remove("nav-hidden");
    }

    // Keep the navbar visible when the mobile menu is open
    else if (mobileMenuOpen) {
      header.classList.remove("nav-hidden");
    }

    // Scrolling down: hide navbar
    else if (
      currentScrollY - lastScrollY > scrollThreshold
    ) {
      header.classList.add("nav-hidden");
    }

    // Scrolling up: show navbar
    else if (
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

  // Set the correct initial state
  updateNavbar();
})();
