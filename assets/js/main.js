/**
* Template Name: DevFolio
* Template URL: https://bootstrapmade.com/devfolio-bootstrap-portfolio-html-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('#navmenu');

  function mobileNavToogle() {
    if (!mobileNavToggleBtn) return;
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  document.addEventListener('click', (event) => {
    if (document.querySelector('.mobile-nav-active') && navMenu && !navMenu.contains(event.target)) {
      mobileNavToogle();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.querySelector('.mobile-nav-active')) {
      mobileNavToogle();
    }
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');
  const scrollProgress = document.querySelector('.scroll-progress-value');
  const scrollCircumference = 125.66;
  let progressFrame;

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }

    if (scrollProgress && !progressFrame) {
      progressFrame = window.requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const distanceFromBottom = scrollHeight - window.scrollY;
        const scrollRatio = scrollHeight > 0
          ? (distanceFromBottom <= 2 ? 1 : Math.min(window.scrollY / scrollHeight, 1))
          : 0;
        scrollProgress.style.strokeDashoffset = `${scrollCircumference * (1 - scrollRatio)}`;
        progressFrame = null;
      });
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Reveal content blocks once as they enter the viewport.
   */
  function initScrollReveal() {
    const revealSelectors = [
      'main > section:not(#hero) .about-me',
      'main > section:not(#hero) .skills-content',
      'main > section:not(#hero) .resume-item',
      'main > section:not(#hero) .service-item',
      'main > section:not(#hero) .stats-item',
      'main > section:not(#hero) .info-item'
    ];
    const revealTargets = document.querySelectorAll(revealSelectors.join(', '));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    revealTargets.forEach((target) => {
      target.classList.add('scroll-reveal');

      const parent = target.parentElement;
      const siblings = parent ? Array.from(parent.children).filter((child) => child.matches('.scroll-reveal')) : [];
      const siblingIndex = siblings.indexOf(target);
      target.style.setProperty('--scroll-reveal-delay', `${Math.max(siblingIndex, 0) * 70}ms`);
    });

    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach((target) => target.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });

    revealTargets.forEach((target) => observer.observe(target));
  }
  window.addEventListener('load', initScrollReveal);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Animate skill meters once when their cards enter the viewport.
   */
  const skillCards = document.querySelectorAll('.skill-card');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  skillCards.forEach((card) => {
    card.style.setProperty('--skill-level', `${card.dataset.skillLevel}%`);
  });

  if (reducedMotion || !('IntersectionObserver' in window)) {
    skillCards.forEach((card) => card.classList.add('is-skill-revealed'));
  } else {
    const skillObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-skill-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2 });

    skillCards.forEach((card) => skillObserver.observe(card));
  }

  /**
   * Reveal the experience timeline once when it enters the viewport.
   */
  const experienceTimeline = document.querySelector('.experience-timeline');
  if (experienceTimeline) {
    const revealExperience = () => experienceTimeline.classList.add('is-experience-visible');
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealExperience();
    } else {
      const experienceObserver = new IntersectionObserver((entries, observer) => {
        if (!entries[0].isIntersecting) return;
        revealExperience();
        observer.disconnect();
      }, { threshold: 0.2 });
      experienceObserver.observe(experienceTimeline);
    }
  }

  /**
   * Animate statistics once when the stats section enters the viewport.
   */
  const statsSection = document.querySelector('#stats');
  const statCounters = document.querySelectorAll('#stats .purecounter');

  function animateStats() {
    statCounters.forEach((counter) => {
      const endValue = Number(counter.dataset.purecounterEnd || 0);
      const duration = Math.min(Number(counter.dataset.purecounterDuration || 1) * 1000, 900);

      if (reducedMotion) {
        counter.textContent = endValue;
        return;
      }

      const startTime = performance.now();
      const updateCounter = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(easedProgress * endValue);
        if (progress < 1) window.requestAnimationFrame(updateCounter);
      };
      window.requestAnimationFrame(updateCounter);
    });
  }

  if (statsSection && statCounters.length) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      animateStats();
    } else {
      const statsObserver = new IntersectionObserver((entries, observer) => {
        if (!entries[0].isIntersecting) return;
        animateStats();
        observer.disconnect();
      }, { threshold: 0.25 });
      statsObserver.observe(statsSection);
    }
  }

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  const navmenulinks = document.querySelectorAll('.navmenu a[href^="#"]');
  const header = document.querySelector('#header');

  navmenulinks.forEach((navmenulink) => {
    navmenulink.addEventListener('click', (event) => {
      const target = document.querySelector(navmenulink.hash);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', navmenulink.hash);

      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  function navmenuScrollspy() {
    const headerOffset = (header ? header.offsetHeight : 0) + 80;
    const position = window.scrollY + headerOffset;
    let activeLink = null;

    navmenulinks.forEach((navmenulink) => {
      const section = document.querySelector(navmenulink.hash);
      if (section && position >= section.offsetTop) {
        activeLink = navmenulink;
      }
    });

    navmenulinks.forEach((navmenulink) => {
      navmenulink.classList.toggle('active', navmenulink === activeLink);
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();