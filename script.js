// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Loading screen
  const loadingScreen = document.getElementById("loading-screen")

  // Simulate loading time
  setTimeout(() => {
    loadingScreen.classList.add("hidden")
    document.body.style.overflow = "auto"
  }, 2000)

  // Header scroll effect
  const header = document.getElementById("header")
  const backToTop = document.getElementById("backToTop")

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY > 50

    if (scrolled) {
      header.classList.add("scrolled")
      backToTop.classList.add("visible")
    } else {
      header.classList.remove("scrolled")
      backToTop.classList.remove("visible")
    }
  })

  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle")
  const navLinks = document.getElementById("nav-links")

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active")
      navLinks.classList.toggle("active")
    })
  }

  // Close mobile menu when clicking a link
  const navItems = document.querySelectorAll(".nav-link")
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active")
        menuToggle.classList.remove("active")
      }
    })
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        const headerHeight = header.offsetHeight
        const targetPosition = targetElement.offsetTop - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // Active navigation highlighting
  const sections = document.querySelectorAll("section[id]")

  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY + header.offsetHeight + 50

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionBottom = sectionTop + section.offsetHeight
      const sectionId = section.getAttribute("id")
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`)

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        navItems.forEach((link) => link.classList.remove("active"))
        if (navLink) navLink.classList.add("active")
      }
    })
  })

  // Menu filtering
  const filterBtns = document.querySelectorAll(".filter-btn")
  const menuItems = document.querySelectorAll(".menu-item")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      filterBtns.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      const filter = this.getAttribute("data-filter")

      menuItems.forEach((item) => {
        const category = item.getAttribute("data-category")

        if (filter === "all" || category === filter) {
          item.style.display = "block"
          item.style.opacity = "0"
          item.style.transform = "translateY(20px)"

          // Add stagger animation
          setTimeout(() => {
            item.style.opacity = "1"
            item.style.transform = "translateY(0)"
          }, 100)
        } else {
          item.style.opacity = "0"
          item.style.transform = "translateY(20px)"

          setTimeout(() => {
            item.style.display = "none"
          }, 300)
        }
      })
    })
  })

  // Testimonials slider
  const testimonials = document.querySelectorAll(".testimonial")
  const testimonialBtns = document.querySelectorAll(".testimonial-btn")
  let currentTestimonial = 0

  function showTestimonial(index) {
    testimonials.forEach((testimonial) => testimonial.classList.remove("active"))
    testimonialBtns.forEach((btn) => btn.classList.remove("active"))

    testimonials[index].classList.add("active")
    testimonialBtns[index].classList.add("active")
  }

  testimonialBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      currentTestimonial = index
      showTestimonial(currentTestimonial)
    })
  })

  // Auto-rotate testimonials
  setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length
    showTestimonial(currentTestimonial)
  }, 5000)

  // Fade in animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Observe elements for fade-in animation
  document.querySelectorAll(".fade-in, .feature-card, .menu-item, .gallery-item").forEach((el) => {
    el.classList.add("fade-in")
    observer.observe(el)
  })

  // Contact form submission
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const formStatus = document.getElementById("formStatus")
      const formData = new FormData(this)

      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalText = submitBtn.innerHTML
      submitBtn.innerHTML = "<span>Sending...</span>"
      submitBtn.disabled = true

      // Send form data using fetch
      fetch("contact.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            formStatus.textContent = data.message
            formStatus.className = "form-status success"
            contactForm.reset()
          } else {
            formStatus.textContent = data.message
            formStatus.className = "form-status error"
          }
          formStatus.style.display = "block"

          // Reset button
          submitBtn.innerHTML = originalText
          submitBtn.disabled = false

          // Hide status after 5 seconds
          setTimeout(() => {
            formStatus.style.display = "none"
          }, 5000)
        })
        .catch((error) => {
          formStatus.textContent = "Sorry, there was an error sending your message. Please try again later."
          formStatus.className = "form-status error"
          formStatus.style.display = "block"

          // Reset button
          submitBtn.innerHTML = originalText
          submitBtn.disabled = false

          // Hide status after 5 seconds
          setTimeout(() => {
            formStatus.style.display = "none"
          }, 5000)
        })
    })
  }

  // Newsletter form submission
  const newsletterForm = document.getElementById("newsletterForm")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const emailInput = this.querySelector('input[type="email"]')
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent

      if (!emailInput.value) {
        alert("Please enter your email address.")
        return
      }

      // Show loading state
      submitBtn.textContent = "Subscribing..."
      submitBtn.disabled = true

      // Simulate subscription
      setTimeout(() => {
        alert("Thank you for subscribing to our newsletter!")
        newsletterForm.reset()
        submitBtn.textContent = originalText
        submitBtn.disabled = false
      }, 1000)
    })
  }

  // Quick order buttons
  document.querySelectorAll(".quick-order-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation()

      const menuItem = this.closest(".menu-item")
      const itemName = menuItem.querySelector("h3").textContent
      const itemPrice = menuItem.querySelector(".price").textContent

      // Simulate quick order
      alert(`Added "${itemName}" (${itemPrice}) to your order!`)
    })
  })

  // Gallery lightbox effect
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", function () {
      const img = this.querySelector("img")
      const overlay = this.querySelector(".gallery-overlay")

      if (img && overlay) {
        const title = overlay.querySelector("h3").textContent
        const description = overlay.querySelector("p").textContent

        // Create lightbox
        const lightbox = document.createElement("div")
        lightbox.className = "lightbox"
        lightbox.innerHTML =
          '<div class="lightbox-content">' +
          '<img src="' +
          img.src +
          '" alt="' +
          img.alt +
          '">' +
          '<div class="lightbox-info">' +
          "<h3>" +
          title +
          "</h3>" +
          "<p>" +
          description +
          "</p>" +
          "</div>" +
          '<button class="lightbox-close">&times;</button>' +
          "</div>"

        document.body.appendChild(lightbox)
        document.body.style.overflow = "hidden"

        // Close lightbox
        lightbox.addEventListener("click", (e) => {
          if (e.target === lightbox || e.target.classList.contains("lightbox-close")) {
            document.body.removeChild(lightbox)
            document.body.style.overflow = "auto"
          }
        })
      }
    })
  })

  // Back to top button
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Current time and status
  function updateCurrentStatus() {
    const now = new Date()
    const day = now.getDay() // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours()

    let isOpen = false

    // Check if currently open based on hours
    if (day >= 1 && day <= 5) {
      // Monday - Friday
      isOpen = hour >= 7 && hour < 20
    } else if (day === 6) {
      // Saturday
      isOpen = hour >= 8 && hour < 21
    } else if (day === 0) {
      // Sunday
      isOpen = hour >= 8 && hour < 18
    }

    const statusIndicator = document.querySelector(".status-indicator")
    const statusText = document.querySelector(".status-text")

    if (statusIndicator && statusText) {
      if (isOpen) {
        statusIndicator.style.background = "#4CAF50"
        statusText.textContent = "Currently Open"
      } else {
        statusIndicator.style.background = "#F44336"
        statusText.textContent = "Currently Closed"
      }
    }
  }

  // Update status immediately and every minute
  updateCurrentStatus()
  setInterval(updateCurrentStatus, 60000)

  // Parallax effect for hero section
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const heroBackground = document.querySelector(".hero-background")

    if (heroBackground) {
      const speed = scrolled * 0.5
      heroBackground.style.transform = `translateY(${speed}px)`
    }
  })

  // Image loading handling
  document.querySelectorAll("img").forEach((img) => {
    // Ensure image is visible immediately
    img.style.opacity = "1"

    // Add loaded class when image loads
    img.addEventListener("load", function () {
      this.classList.add("loaded")
      this.style.opacity = "1"
    })

    // If image is already loaded (cached)
    if (img.complete) {
      img.classList.add("loaded")
      img.style.opacity = "1"
    }
  })

  // Force visibility for all images after page load
  window.addEventListener("load", () => {
    document.querySelectorAll("img").forEach((img) => {
      img.style.opacity = "1"
      img.style.visibility = "visible"
    })
  })

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    // ESC key to close mobile menu
    if (e.key === "Escape" && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active")
      menuToggle.classList.remove("active")
    }

    // Arrow keys for testimonial navigation
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const direction = e.key === "ArrowLeft" ? -1 : 1
      currentTestimonial = (currentTestimonial + direction + testimonials.length) % testimonials.length
      showTestimonial(currentTestimonial)
    }
  })

  // Add hover effects to cards
  document.querySelectorAll(".feature-card, .menu-item, .gallery-item").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })

  // Initialize scroll animations
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll("[data-animate]")

    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animationType = entry.target.getAttribute("data-animate")
            entry.target.classList.add(`animate-${animationType}`)
          }
        })
      },
      { threshold: 0.1 },
    )

    animatedElements.forEach((el) => animationObserver.observe(el))
  }

  initScrollAnimations()

  // Performance optimization: Lazy load images (only for images with data-src)
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.classList.remove("lazy")
            img.classList.add("loaded")
            img.style.opacity = "1"
            imageObserver.unobserve(img)
          }
        }
      })
    })

    // Only observe images that have data-src attribute
    document.querySelectorAll("img[data-src]").forEach((img) => {
      img.classList.add("lazy")
      imageObserver.observe(img)
    })
  }

  console.log("Brew Haven website loaded successfully! ☕")
})

// Add lightbox styles dynamically
const lightboxStyles = `
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    
    .lightbox-content img {
        width: 100%;
        height: auto;
        display: block;
    }
    
    .lightbox-info {
        padding: 20px;
    }
    
    .lightbox-info h3 {
        margin: 0 0 10px 0;
        color: var(--primary-color);
    }
    
    .lightbox-info p {
        margin: 0;
        color: var(--text-secondary);
    }
    
    .lightbox-close {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 40px;
        height: 40px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s ease;
    }
    
    .lightbox-close:hover {
        background: rgba(0, 0, 0, 0.9);
    }
`

// Inject lightbox styles
const styleSheet = document.createElement("style")
styleSheet.textContent = lightboxStyles
document.head.appendChild(styleSheet)
