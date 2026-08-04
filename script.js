const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".main-nav a");
const dropdown = document.querySelector(".dropdown");
const dropdownToggle = document.querySelector(".dropdown-toggle");
const revealItems = document.querySelectorAll(".reveal");
const motionSections = document.querySelectorAll(
  "main > section, .service-hero, .service-section, .footer, .service-footer"
);
const contactForms = document.querySelectorAll(".contact-form, .service-form");
const tiltCards = document.querySelectorAll(".tilt-card");
const transitionNames = [
  "transition-rise",
  "transition-left",
  "transition-right",
  "transition-zoom",
  "transition-tilt"
];

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 20);
});

menuToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("nav-open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (link.classList.contains("dropdown-toggle")) return;
    nav.classList.remove("open");
    document.body.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

dropdownToggle?.addEventListener("click", (event) => {
  event.preventDefault();

  const isOpen = dropdown?.classList.toggle("open");
  dropdownToggle.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  if (!dropdown || dropdown.contains(event.target)) return;
  dropdown.classList.remove("open");
  dropdownToggle?.setAttribute("aria-expanded", "false");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

motionSections.forEach((section, index) => {
  section.classList.add("section-motion", transitionNames[index % transitionNames.length]);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("in-view", entry.isIntersecting);
      entry.target.classList.toggle("out-view", !entry.isIntersecting);
    });
  },
  { threshold: 0.08, rootMargin: "0px" }
);

motionSections.forEach((section) => sectionObserver.observe(section));

tiltCards.forEach((card) => {
  let ticking = false;
  let lastEvent = null;

  card.addEventListener("mousemove", (event) => {
    if (window.matchMedia("(max-width: 900px)").matches) return;
    lastEvent = event;
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = lastEvent.clientX - rect.left;
      const y = lastEvent.clientY - rect.top;
      const rotateX = (0.5 - y / rect.height) * 8;
      const rotateY = (x / rect.width - 0.5) * 8;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      ticking = false;
    });
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

contactForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button");
    const oldText = button.textContent;
    button.textContent = "Submitted";

    window.setTimeout(() => {
      button.textContent = oldText;
      form.reset();
    }, 1800);
  });
});
window.addEventListener("load", () => {
  const pageLoader = document.getElementById("page-loader");
  if (!pageLoader) return;
  setTimeout(() => {
    pageLoader.classList.add("loader-hidden");
    setTimeout(() => pageLoader.remove(), 600);
  }, 700);
});

const accordionToggles = document.querySelectorAll(".accordion-toggle");

accordionToggles.forEach((toggle) => {
  const content = document.getElementById(toggle.getAttribute("aria-controls"));
  if (!content) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";

    toggle.setAttribute("aria-expanded", String(!isOpen));

    if (isOpen) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});
