/**
 * ==========================================================================
 * Apex Auto Detailing - Modern Vanilla JavaScript Engine
 * Clean, semantic, and production-ready.
 * ==========================================================================
 */

/**
 * Centralized Business Configuration
 * Edit these values easily to update business information across the site.
 */
export const BUSINESS_CONFIG = {
  name: "Apex Auto Detailing",
  shortName: "Apex Auto",
  tagline: "The Ultimate Shine, Every Single Time.",
  address: "45 Macquarie St, Parramatta NSW 2150, Australia",
  addressGoogleMapsUrl: "https://maps.google.com/?q=45+Macquarie+St,+Parramatta+NSW+2150,+Australia",
  phoneDisplay: "+61 452 154 555",
  phoneRaw: "+61452154555",
  operatingHours: {
    regular: "Saturday to Thursday: 8:30 AM – 10:00 PM",
    friday: "Closed (Weekend)",
    schedule: [
      { day: "Saturday", open: "08:30", close: "22:00", isClosed: false, text: "8:30 AM – 10:00 PM" },
      { day: "Sunday", open: "08:30", close: "22:00", isClosed: false, text: "8:30 AM – 10:00 PM" },
      { day: "Monday", open: "08:30", close: "22:00", isClosed: false, text: "8:30 AM – 10:00 PM" },
      { day: "Tuesday", open: "08:30", close: "22:00", isClosed: false, text: "8:30 AM – 10:00 PM" },
      { day: "Wednesday", open: "08:30", close: "22:00", isClosed: false, text: "8:30 AM – 10:00 PM" },
      { day: "Thursday", open: "08:30", close: "22:00", isClosed: false, text: "8:30 AM – 10:00 PM" },
      { day: "Friday", open: null, close: null, isClosed: true, text: "Closed (Weekend)" }
    ]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initLiveHoursStatus();
  initSmoothScroll();
  initBookingSystem();
  initScrollAnimations();
  initYear();
});

/**
 * Navigation Bar (Sticky header & Mobile Hamburger Drawer)
 */
function initNavbar() {
  const header = document.querySelector(".header");
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const mobileNavDrawer = document.querySelector(".mobile-nav-drawer");
  const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  // Sticky header background on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  }, { passive: true });

  // Toggle mobile drawer
  function toggleMobileNav(open) {
    const shouldOpen = open !== undefined ? open : !mobileNavDrawer?.classList.contains("active");
    if (shouldOpen) {
      mobileNavDrawer?.classList.add("active");
      mobileNavOverlay?.classList.add("active");
      hamburgerBtn?.classList.add("active");
      hamburgerBtn?.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    } else {
      mobileNavDrawer?.classList.remove("active");
      mobileNavOverlay?.classList.remove("active");
      hamburgerBtn?.classList.remove("active");
      hamburgerBtn?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  }

  hamburgerBtn?.addEventListener("click", () => toggleMobileNav());
  mobileNavOverlay?.addEventListener("click", () => toggleMobileNav(false));

  // Close when clicking any mobile nav link
  mobileNavLinks.forEach(link => {
    link.addEventListener("click", () => toggleMobileNav(false));
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNavDrawer?.classList.contains("active")) {
      toggleMobileNav(false);
    }
  });
}

/**
 * Smooth scrolling with sticky header offset & active section spy
 */
function initSmoothScroll() {
  const headerHeight = 76;
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const sections = document.querySelectorAll("section[id]");

  navLinks.forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // Scrollspy for active nav link
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - headerHeight - 100;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll(`.nav-link[href*="${sectionId}"], .mobile-nav-link[href*="${sectionId}"]`).forEach(link => {
          link.classList.add("active");
        });
      } else {
        document.querySelectorAll(`.nav-link[href*="${sectionId}"], .mobile-nav-link[href*="${sectionId}"]`).forEach(link => {
          link.classList.remove("active");
        });
      }
    });
  }, { passive: true });
}

/**
 * Real-Time Operating Status in Sydney/Parramatta Timezone (AEST/AEDT)
 */
