/**
 * Relatório Erasmus — Interações
 */

(function () {
  'use strict';

  /* ── Intro screen ── */
  const intro = document.getElementById('intro');
  const siteRoot = document.getElementById('site-root');
  let introDismissed = false;
  let typewriterTimeout = null;
  let typewriterAborted = false;

  const TYPEWRITER_LINES = [
    { text: 'Este é o meu relatório do estágio' },
    {
      segments: [
        { text: '24.06.2026', className: '' },
        { text: ' a ', className: 'typewriter-char--sep' },
        { text: '25.07.2026', className: '' },
      ],
    },
  ];

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function getTypingDelay(char, prevChar) {
    let delay = rand(52, 98);

    if (char === ' ') delay += rand(100, 220);
    if (char === '.') delay += rand(120, 240);
    if (/\d/.test(char)) delay += rand(35, 85);

    if (prevChar === ' ' && char !== ' ') delay += rand(30, 90);

    if (prevChar && prevChar !== ' ' && Math.random() < 0.18) {
      delay *= rand(0.55, 0.78);
    }

    if (Math.random() < 0.04) delay += rand(200, 420);

    return Math.round(delay);
  }

  function wait(ms) {
    return new Promise((resolve) => {
      typewriterTimeout = setTimeout(resolve, ms);
    });
  }

  function createCursor() {
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    return cursor;
  }

  function appendChar(lineEl, cursor, char, className = '') {
    const span = document.createElement('span');
    span.className = className ? `typewriter-char ${className}` : 'typewriter-char';
    span.textContent = char;
    lineEl.insertBefore(span, cursor);
  }

  async function typeText(lineEl, cursor, text, charClass = '') {
    let prevChar = '';

    for (const char of text) {
      if (typewriterAborted) return;
      appendChar(lineEl, cursor, char, charClass);
      const delay = getTypingDelay(char, prevChar);
      prevChar = char;
      await wait(delay);
    }
  }

  async function runTypewriter() {
    const container = document.getElementById('intro-typewriter');
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lineEls = container.querySelectorAll('.typewriter-line');

    if (prefersReducedMotion) {
      lineEls[0].textContent = TYPEWRITER_LINES[0].text;
      lineEls[1].innerHTML = TYPEWRITER_LINES[1].segments
        .map((seg) => `<span class="${seg.className}">${seg.text}</span>`)
        .join('');
      revealIntroEnter();
      return;
    }

    await wait(rand(500, 750));
    if (typewriterAborted) return;

    const line1 = lineEls[0];
    const cursor1 = createCursor();
    line1.appendChild(cursor1);
    await typeText(line1, cursor1, TYPEWRITER_LINES[0].text);
    if (typewriterAborted) return;

    cursor1.classList.add('is-idle');
    await wait(rand(450, 700));
    if (typewriterAborted) return;

    const line2 = lineEls[1];
    cursor1.remove();
    const cursor2 = createCursor();
    line2.appendChild(cursor2);

    for (const segment of TYPEWRITER_LINES[1].segments) {
      await typeText(line2, cursor2, segment.text, segment.className);
      if (typewriterAborted) return;
    }

    cursor2.classList.add('is-idle');
    revealIntroEnter();
  }

  function revealIntroEnter() {
    const introActions = document.getElementById('intro-actions');
    if (introDismissed || !introActions) return;
    introActions.hidden = false;
    requestAnimationFrame(() => introActions.classList.add('is-visible'));
  }

  function enterSite() {
    if (introDismissed || !intro) return;
    introDismissed = true;
    typewriterAborted = true;

    if (typewriterTimeout) clearTimeout(typewriterTimeout);

    intro.classList.add('intro-exiting');
    document.body.classList.remove('intro-active');
    document.body.classList.add('intro-complete');

    siteRoot.removeAttribute('inert');
    siteRoot.setAttribute('aria-hidden', 'false');

    setTimeout(() => {
      intro.remove();
      window.dispatchEvent(new Event('scroll'));
    }, 1200);
  }

  if (intro && siteRoot) {
    runTypewriter();

    const introEnterBtn = document.getElementById('intro-enter-btn');
    introEnterBtn?.addEventListener('click', enterSite);

    document.addEventListener('keydown', (e) => {
      if (!introDismissed && e.key === 'Enter') {
        e.preventDefault();
        enterSite();
      }
    });
  } else {
    document.body.classList.remove('intro-active');
    document.body.classList.add('intro-complete');
    siteRoot?.removeAttribute('inert');
    siteRoot?.setAttribute('aria-hidden', 'false');
  }

  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav a');
  const sections = document.querySelectorAll('section[id]');

  /* Header scroll state */
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (hero) {
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      const pastHero = window.scrollY + header.offsetHeight >= heroBottom - 24;
      header.classList.toggle('header--light', pastHero);
    } else {
      header.classList.add('header--light');
    }

    updateActiveNav();
  }

  /* Active nav link based on scroll position */
  function updateActiveNav() {
    if (!header) return;
    const scrollPos = window.scrollY + header.offsetHeight + 80;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  /* Mobile menu */
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
      });
    });
  }

  /* Intersection Observer — reveal animations */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
    revealObserver.observe(el);
  });

  document.querySelectorAll('.skills-column, .about-panel').forEach((el) => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  /* Language bars animation */
  const langObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          langObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.language-bar').forEach((bar) => {
    langObserver.observe(bar);
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
