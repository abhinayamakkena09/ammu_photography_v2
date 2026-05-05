document.addEventListener('DOMContentLoaded', () => {

  // ─── LOADER ──────────────────────────────────
  const loader = document.querySelector('.loader');
  if (loader) {
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2400);
  }

  // ─── HERO BG ZOOM ─────────────────────────────
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) setTimeout(() => heroBg.classList.add('loaded'), 100);

  // ─── CUSTOM CURSOR ─────────────────────────────
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();
    document.querySelectorAll('a, button, .portfolio-card, .portfolio-full-card, .filter-tab, .service-card, .pricing-card, .insta-item').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
  }

  // ─── HEADER SCROLL ─────────────────────────────
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ─── MOBILE MENU ───────────────────────────────
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('nav ul');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = menuToggle.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // ─── REVEAL ANIMATIONS ─────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  // ─── COUNTER ANIMATION ─────────────────────────
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target);
          const duration = 1800;
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              el.textContent = target + '+';
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(current);
            }
          }, 16);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  }

  // ─── TESTIMONIALS CAROUSEL ─────────────────────
  const carousel = document.getElementById('testimonialsCarousel');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (carousel) {
    const items = carousel.querySelectorAll('.testimonial-item');
    let current = 0;
    let autoTimer;

    // Create dots
    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    const goTo = (index) => {
      items[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + items.length) % items.length;
      items[current].classList.add('active');
      dots[current].classList.add('active');
    };

    items[0].classList.add('active');

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    const resetAuto = () => { clearInterval(autoTimer); autoTimer = setInterval(() => goTo(current + 1), 5000); };
    resetAuto();
  }

  // ─── PORTFOLIO FILTER ──────────────────────────
  const filterTabs = document.querySelectorAll('.filter-tab');
  const portfolioCards = document.querySelectorAll('.portfolio-full-card');
  if (filterTabs.length && portfolioCards.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        portfolioCards.forEach(card => {
          const cat = card.dataset.category;
          if (filter === 'all' || cat === filter) {
            card.style.display = '';
            setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => { card.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  // ─── LIGHTBOX ──────────────────────────────────
  const lbTriggers = document.querySelectorAll('.portfolio-card, .portfolio-full-card');
  if (lbTriggers.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    const lbImg = document.createElement('img');
    const lbClose = document.createElement('div');
    lbClose.className = 'lightbox-close';
    lbClose.innerHTML = '&times;';
    lb.appendChild(lbImg);
    lb.appendChild(lbClose);
    document.body.appendChild(lb);

    lbTriggers.forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        if (img) { lbImg.src = img.src; lb.classList.add('active'); document.body.style.overflow = 'hidden'; }
      });
    });
    const closeLb = () => { lb.classList.remove('active'); document.body.style.overflow = ''; };
    lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', e => { if (e.target !== lbImg) closeLb(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
  }

  // ─── CONTACT FORM ──────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('name')?.value || '';
      const date = document.getElementById('date')?.value || '';
      const type = document.getElementById('type')?.value || '';
      const message = document.getElementById('message')?.value || '';
      const waText = encodeURIComponent(`Hi, I'm ${name}. I'm interested in booking a ${type} shoot${date ? ' on ' + date : ''}. ${message}`);
      window.open(`https://wa.me/1234567890?text=${waText}`, '_blank');
    });
  }

  // ─── PARALLAX HERO ─────────────────────────────
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const heroBgEl = heroSection.querySelector('.hero-bg');
      if (heroBgEl) heroBgEl.style.transform = `scale(1) translateY(${scrolled * 0.3}px)`;
    }, { passive: true });
  }

  // ─── SCROLL TO TOP ─────────────────────────────
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

});
