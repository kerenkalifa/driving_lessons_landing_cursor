// Simple, readable JS for interactivity
(function () {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const yearEl = document.getElementById('year');
  const form = document.getElementById('booking-form');
  const formNote = document.getElementById('form-note');
  const faqAccordion = document.getElementById('faq-accordion');

// Success popup helper
function openSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (!modal) return;

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');

  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  };

  modal.querySelector('.success-modal__close')?.addEventListener('click', close);
  modal.querySelector('.success-modal__backdrop')?.addEventListener('click', close);
}

  // Scheduler modal
  const schedulerModal = document.getElementById('schedulerModal');
  const schedulerCloseBtn = schedulerModal?.querySelector('.modal-close');
  const openSchedulerBtn = document.getElementById('openScheduler');
  const openSchedulerBtnHe = document.getElementById('openSchedulerHe');

  let lastFocusedElement = null;

  function openSchedulerModal() {
    if (!schedulerModal) return;
    lastFocusedElement = document.activeElement;
    schedulerModal.classList.add('active');
    schedulerModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    schedulerCloseBtn && schedulerCloseBtn.focus();
  }

  function closeSchedulerModal() {
    if (!schedulerModal) return;
    schedulerModal.classList.remove('active');
    schedulerModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocusedElement && lastFocusedElement.focus();
  }

    // Open modal (EN + HE)
  openSchedulerBtn && openSchedulerBtn.addEventListener('click', openSchedulerModal);
  openSchedulerBtnHe && openSchedulerBtnHe.addEventListener('click', openSchedulerModal);

  // Close modal
  schedulerCloseBtn && schedulerCloseBtn.addEventListener('click', closeSchedulerModal);

  schedulerModal && schedulerModal.addEventListener('click', (e) => {
    if (e.target === schedulerModal) closeSchedulerModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && schedulerModal?.classList.contains('active')) {
      closeSchedulerModal();
    }
  });

  // Set footer year
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Hamburger menu toggle
  if (hamburger && nav) {
    const toggleMenu = () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('is-open', !isOpen);
    };
    hamburger.addEventListener('click', toggleMenu);

    // Close on link click (mobile)
    nav.addEventListener('click', (e) => {
      const target = e.target;
      if (target instanceof Element && target.matches('a')) {
        hamburger.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });
  }

  // Smooth scroll for anchor links
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target instanceof Element && target.matches('a[href^="#"]')) {
      const href = target.getAttribute('href');
      if (!href) return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Simple testimonials carousel
  const slidesContainer = document.getElementById('testimonial-slides');
  if (slidesContainer) {
    const track = slidesContainer.querySelector('.track');
    const slides = Array.from(slidesContainer.querySelectorAll('.slide'));
    const prevBtn = document.querySelector('.carousel .prev');
    const nextBtn = document.querySelector('.carousel .next');
    const dotsContainer = document.getElementById('testimonial-dots');
    const carousel = slidesContainer.closest('.carousel');
    let index = 0;

    const slidesPerView = () => {
      const w = window.innerWidth;
      if (w >= 1200) return 3;
      if (w >= 900) return 2;
      return 1;
    };

    const maxIndex = () => Math.max(0, slides.length - slidesPerView());

    // Create dots (one per page)
    let dots = [];
    function buildDots() {
      dots = [];
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const pages = maxIndex() + 1;
      for (let i = 0; i < pages; i++) {
        const b = document.createElement('button');
        b.className = 'dot' + (i === index ? ' is-active' : '');
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', `Go to slide ${i + 1}`);
        b.addEventListener('click', () => show(i));
        dotsContainer.appendChild(b);
        dots.push(b);
      }
    }

    function updateButtons() {
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === maxIndex();
    }

    function updateDots() {
      dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    }

    function updateTransform() {
      if (!track || slides.length === 0) return;
      const gap = 12; // match CSS gap
      const perView = slidesPerView();
      // Use actual rendered width of first slide to account for CSS min-width rules
      const firstSlide = slides[0];
      const slideRect = firstSlide.getBoundingClientRect();
      const itemWidth = slideRect.width;
      const x = index * (itemWidth + gap);
      // In RTL, we need to use positive X to move right (which shows next slides)
      const isRTL = document.documentElement.dir === 'rtl' || 
                    getComputedStyle(document.documentElement).direction === 'rtl';
      track.style.transform = `translateX(${isRTL ? x : -x}px)`;
    }

    function show(i) {
      const max = maxIndex();
      index = Math.min(Math.max(0, i), max);
      updateTransform();
      updateDots();
      updateButtons();
    }

    prevBtn && prevBtn.addEventListener('click', () => show(index - 1));
    nextBtn && nextBtn.addEventListener('click', () => show(index + 1));

    // Touch swipe
    let startX = 0;
    let dragging = false;
    if (slidesContainer) {
      slidesContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        dragging = true;
      });
      slidesContainer.addEventListener('touchmove', (e) => {
        if (!dragging) return;
        const dx = e.touches[0].clientX - startX;
        if (Math.abs(dx) > 40) {
          dragging = false;
          if (dx < 0) show(index + 1); else show(index - 1);
        }
      });
      slidesContainer.addEventListener('touchend', () => { dragging = false; });
    }

    // Auto-advance every 6s with pause on hover
    let timer = setInterval(() => show(index + 1), 6000);
    if (carousel) {
      carousel.addEventListener('mouseenter', () => { clearInterval(timer); });
      carousel.addEventListener('mouseleave', () => { timer = setInterval(() => show(index + 1), 6000); });
    }

    // Rebuild on resize
    window.addEventListener('resize', () => {
      const oldMax = dots.length - 1;
      const oldIndex = index;
      buildDots();
      const newMax = maxIndex();
      index = Math.min(oldIndex, newMax);
      updateTransform();
      updateButtons();
      updateDots();
    });

    // Init - wait for layout to complete
    buildDots();
    // Use requestAnimationFrame to ensure layout is complete before calculating transforms
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        show(0);
      });
    });
  }

  // Booking form feedback (no backend)
  // if (form && formNote) {
  //   form.addEventListener('submit', (e) => {
  //     e.preventDefault();
  //     const data = new FormData(form);
  //     const name = (data.get('name') || '').toString().trim();
  //     const msg = name ? `תודה ${name}! נחזור אליך בהקדם.` : 'תודה! נחזור אליך בהקדם.';
  //     formNote.textContent = msg;
  //     form.reset();
  //   });
  // }

  // Booking form → WhatsApp redirect (Hebrew-only)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const plan = (data.get('plan') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      const text =
  `שלום אריק, אני מעוניין/ת בשיעורי נהיגה 👋
  שם: ${name}
  טלפון: ${phone}
  אימייל: ${email}
  חבילה מועדפת: ${plan}
  הודעה: ${message || '—'}`;

      const whatsappNumber = '972545677159'; // your number, no +
      const whatsappUrl =
        'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(text);

      window.open(whatsappUrl, '_blank');

      setTimeout(() => {
        form.reset();
        openSuccessModal();
      }, 300);
      
    });
  }

  // FAQ toggle
  if (faqAccordion) {
    faqAccordion.addEventListener('click', (e) => {
      const b = e.target;
      if (!(b instanceof Element)) return;
      const button = b.closest('.q');
      if (!button) return;
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      const answer = button.nextElementSibling;
      if (answer instanceof HTMLElement) {
        if (!expanded) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.setAttribute('aria-hidden', 'false');
        } else {
          answer.style.maxHeight = '0px';
          answer.setAttribute('aria-hidden', 'true');
        }
      }
    });
  }
})();

// Success modal
const successModal = document.getElementById('success-modal');
const successCloseBtn = successModal?.querySelector('.success-modal__close');

successCloseBtn && successCloseBtn.addEventListener('click', () => {
  successModal?.classList.remove('active');
});