function initLiveHoursStatus() {
  const statusBadge = document.getElementById("live-status-badge");
  const statusText = document.getElementById("live-status-text");
  
  if (!statusBadge || !statusText) return;

  function checkOpenStatus() {
    // Current time in Sydney (Australia/Sydney)
    const sydneyDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Australia/Sydney" }));
    const dayOfWeek = sydneyDate.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
    const currentHour = sydneyDate.getHours();
    const currentMinute = sydneyDate.getMinutes();
    const currentTimeVal = currentHour * 60 + currentMinute;

    // Highlight current day in schedule table
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDayName = dayNames[dayOfWeek];

    document.querySelectorAll(".hours-row").forEach(row => {
      const rowDay = row.getAttribute("data-day");
      if (rowDay === currentDayName) {
        row.classList.add("highlight-today");
        if (!row.querySelector(".today-indicator")) {
          const badge = document.createElement("span");
          badge.className = "today-indicator";
          badge.textContent = "Today";
          row.querySelector(".hours-day")?.appendChild(badge);
        }
      } else {
        row.classList.remove("highlight-today");
        row.querySelector(".today-indicator")?.remove();
      }
    });

    // Friday (5) is Closed
    if (dayOfWeek === 5) {
      statusBadge.className = "live-status-badge closed";
      statusText.textContent = "Closed Today (Friday Weekend)";
      return;
    }

    // Saturday-Thursday: 8:30 AM (510 mins) to 10:00 PM (1320 mins)
    const openTimeVal = 8 * 60 + 30; // 08:30 AM
    const closeTimeVal = 22 * 60;    // 10:00 PM

    if (currentTimeVal >= openTimeVal && currentTimeVal < closeTimeVal) {
      statusBadge.className = "live-status-badge open";
      statusText.textContent = "Open Now · Closes 10:00 PM";
    } else {
      statusBadge.className = "live-status-badge closed";
      statusText.textContent = "Closed Now · Opens 8:30 AM";
    }
  }

  checkOpenStatus();
  // Refresh every 60 seconds
  setInterval(checkOpenStatus, 60000);
}

/**
 * Interactive Booking & Modal Management
 */
function initBookingSystem() {
  const modal = document.getElementById("booking-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const openModalBtns = document.querySelectorAll(".open-booking-modal");
  const modalServiceSelect = document.getElementById("modal-package-select");
  const quickServiceSelect = document.getElementById("quick-package-select");

  // Open booking modal
  function openModal(preselectedService = "") {
    if (!modal) return;
    if (preselectedService && modalServiceSelect) {
      modalServiceSelect.value = preselectedService;
    }
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    // Focus first input
    const firstInput = modal.querySelector("input");
    firstInput?.focus();
  }

  // Close booking modal
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const service = btn.getAttribute("data-service") || "";
      openModal(service);
    });
  });

  modalCloseBtn?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("active")) {
      closeModal();
    }
  });

  // Handle Quick Form Submission
  const quickForm = document.getElementById("quick-booking-form");
  const quickFeedback = document.getElementById("quick-form-feedback");

  if (quickForm && quickFeedback) {
    quickForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(quickForm);
      const name = formData.get("name")?.toString().trim();
      const phone = formData.get("phone")?.toString().trim();
      const packageType = formData.get("package")?.toString();

      if (!name || !phone) {
        quickFeedback.className = "form-feedback error";
        quickFeedback.textContent = "Please fill in your name and phone number.";
        return;
      }

      quickFeedback.className = "form-feedback success";
      quickFeedback.innerHTML = `✓ Thank you, <strong>${name}</strong>! Your inquiry for <strong>${packageType || 'our detailing service'}</strong> has been received. Our team will call <strong>${phone}</strong> shortly to confirm your booking.`;
      quickForm.reset();

      setTimeout(() => {
        quickFeedback.style.display = "none";
      }, 9000);
    });
  }

  // Handle Modal Form Submission
  const modalForm = document.getElementById("modal-booking-form");
  const modalFeedback = document.getElementById("modal-form-feedback");

  if (modalForm && modalFeedback) {
    modalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(modalForm);
      const name = formData.get("name")?.toString().trim();
      const phone = formData.get("phone")?.toString().trim();
      const packageType = formData.get("package")?.toString();

      if (!name || !phone) {
        modalFeedback.className = "form-feedback error";
        modalFeedback.textContent = "Please provide your name and contact phone number.";
        return;
      }

      modalFeedback.className = "form-feedback success";
      modalFeedback.innerHTML = `✓ Thank you, <strong>${name}</strong>! Your booking request for <strong>${packageType}</strong> has been secured. We will contact you at <strong>${phone}</strong> to confirm the exact bay time slot.`;
      modalForm.reset();

      setTimeout(() => {
        closeModal();
        modalFeedback.style.display = "none";
      }, 4000);
    });
  }
}

/**
 * Scroll Reveal Animation (Intersection Observer)
 */
function initScrollAnimations() {
  if (!("IntersectionObserver" in window)) return;

  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Set Dynamic Current Year
 */
function initYear() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }
}
