const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

function toggleMenu(forceState) {
  const shouldOpen = typeof forceState === "boolean" ? forceState : !navMenu.classList.contains("is-open");

  navMenu.classList.toggle("is-open", shouldOpen);
  navToggle.setAttribute("aria-expanded", String(shouldOpen));
  document.body.classList.toggle("menu-open", shouldOpen);
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => toggleMenu());

  navLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 780) {
      toggleMenu(false);
    }
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

function showError(input, message) {
  const formGroup = input.closest(".form-group");
  const errorText = formGroup.querySelector(".error-text");

  formGroup.classList.add("error");
  errorText.textContent = message;
}

function clearError(input) {
  const formGroup = input.closest(".form-group");
  const errorText = formGroup.querySelector(".error-text");

  formGroup.classList.remove("error");
  errorText.textContent = "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const fields = [nameInput, emailInput, messageInput];

    fields.forEach(clearError);
    formStatus.textContent = "";

    let hasError = false;

    if (!nameInput.value.trim()) {
      showError(nameInput, "Please enter your name.");
      hasError = true;
    }

    if (!emailInput.value.trim()) {
      showError(emailInput, "Please enter your email address.");
      hasError = true;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, "Please enter a valid email address.");
      hasError = true;
    }

    if (!messageInput.value.trim()) {
      showError(messageInput, "Please enter a short message.");
      hasError = true;
    } else if (messageInput.value.trim().length < 10) {
      showError(messageInput, "Your message should be at least 10 characters long.");
      hasError = true;
    }

    if (hasError) {
      formStatus.textContent = "Please fix the highlighted fields and try again.";
      return;
    }

    formStatus.textContent = "Thanks! Your message is ready. Connect this form to a backend or service to receive submissions.";
    contactForm.reset();
  });
}
