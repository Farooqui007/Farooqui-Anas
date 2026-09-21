(() => {
  'use strict';

  const body = document.body;
  const header = document.querySelector('#header');
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('#navmenu');
  const navLinks = [...document.querySelectorAll('.navmenu a[href^="#"]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const toggleMobileNav = () => {
    body.classList.toggle('mobile-nav-active');
    mobileNavToggle?.classList.toggle('bi-list');
    mobileNavToggle?.classList.toggle('bi-x');
  };

  const closeMobileNav = () => {
    if (body.classList.contains('mobile-nav-active')) toggleMobileNav();
  };

  const updateActiveNavLink = () => {
    const position = window.scrollY + (header?.offsetHeight ?? 0) + 80;
    let activeLink = null;
    navLinks.forEach((link) => {
      const section = document.querySelector(link.hash);
      if (section && position >= section.offsetTop) activeLink = link;
    });
    navLinks.forEach((link) => link.classList.toggle('active', link === activeLink));
  };

  const animateStats = () => {
    document.querySelectorAll('#stats .purecounter').forEach((counter) => {
      const endValue = Number(counter.dataset.purecounterEnd ?? 0);
      const duration = Math.min(Number(counter.dataset.purecounterDuration ?? 1) * 1000, 900);
      if (reducedMotion) {
        counter.textContent = endValue;
        return;
      }
      const start = performance.now();
      const update = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        counter.textContent = Math.floor((1 - (1 - progress) ** 3) * endValue);
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    });
  };

  const revealOnScroll = () => {
    const targets = document.querySelectorAll([
      'main > section:not(#hero) .about-me',
      'main > section:not(#hero) .service-item',
      'main > section:not(#hero) .stats-item',
      'main > section:not(#hero) .info-item'
    ].join(', '));
    targets.forEach((target) => target.classList.add('scroll-reveal'));
    if (reducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('is-revealed'));
      return;
    }
    const observer = new IntersectionObserver((entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    targets.forEach((target) => observer.observe(target));
  };

  mobileNavToggle?.addEventListener('click', toggleMobileNav);
  document.addEventListener('click', (event) => {
    if (body.classList.contains('mobile-nav-active') && navMenu && !navMenu.contains(event.target)) closeMobileNav();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileNav();
  });
  navLinks.forEach((link) => link.addEventListener('click', (event) => {
    const section = document.querySelector(link.hash);
    if (!section) return;
    event.preventDefault();
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', link.hash);
    closeMobileNav();
  }));
  document.querySelector('.scroll-top')?.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', () => {
    body.classList.toggle('scrolled', window.scrollY > 100);
    document.querySelector('.scroll-top')?.classList.toggle('active', window.scrollY > 100);
    updateActiveNavLink();
  });
  window.addEventListener('load', () => {
    document.querySelector('#preloader')?.remove();
    body.classList.toggle('scrolled', window.scrollY > 100);
    updateActiveNavLink();
    AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
    revealOnScroll();
    const typedElement = document.querySelector('.typed');
    if (typedElement) new Typed('.typed', { strings: typedElement.dataset.typedItems.split(','), loop: true, typeSpeed: 100, backSpeed: 50, backDelay: 2000 });
    const statsSection = document.querySelector('#stats');
    if (!statsSection || !document.querySelector('#stats .purecounter')) return;
    if (reducedMotion || !('IntersectionObserver' in window)) return animateStats();
    const statsObserver = new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) return;
      animateStats();
      observer.disconnect();
    }, { threshold: 0.25 });
    statsObserver.observe(statsSection);
  });
})();
