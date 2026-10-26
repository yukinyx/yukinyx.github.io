/* Small interactions for the static portfolio. jQuery is used for event binding and class updates. */
document.documentElement.classList.add("js");

$(function () {
  const $body = $("body");
  const $menuToggle = $(".menu-toggle");
  const $navLinks = $("#nav-links");

  // Open or close the mobile navigation and keep its expanded state accessible.
  function setMenuOpen(isOpen) {
    $menuToggle.attr("aria-expanded", String(isOpen));
    $menuToggle.attr("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    $navLinks.toggleClass("is-open", isOpen);
    $body.toggleClass("menu-open", isOpen);
  }

  $menuToggle.on("click", function () {
    setMenuOpen($menuToggle.attr("aria-expanded") !== "true");
  });
  $navLinks.find("a").on("click", function () {
    setMenuOpen(false);
  });
  $(document).on("keydown", function (event) {
    if (event.key === "Escape" && $menuToggle.attr("aria-expanded") === "true") {
      setMenuOpen(false);
      $menuToggle.trigger("focus");
    }
  });
  $(window).on("resize", function () {
    if (window.innerWidth > 800) setMenuOpen(false);
  });

  // Reveal content as it enters the viewport, with reduced-motion and browser fallbacks.
  function setupScrollReveal() {
    const elements = document.querySelectorAll(".reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      elements.forEach(function (element) { element.classList.add("is-visible"); });
      return;
    }
    const observer = new IntersectionObserver(function (entries, currentObserver) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach(function (element) { observer.observe(element); });
  }
  setupScrollReveal();

  // Mark the navigation link for whichever page section is most visible.
  function setupActiveNavigation() {
    const sections = document.querySelectorAll("main section[id]");
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const target = "#".concat(entry.target.id);
        $(".nav-links a").removeClass("is-active").filter('[href="' + target + '"]').addClass("is-active");
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(function (section) { observer.observe(section); });
  }
  setupActiveNavigation();

  // Replace a missing requested project image with its local SVG placeholder.
  function setupImageFallbacks() {
    $("img[data-fallback]").on("error", function () {
      const fallback = this.dataset.fallback;
      if (fallback && this.getAttribute("src") !== fallback) {
        this.src = fallback;
      }
    });
  }
  setupImageFallbacks();

  // Filter projects by their category tags without removing cards from the page.
  function setupProjectFilters() {
    $(".filter-button").on("click", function () {
      const selected = this.dataset.filter;
      $(".filter-button").removeClass("is-active").attr("aria-pressed", "false");
      $(this).addClass("is-active").attr("aria-pressed", "true");
      $(".project-card").each(function () {
        const categories = (this.dataset.category || "").split(/\s+/);
        this.hidden = selected !== "all" && !categories.includes(selected);
      });
    });
  }
  setupProjectFilters();

  // Load the active gallery slide and keep its caption, image description, and counter together.
  function setupCarousel() {
    const $gallery = $("[data-gallery]");
    if (!$gallery.length) return;
    const slides = JSON.parse($gallery.find("[data-gallery-slides]").text());
    const $image = $gallery.find("[data-gallery-image]");
    let currentIndex = 0;

    function showSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      const slide = slides[currentIndex];
      $image.attr({ src: slide.src, "data-fallback": slide.fallback, alt: slide.alt });
      $gallery.find("[data-gallery-current]").text(String(currentIndex + 1).padStart(2, "0"));
      $gallery.find("[data-gallery-caption]").text(slide.caption);
      $gallery.find("[data-lightbox-open]").attr("aria-label", "Enlarge HydroDeck " + slide.caption.toLowerCase());
    }

    $gallery.find("[data-gallery-prev]").on("click", function () { showSlide(currentIndex - 1); });
    $gallery.find("[data-gallery-next]").on("click", function () { showSlide(currentIndex + 1); });
    $gallery.find("[data-gallery-image]").on("click", function () { openLightbox(); });

    // Open the current screenshot in a dialog-sized image view.
    function openLightbox() {
      const $lightbox = $("#lightbox");
      $lightbox.find("[data-lightbox-image]").attr({ src: $image.attr("src"), alt: $image.attr("alt") });
      $lightbox.find("[data-lightbox-caption]").text($gallery.find("[data-gallery-caption]").text());
      $lightbox.addClass("is-open").attr("aria-hidden", "false");
      $body.addClass("lightbox-open");
      $lightbox.find("[data-lightbox-close]").trigger("focus");
    }

    // Close the image view, return focus to its opener, or respond to Escape.
    function closeLightbox() {
      const $lightbox = $("#lightbox");
      if (!$lightbox.hasClass("is-open")) return;
      $lightbox.removeClass("is-open").attr("aria-hidden", "true");
      $lightbox.find("[data-lightbox-image]").attr({ src: "", alt: "" });
      $body.removeClass("lightbox-open");
      $gallery.find("[data-lightbox-open]").trigger("focus");
    }
    $gallery.find("[data-lightbox-open]").on("click", openLightbox);
    $("#lightbox [data-lightbox-close]").on("click", closeLightbox);
    $("#lightbox").on("click", function (event) {
      if (event.target === this) closeLightbox();
    });
    $(document).on("keydown", function (event) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "Tab" && $("#lightbox").hasClass("is-open")) {
        event.preventDefault();
        $("#lightbox [data-lightbox-close]").trigger("focus");
      }
    });
  }
  setupCarousel();

  // Show the current year in the footer without needing to update the HTML annually.
  function setupFooterYear() {
    $("#current-year").text(new Date().getFullYear());
  }
  setupFooterYear();

  // Let the browser compose an email from the contact form fields.
  function setupContactForm() {
    $(".contact-form").on("submit", function () {
      const $form = $(this);
      const subject = encodeURIComponent("Portfolio contact from " + $form.find('[name="name"]').val());
      const message = encodeURIComponent(
        "Name: " + $form.find('[name="name"]').val() + "\n" +
        "Email: " + $form.find('[name="email"]').val() + "\n\n" +
        $form.find('[name="message"]').val()
      );
      this.action = "mailto:patricianicole.santos01@gmail.com?subject=" + subject + "&body=" + message;
    });
  }
  setupContactForm();
});
