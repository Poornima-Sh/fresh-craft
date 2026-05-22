/* ==========================================================================
   FRESH CRAFT INTERACTION SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  /* --- 1. Custom Cursor Tracking (Desktop Only) --- */
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  
  // Only enable custom cursor on devices that support hover (desktops)
  const hasHover = window.matchMedia('(hover: hover)').matches;
  
  if (hasHover && cursor && cursorDot) {
    cursor.style.display = 'block';
    cursorDot.style.display = 'block';
    
    let cursorX = 0;
    let cursorY = 0;
    let targetX = 0;
    let targetY = 0;
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      // Dot is instant
      cursorDot.style.left = `${targetX}px`;
      cursorDot.style.top = `${targetY}px`;
    });
    
    // Smooth lerp (interpolation) for the outer circle cursor
    const renderCursor = () => {
      cursorX += (targetX - cursorX) * 0.15;
      cursorY += (targetY - cursorY) * 0.15;
      
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      
      requestAnimationFrame(renderCursor);
    };
    renderCursor();
    
    // Hover effects on links/buttons
    const hoverElements = document.querySelectorAll('a, button, select, input, textarea, .filter-btn');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering-link');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.add('hovering-link');
        document.body.classList.remove('hovering-link');
      });
    });
  }

  /* --- 2. Mobile Navigation Toggle --- */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = () => {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenuBtn.classList.toggle('active');
    
    mobileNav.setAttribute('aria-hidden', isExpanded);
    mobileNav.classList.toggle('active');
  };

  mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  // Close mobile nav when clicking a link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  /* --- 3. Scroll-Driven Shrinking Header Fallback --- */
  const header = document.getElementById('main-header');
  const supportsScrollTimeline = CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)');

  if (!supportsScrollTimeline && header) {
    const checkScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('header-shrunk');
      } else {
        header.classList.remove('header-shrunk');
      }
    };
    
    // Initial check and scroll listener
    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });
  }

  /* --- 4. Scroll Entry Reveal Animation Fallback --- */
  const supportsViewTimeline = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  
  if (!supportsViewTimeline) {
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
    
    // Map initial classes to fallback classes
    revealElements.forEach(el => {
      if (el.classList.contains('scroll-reveal-left')) {
        el.classList.add('scroll-reveal-left-fallback');
      } else if (el.classList.contains('scroll-reveal-right')) {
        el.classList.add('scroll-reveal-right-fallback');
      } else {
        el.classList.add('scroll-reveal-fallback');
      }
    });

    // Instantiate Intersection Observer
    const observerOptions = {
      root: null, // Viewport
      threshold: 0.15, // Trigger when 15% visible
      rootMargin: '0px 0px -50px 0px' // Shrink trigger margin slightly
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-triggered');
          // Once revealed, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }

  /* --- 5. Interactive Fabric Library Filter --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const fabricCards = document.querySelectorAll('.fabric-card');
  const fabricHeroCard = document.querySelector('.fabric-hero-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Toggle active states on buttons
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      // Filter cards
      fabricCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          // Show card
          card.classList.remove('hidden');
          // Trigger slight reflow to allow transition
          void card.offsetWidth;
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          // Hide card
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          // Delay display none to finish transition
          setTimeout(() => {
            if (card.style.opacity === '0') {
              card.classList.add('hidden');
            }
          }, 350);
        }
      });

      // Filter the hero card as well if relevant
      if (fabricHeroCard) {
        const heroCategories = fabricHeroCard.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || heroCategories.includes(filterValue)) {
          fabricHeroCard.style.display = 'flex';
          void fabricHeroCard.offsetWidth;
          fabricHeroCard.style.opacity = '1';
        } else {
          fabricHeroCard.style.opacity = '0';
          setTimeout(() => {
            if (fabricHeroCard.style.opacity === '0') {
              fabricHeroCard.style.display = 'none';
            }
          }, 350);
        }
      }
    });
  });

  /* --- 6. Contact Form Validation & Mock Submission --- */
  const contactForm = document.getElementById('sourcing-inquiry-form');
  const submitBtn = document.getElementById('submit-inquiry');
  const formStatus = document.getElementById('form-status');

  // Input elements
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const detailsInput = document.getElementById('contact-details');

  // Simple email validator regex
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Helper to validate single field
  const validateField = (input, errorElId, validationFn, errorMsgText) => {
    const errorEl = document.getElementById(errorElId);
    const isValid = validationFn(input.value.trim());

    if (!isValid) {
      input.classList.add('invalid');
      if (errorEl) {
        errorEl.textContent = errorMsgText;
        errorEl.style.opacity = '1';
        errorEl.style.height = 'auto';
      }
      return false;
    } else {
      input.classList.remove('invalid');
      if (errorEl) {
        errorEl.style.opacity = '0';
        errorEl.style.height = '0';
      }
      return true;
    }
  };

  // Live input validations on blur
  nameInput.addEventListener('blur', () => {
    validateField(nameInput, 'name-error', (val) => val.length > 0, 'Please enter your name');
  });

  emailInput.addEventListener('blur', () => {
    validateField(emailInput, 'email-error', isValidEmail, 'Please enter a valid email address');
  });

  detailsInput.addEventListener('blur', () => {
    validateField(detailsInput, 'details-error', (val) => val.length > 10, 'Please share some details about your collection');
  });

  // Handle submit
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Run all validations
      const isNameValid = validateField(nameInput, 'name-error', (val) => val.length > 0, 'Please enter your name');
      const isEmailValid = validateField(emailInput, 'email-error', isValidEmail, 'Please enter a valid email address');
      const isDetailsValid = validateField(detailsInput, 'details-error', (val) => val.length > 10, 'Please share some details (minimum 10 characters)');

      if (!isNameValid || !isEmailValid || !isDetailsValid) {
        // Find first invalid input and focus it
        const firstInvalid = contactForm.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // If valid, start submitting state
      submitBtn.classList.add('submitting');
      submitBtn.disabled = true;
      formStatus.className = 'form-status-container'; // Reset classes
      formStatus.innerHTML = '';

      // Mock network response (1.5 seconds)
      setTimeout(() => {
        submitBtn.classList.remove('submitting');
        submitBtn.disabled = false;

        // Success state
        formStatus.classList.add('visible', 'success');
        formStatus.innerHTML = '<strong>Inquiry Received!</strong> Thank you, one of our sourcing directors will contact you shortly.';
        
        // Reset form inputs
        contactForm.reset();
        
        // Clear labels placeholder classes
        const inputs = contactForm.querySelectorAll('.form-input');
        inputs.forEach(input => {
          input.classList.remove('invalid');
        });
        
        // Hide success message after 6 seconds
        setTimeout(() => {
          formStatus.classList.remove('visible', 'success');
          formStatus.innerHTML = '';
        }, 6000);

      }, 1500);
    });
  }

});
