/* ============================================================
   WildCAD-E Public Website — app.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. NAV — scroll shadow + mobile toggle
  ---------------------------------------------------------- */
  const nav        = document.getElementById('nav');
  const navToggle  = document.getElementById('navToggle');
  const navLinks   = document.querySelector('.nav-links');

  // Scroll class
  function onScroll() {
    if (window.scrollY > 30) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Mobile hamburger toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      // Animate hamburger lines to X
      const spans = navToggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      });
    });
  }

  /* ----------------------------------------------------------
     2. EMBER PARTICLE CANVAS
  ---------------------------------------------------------- */
  const emberCanvas = document.getElementById('emberCanvas');

  if (emberCanvas) {
    const EMBER_COUNT  = 28;
    const COLORS       = ['#ff6b1a', '#ffb347', '#ff8c42', '#ffd166', '#fc8181'];

    for (let i = 0; i < EMBER_COUNT; i++) {
      const ember = document.createElement('div');
      ember.className = 'ember';

      const size     = (Math.random() * 4 + 2).toFixed(1);   // 2–6px
      const leftPct  = (Math.random() * 90 + 5).toFixed(1);  // 5–95%
      const bottomPct = (Math.random() * 20).toFixed(1);     // 0–20% from bottom
      const dur      = (Math.random() * 4 + 3).toFixed(2);   // 3–7s
      const delay    = (Math.random() * 6).toFixed(2);        // 0–6s
      const drift    = ((Math.random() - 0.5) * 60).toFixed(0); // ±30px
      const opacity  = (Math.random() * 0.5 + 0.3).toFixed(2);
      const color    = COLORS[Math.floor(Math.random() * COLORS.length)];

      ember.style.cssText = [
        'width:'       + size + 'px',
        'height:'      + size + 'px',
        'left:'        + leftPct + '%',
        'bottom:'      + bottomPct + '%',
        'background:'  + color,
        '--dur:'       + dur + 's',
        '--delay:'     + delay + 's',
        '--drift:'     + drift + 'px',
        '--max-opacity:' + opacity,
        'box-shadow: 0 0 ' + (parseFloat(size) * 2) + 'px ' + color,
      ].join(';');

      emberCanvas.appendChild(ember);
    }
  }

  /* ----------------------------------------------------------
     3. SCROLL REVEAL (IntersectionObserver)
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback — show everything immediately
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ----------------------------------------------------------
     4. LIVE INCIDENT TIMERS (mockup)
     Increments the time displayed in the dashboard mockup
  ---------------------------------------------------------- */
  const incTimes = document.querySelectorAll('.inc-time');

  if (incTimes.length) {
    // Parse "m:ss" → total seconds
    function toSeconds(str) {
      const parts = str.split(':');
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }

    // Format seconds → "m:ss"
    function toDisplay(sec) {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return m + ':' + (s < 10 ? '0' : '') + s;
    }

    const timers = Array.from(incTimes).map(function (el) {
      return { el: el, seconds: toSeconds(el.textContent.trim()) };
    });

    setInterval(function () {
      timers.forEach(function (t) {
        t.seconds += 1;
        t.el.textContent = toDisplay(t.seconds);
      });
    }, 1000);
  }

  /* ----------------------------------------------------------
     5. SPARKY TYPING ANIMATION
     Animates the text inside .typing-text spans on scroll
  ---------------------------------------------------------- */
  const typingEls = document.querySelectorAll('.typing-text');

  if (typingEls.length && 'IntersectionObserver' in window) {
    function typeText(el) {
      const fullText = el.getAttribute('data-text') || el.textContent;
      // Store original text in data attr first time
      if (!el.getAttribute('data-text')) {
        el.setAttribute('data-text', fullText);
      }
      el.textContent = '';
      el.style.display = 'inline';

      let i = 0;
      const speed = 18; // ms per character
      const cursor = document.createElement('span');
      cursor.textContent = '▋';
      cursor.style.cssText = 'color:var(--c-purple-light);animation:blink 1s step-end infinite;';
      el.parentNode.insertBefore(cursor, el.nextSibling);

      // Inject blink keyframe once
      if (!document.getElementById('blink-style')) {
        const style = document.createElement('style');
        style.id = 'blink-style';
        style.textContent = '@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}';
        document.head.appendChild(style);
      }

      function tick() {
        if (i < fullText.length) {
          el.textContent += fullText[i++];
          setTimeout(tick, speed);
        } else {
          // Fade cursor out after done
          setTimeout(function () {
            cursor.style.transition = 'opacity 0.5s';
            cursor.style.opacity = '0';
            setTimeout(function () { cursor.remove(); }, 600);
          }, 800);
        }
      }
      setTimeout(tick, 300);
    }

    const typingObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            typeText(entry.target);
            typingObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    typingEls.forEach(function (el) { typingObserver.observe(el); });
  }

  /* ----------------------------------------------------------
     6. STATS COUNT-UP ANIMATION
  ---------------------------------------------------------- */
  const statNums = document.querySelectorAll('.stat-num');

  if (statNums.length && 'IntersectionObserver' in window) {
    function animateCount(el) {
      const raw = el.textContent.trim();
      // Extract numeric prefix (handles "50+", "5", etc.)
      const match = raw.match(/^(\d+)(.*)$/);
      if (!match) return; // non-numeric like "Real-Time" — skip

      const target  = parseInt(match[1], 10);
      const suffix  = match[2];             // e.g. "+"
      const duration = 1400;               // ms
      const startTime = performance.now();

      function step(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(ease * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      el.textContent = '0' + suffix;
      requestAnimationFrame(step);
    }

    const countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNums.forEach(function (el) { countObserver.observe(el); });
  }

  /* ----------------------------------------------------------
     7. INTEGRATION BADGE — staggered entrance
  ---------------------------------------------------------- */
  const integrationBadges = document.querySelectorAll('.integration-badge');

  if (integrationBadges.length && 'IntersectionObserver' in window) {
    // Initially hidden via inline style (observer will remove)
    integrationBadges.forEach(function (badge, i) {
      badge.style.opacity   = '0';
      badge.style.transform = 'translateY(16px)';
      badge.style.transition = 'opacity 0.4s ease ' + (i * 60) + 'ms, transform 0.4s ease ' + (i * 60) + 'ms';
    });

    const badgeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Trigger all badges at once; stagger handled by transition-delay
            integrationBadges.forEach(function (badge) {
              badge.style.opacity   = '1';
              badge.style.transform = 'none';
            });
            badgeObserver.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    const intSection = document.querySelector('.integrations-section');
    if (intSection) badgeObserver.observe(intSection);
  }

  /* ----------------------------------------------------------
     8. SMOOTH ANCHOR SCROLL (with nav offset)
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return; // Logo link
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 64;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     9. ACTIVE NAV LINK on scroll (section spy)
  ---------------------------------------------------------- */
  const sections    = document.querySelectorAll('section[id], footer[id]');
  const navLinkEls  = document.querySelectorAll('.nav-links a');

  if (sections.length && navLinkEls.length) {
    function updateActiveLink() {
      const scrollPos = window.scrollY + 100;
      let current = '';

      sections.forEach(function (section) {
        if (section.offsetTop <= scrollPos) {
          current = '#' + section.id;
        }
      });

      navLinkEls.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === current);
      });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }

  /* ----------------------------------------------------------
     10. AUDIENCE PANEL — arrow bullet hover lift
  ---------------------------------------------------------- */
  document.querySelectorAll('.audience-points li').forEach(function (li) {
    li.addEventListener('mouseenter', function () {
      this.style.color = 'var(--c-text)';
      this.style.transform = 'translateX(4px)';
      this.style.transition = 'color 0.2s, transform 0.2s';
    });
    li.addEventListener('mouseleave', function () {
      this.style.color = '';
      this.style.transform = '';
    });
  });

  /* ----------------------------------------------------------
     11. FEATURE CARD spotlight effect (mouse-follow glow)
  ---------------------------------------------------------- */
  document.querySelectorAll('.feature-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background =
        'radial-gradient(400px circle at ' + x + 'px ' + y + 'px, rgba(255,107,26,0.06) 0%, var(--c-surface) 60%)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.background = '';
    });
  });

  /* ----------------------------------------------------------
     Done
  ---------------------------------------------------------- */
  console.log('%cWildCAD-E %cv1.0', 'color:#ff6b1a;font-weight:900;font-size:14px', 'color:#8b949e;font-size:12px');

})();
