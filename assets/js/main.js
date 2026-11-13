/**
 * MAIN JAVASCRIPT CONTROLLER
 * Handles theme toggle, dynamic config rendering, smooth interactions,
 * Telegram form submission via AWS Lambda Function URL, and custom analytics.
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Theme Management (Dark Mode Default + Light Toggle)
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }

  // Initialize theme
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const targetTheme = current === 'dark' ? 'light' : 'dark';
      setTheme(targetTheme);

      // Track theme toggle event
      trackEvent('theme_change', { target_theme: targetTheme });
    });
  }

  // -------------------------------------------------------------------------
  // 2. Mobile Navigation Toggle
  // -------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // -------------------------------------------------------------------------
  // 3. Active Section Navigation Highlighter & Sticky Nav
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Back to top visibility
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', highlightNavigation, { passive: true });

  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -------------------------------------------------------------------------
  // 4. Custom Analytics Event Dispatcher (GA4 & Cloudflare)
  // -------------------------------------------------------------------------
  function trackEvent(eventName, eventParams = {}) {
    // Google Analytics 4 tracking
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams);
    }
    // Debug log in dev mode
    console.debug(`[Analytics Event] ${eventName}:`, eventParams);
  }

  // Expose trackEvent globally
  window.trackEvent = trackEvent;

  // Track Outbound Links & Resume Downloads
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a');
    if (!target) return;

    const href = target.getAttribute('href') || '';

    // Resume Download
    if (target.classList.contains('track-resume') || href.includes('resume.pdf')) {
      trackEvent('resume_download', {
        item_name: 'Soham_Mali_Resume',
        source: target.getAttribute('data-source') || 'button'
      });
    }

    // Social & Project Clicks
    if (target.classList.contains('track-social')) {
      trackEvent('social_click', {
        platform: target.getAttribute('data-platform') || 'social',
        url: href
      });
    }

    if (target.classList.contains('track-project')) {
      trackEvent('project_click', {
        project_name: target.getAttribute('data-project') || 'unknown',
        url: href
      });
    }
  });

  // -------------------------------------------------------------------------
  // 5. Contact Form -> AWS Lambda Function URL -> Telegram Bot
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formBanner = document.getElementById('formBanner');

  let lastSubmitTime = 0;

  function showBanner(type, message) {
    if (!formBanner) return;
    formBanner.className = `form-banner ${type}`;
    formBanner.textContent = message;
    formBanner.style.display = 'block';
  }

  function hideBanner() {
    if (!formBanner) return;
    formBanner.style.display = 'none';
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideBanner();

      const config = window.portfolioConfig || {};
      const apiEndpoint = config.contactApi?.lambdaFunctionUrl;
      const cooldownSec = config.contactApi?.cooldownSeconds || 30;

      // Rate limit check
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - lastSubmitTime) / 1000);
      if (lastSubmitTime && elapsedSeconds < cooldownSec) {
        const remaining = cooldownSec - elapsedSeconds;
        showBanner('error', `Please wait ${remaining}s before sending another message.`);
        return;
      }

      // Collect form fields
      const name = document.getElementById('senderName')?.value.trim();
      const email = document.getElementById('senderEmail')?.value.trim();
      const message = document.getElementById('senderMessage')?.value.trim();
      const honeypot = document.getElementById('website_url')?.value.trim();

      // Honeypot spam check (if filled, bot triggered)
      if (honeypot) {
        console.warn('Bot detected via honeypot.');
        showBanner('success', 'Thank you! Your message has been received.');
        contactForm.reset();
        return;
      }

      // Client-side validation
      if (!name || !email || !message) {
        showBanner('error', 'Please fill in all required fields.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showBanner('error', 'Please enter a valid email address.');
        return;
      }

      // If Lambda URL not configured yet, notify user and provide direct mailto
      if (!apiEndpoint || apiEndpoint.includes('YOUR_LAMBDA_FUNCTION_URL_HERE')) {
        showBanner('error', 'Telegram Lambda is not configured yet. Opening your email client...');
        const mailtoLink = `mailto:${config.personal?.email || 'sohammali68@gmail.com'}?subject=Portfolio Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + email)}`;
        window.location.href = mailtoLink;
        return;
      }

      // Button loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      try {
        const payload = {
          name: name,
          email: email,
          message: message,
          timestamp: new Date().toISOString(),
          referrer: document.referrer || window.location.href
        };

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        let result = {};
        try {
          result = await response.json();
        } catch (jsonErr) {
          result = { error: `Server error (${response.status}: ${response.statusText || 'Internal error'})` };
        }

        if (response.ok && result.success !== false) {
          showBanner('success', '✨ Message sent successfully! Soham has been notified on Telegram.');
          contactForm.reset();
          lastSubmitTime = Date.now();

          // Custom event
          trackEvent('contact_submit', { status: 'success' });
        } else {
          const errMsg = result.error || result.details || 'Failed to deliver message. Check Telegram Bot settings.';
          showBanner('error', `Error: ${errMsg}`);
          trackEvent('contact_submit', { status: 'failed', error: errMsg });
        }
      } catch (err) {
        console.error('Submission error:', err);
        showBanner('error', 'Network error reaching the server. Please email sohammali68@gmail.com directly.');
        trackEvent('contact_submit', { status: 'network_error' });
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    });
  }

  // -------------------------------------------------------------------------
  // 6. Intersection Observer for Fade-in Animations
  // -------------------------------------------------------------------------
  const animatedElements = document.querySelectorAll('.skill-category-card, .project-card, .timeline-card, .stat-card, .cert-card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.45s ease-out, transform 0.45s ease-out';
      observer.observe(el);
    });
  }

})();
