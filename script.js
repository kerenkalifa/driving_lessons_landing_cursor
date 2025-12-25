// Simple, readable JS for interactivity
(function () {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const langToggle = document.getElementById('lang-toggle');
  const yearEl = document.getElementById('year');
  const form = document.getElementById('booking-form');
  const formNote = document.getElementById('form-note');
  const faqAccordion = document.getElementById('faq-accordion');

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
      if (!track) return;
      const gap = 12; // match CSS gap
      const perView = slidesPerView();
      const containerWidth = slidesContainer.clientWidth;
      const itemWidth = perView === 1 ? containerWidth : (containerWidth - gap * (perView - 1)) / perView;
      const x = index * (itemWidth + gap);
      track.style.transform = `translateX(${-x}px)`;
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

    // Init
    buildDots();
    show(0);
  }

  // Booking form feedback (no backend)
  if (form && formNote) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const t = getT();
      const msg = name ? t('form.thanksName', { name }) : t('form.thanks');
      formNote.textContent = msg;
      form.reset();
    });
  }

  // i18n
  const translations = {
    en: {
      'nav.faq': 'FAQ',
      'nav.home': 'Home',
      'nav.pricing': 'Pricing',
      'nav.testimonials': 'Testimonials',
      'nav.book': 'Book Now',
      'nav.bookShort': 'Book',
      'hero.title': 'Learn to Drive with Confidence',
      'hero.subtitle': 'Certified instructor. Modern methods. Tailored to your pace.',
      'hero.ctaPricing': 'View Pricing',
      'hero.ctaBook': 'Book a Lesson',
      'hero.bullet1': 'Flexible scheduling',
      'hero.bullet2': 'Dual-control vehicle',
      'hero.bullet3': 'Nervous beginners welcome',
      'pricing.title': 'Simple, Transparent Pricing',
      'pricing.subtitle': 'Choose the plan that fits your learning pace.',
      'pricing.perLesson': '/ lesson',
      'pricing.per5': '/ 5 lessons',
      'pricing.perSession': '/ session',
      'pricing.starter.title': 'Starter',
      'pricing.starter.f1': '1 x 60-minute lesson',
      'pricing.starter.f2': 'Pickup and drop-off',
      'pricing.starter.f3': 'Basic maneuvers',
      'pricing.starter.cta': 'Get Started',
      'pricing.popular': 'Popular',
      'pricing.pack.title': 'Confidence Pack',
      'pricing.pack.f1': '5 x 60-minute lessons',
      'pricing.pack.f2': 'City & highway practice',
      'pricing.pack.f3': 'Parallel parking mastery',
      'pricing.pack.cta': 'Book Pack',
      'pricing.test.title': 'Test Day',
      'pricing.test.f1': 'Pre-test warm-up',
      'pricing.test.f2': 'Car for test included',
      'pricing.test.f3': 'Route familiarization',
      'pricing.test.cta': 'Reserve',
      'testimonials.title': 'What Students Say',
      'testimonials.subtitle': 'Real stories from real learners.',
      'testimonials.t1.txt': '"I was so nervous before. Now I drive confidently to work!"',
      'testimonials.t1.name': '— Maya G.',
      'testimonials.t2.txt': '"Clear instructions and lots of patience. Passed on my first try."',
      'testimonials.t2.name': '— Daniel R.',
      'testimonials.t3.txt': '"Flexible scheduling made it easy to learn around my classes."',
      'testimonials.t3.name': '— Leila S.',
      'booking.title': 'Ready to Start?',
      'booking.subtitle': 'Tell us a bit about you and we’ll confirm your first lesson.',
      'booking.b1': 'Beginner friendly',
      'booking.b2': 'Flexible times',
      'booking.b3': 'Trusted, certified instructor',
      'form.name': 'Full name',
      'form.namePh': 'Your name',
      'form.email': 'Email',
      'form.emailPh': 'you@example.com',
      'form.phone': 'Phone',
      'form.phonePh': '(555) 000-0000',
      'form.plan': 'Preferred plan',
      'form.planStarter': 'Starter - ₪45 / lesson',
      'form.planPack': 'Confidence Pack - ₪210 / 5 lessons',
      'form.planTest': 'Test Day - ₪120 / session',
      'form.message': 'Message (optional)',
      'form.messagePh': 'Anything we should know?',
      'form.submit': 'Request Booking',
      'form.thanks': 'Thanks! We will contact you shortly.',
      'form.thanksName': 'Thanks {name}! We will contact you shortly.',
      'footer.brand': 'DriveSmart Lessons',
      'footer.rights': 'All rights reserved.',
      'faq.title': 'Frequently Asked Questions',
      'faq.subtitle': 'Answers to common questions.',
      'faq.q1': 'Where do the lessons take place?',
      'faq.a1': 'I teach in Ashdod and the surrounding area. We will set a convenient pickup point for you — from home, work or another agreed location.',
      'faq.q2': 'How long is a lesson and what is the price?',
      'faq.a2': 'A standard lesson is 60 minutes. Prices appear in the pricing section. Packages are available for multiple lessons.',
      'faq.q3': 'Do you teach beginners and refreshers?',
      'faq.a3': 'Yes. I teach complete beginners, refreshers, and drivers who want more confidence — at your pace and with lots of patience.',
      'faq.q4': 'Which car do you use?',
      'faq.a4': 'I teach in a modern automatic vehicle equipped with dual controls and advanced safety systems to maximize comfort and safety.',
      'faq.source': 'Source: See original content on the Nir Mazar site.'
    },
    he: {
      'nav.faq': 'שאלות נפוצות',
      'nav.home': 'בית',
      'nav.pricing': 'מחירים',
      'nav.testimonials': 'המלצות',
      'nav.book': 'קבע שיעור',
      'nav.bookShort': 'קבע',
      'hero.title': 'ללמוד לנהוג בביטחון',
      'hero.subtitle': 'מורה מוסמך. שיטות מודרניות. מותאם לקצב שלך.',
      'hero.ctaPricing': 'צפה במחירים',
      'hero.ctaBook': 'הזמן שיעור',
      'hero.bullet1': 'לוח זמנים גמיש',
      'hero.bullet2': 'רכב עם דוושות כפולות',
      'hero.bullet3': 'מתאים גם למתחילים חוששים',
      'pricing.title': 'מחירים פשוטים ושקופים',
      'pricing.subtitle': 'בחרו את החבילה שמתאימה לקצב הלמידה שלכם.',
      'pricing.perLesson': '/ שיעור',
      'pricing.per5': '/ 5 שיעורים',
      'pricing.perSession': '/ מפגש',
      'pricing.starter.title': 'מתחילים',
      'pricing.starter.f1': 'שיעור אחד של 60 דקות',
      'pricing.starter.f2': 'איסוף והחזרה',
      'pricing.starter.f3': 'מיומנויות בסיסיות',
      'pricing.starter.cta': 'התחל עכשיו',
      'pricing.popular': 'פופולרי',
      'pricing.pack.title': 'חבילת ביטחון',
      'pricing.pack.f1': '5 שיעורים של 60 דקות',
      'pricing.pack.f2': 'תרגול עירוני ובכביש מהיר',
      'pricing.pack.f3': 'שליטה בחניה מקבילה',
      'pricing.pack.cta': 'הזמן חבילה',
      'pricing.test.title': 'יום מבחן',
      'pricing.test.f1': 'חימום לפני מבחן',
      'pricing.test.f2': 'רכב למבחן כלול',
      'pricing.test.f3': 'היכרות עם המסלול',
      'pricing.test.cta': 'שמור מקום',
      'testimonials.title': 'מה התלמידים אומרים',
      'testimonials.subtitle': 'סיפורים אמיתיים של לומדים אמיתיים.',
      'testimonials.t1.txt': '"הייתי מאוד לחוצה לפני, עכשיו אני נוהגת בביטחון לעבודה!"',
      'testimonials.t1.name': '— מאיה ג׳.',
      'testimonials.t2.txt': '"הסברים ברורים והמון סבלנות. עברתי בטסט ראשון."',
      'testimonials.t2.name': '— דניאל ר׳.',
      'testimonials.t3.txt': '"לוח זמנים גמיש שאיפשר ללמוד לצד השיעורים באוניברסיטה."',
      'testimonials.t3.name': '— לילה ס׳.',
      'booking.title': 'מוכנים להתחיל?',
      'booking.subtitle': 'ספרו לנו קצת עליכם ונאשר את השיעור הראשון.',
      'booking.b1': 'מתאים למתחילים',
      'booking.b2': 'זמנים גמישים',
      'booking.b3': 'מורה מוסמך ואמין',
      'form.name': 'שם מלא',
      'form.namePh': 'השם שלך',
      'form.email': 'אימייל',
      'form.emailPh': 'you@example.com',
      'form.phone': 'טלפון',
      'form.phonePh': '(555) 000-0000',
      'form.plan': 'חבילה מועדפת',
      'form.planStarter': 'מתחילים - ₪45 / שיעור',
      'form.planPack': 'חבילת ביטחון - ₪210 / 5 שיעורים',
      'form.planTest': 'יום מבחן - ₪120 / מפגש',
      'form.message': 'הודעה (לא חובה)',
      'form.messagePh': 'יש משהו שכדאי לדעת?',
      'form.submit': 'שלח בקשה',
      'form.thanks': 'תודה! נחזור אליך בהקדם.',
      'form.thanksName': 'תודה {name}! נחזור אליך בהקדם.',
      'footer.brand': 'DriveSmart Lessons',
      'footer.rights': 'כל הזכויות שמורות.',
      'faq.title': 'שאלות נפוצות',
      'faq.subtitle': 'תשובות לשאלות שכיחות.',
      'faq.q1': 'איפה מתקיימים השיעורים?',
      'faq.a1': 'אני מלמד באשדוד ובאזור. נקבע יחד נקודת איסוף נוחה — מהבית, מהעבודה או מנקודה מוסכמת אחרת.',
      'faq.q2': 'מה משך השיעור ומה המחיר?',
      'faq.a2': 'שיעור סטנדרטי הוא 60 דקות. המחירים מופיעים בסעיף המחירים. ניתן להזמין חבילות של מספר שיעורים.',
      'faq.q3': 'האם אתה מלמד מתחילים וגם ריענון?',
      'faq.a3': 'כן. אני מלמד מתחילים מאפס, שיעורי ריענון ולנהגים שרוצים יותר ביטחון — בקצב שלך ועם הרבה סבלנות.',
      'faq.q4': 'על איזה רכב אתה מלמד?',
      'faq.a4': 'אני מלמד על רכב אוטומטי מודרני עם דוושות כפולות ומערכות בטיחות מתקדמות — לנוחות ובטיחות מקסימלית.',
      'faq.source': 'מקור: עיון בתוכן המקורי באתר של ניר מזר.'
    }
  };

  function getLanguage() {
    return localStorage.getItem('lang') || 'en';
  }

  function setLanguage(lang) {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');
    updateTexts(lang);
    if (langToggle) langToggle.textContent = lang === 'he' ? 'HE' : 'EN';
    // Switch logo image based on language
    var logoImg = document.querySelector('.logo-img');
    if (logoImg) {
      logoImg.src = lang === 'en'
        ? './img/rsz_logo_english_transparent.png'
        : './img/rsz_logo_transparent.png';
    }
  }

  function tKey(lang, key) {
    const dict = translations[lang] || translations.en;
    return dict[key] || translations.en[key] || '';
  }

  function interpolate(text, vars) {
    if (!vars) return text;
    return text.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
  }

  function getT() {
    const lang = getLanguage();
    return (key, vars) => interpolate(tKey(lang, key), vars);
  }

  function updateTexts(lang) {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      el.textContent = tKey(lang, key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (!key || !(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return;
      el.placeholder = tKey(lang, key);
    });
    // Update select options
    const planSelect = document.getElementById('plan-select');
    if (planSelect instanceof HTMLSelectElement) {
      Array.from(planSelect.options).forEach((opt) => {
        const key = opt.getAttribute('data-i18n');
        if (key) opt.textContent = tKey(lang, key);
      });
    }
  }

  // Initialize language
  setLanguage(getLanguage());

  // Toggle language
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const next = getLanguage() === 'en' ? 'he' : 'en';
      setLanguage(next);
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


