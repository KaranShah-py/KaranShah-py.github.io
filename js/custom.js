/* ==========================================================================
   CUSTOM.JS — dynamic feature behaviour
   1. Dark / Light mode toggle (persisted with localStorage)
   2. Animated skill bars on scroll
   3. Scroll-to-top button
   4. Active nav link highlighting on scroll
   5. Career / tech timeline rendering + reveal-on-scroll
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ===== 0. MODERN SCROLL REVEAL ANIMATIONS ===== */
  (function scrollReveal() {
    var elements = document.querySelectorAll('.ftco-animate, .resume-wrap, .blog-entry, .contact-section .box');
    if (!elements.length) return;

    var observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.visibility = 'visible';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    elements.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
      observer.observe(el);
    });
  })();

  /* ===== 0B. NAVBAR BLUR & ELEVATION EFFECT ON SCROLL ===== */
  (function navbarScrollEffect() {
    var navbar = document.querySelector('.ftco_navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        navbar.style.backdropFilter = 'blur(10px)';
      } else {
        navbar.classList.remove('scrolled');
        navbar.style.backdropFilter = 'none';
      }
    }, { passive: true });
  })();

  /* ===== 0C. ENHANCED BUTTON RIPPLE EFFECT ===== */
  (function buttonRipple() {
    var buttons = document.querySelectorAll('.btn-primary, .btn-outline-white');
    buttons.forEach(function (btn) {
      btn.addEventListener('mousedown', function (e) {
        var ripple = document.createElement('span');
        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var x = e.clientX - rect.left - size / 2;
        var y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.className = 'ripple';
        ripple.style.position = 'absolute';
        ripple.style.pointerEvents = 'none';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.animation = 'rippleAnimation 0.6s ease-out';
        ripple.style.transform = 'scale(0)';

        if (!btn.style.position || btn.style.position === 'static') {
          btn.style.position = 'relative';
          btn.style.overflow = 'hidden';
        }
        btn.appendChild(ripple);

        setTimeout(function () { ripple.remove(); }, 600);
      });
    });

    // Add ripple animation if not already defined
    if (!document.querySelector('style[data-ripple]')) {
      var style = document.createElement('style');
      style.setAttribute('data-ripple', 'true');
      style.innerHTML = '@keyframes rippleAnimation { to { transform: scale(4); opacity: 0; } }';
      document.head.appendChild(style);
    }
  })();

  /* ===== 0D. SMOOTH SCROLL FOR ANCHOR LINKS ===== */
  (function smoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;

        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var headerOffset = 100;
          var elementPosition = target.getBoundingClientRect().top;
          var offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  })();

  /* ===== 0E. SCROLL-BASED HERO FADE & PARALLAX ===== */
  (function heroScrollEffect() {
    var heroContent = document.querySelector('.hero .ftco-animate');
    var heroImage = document.querySelector('.hero .one-third.img');
    if (!heroContent) return;

    window.addEventListener('scroll', function () {
      var scrollPercent = Math.min(window.scrollY / 400, 1);
      var opacity = 1 - scrollPercent;
      heroContent.style.opacity = opacity;
      heroContent.style.transform = 'translateY(' + (scrollPercent * 30) + 'px)';

      if (heroImage) {
        heroImage.style.transform = 'translateY(' + (scrollPercent * -20) + 'px)';
      }
    }, { passive: true });
  })();

  /* ===== 0F. COUNTER ENHANCEMENT ===== */
  (function enhanceCounters() {
    var counters = document.querySelectorAll('.number');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          var target = parseInt(entry.target.getAttribute('data-number'), 10);
          var count = 0;
          var increment = target / 40;
          var timer = setInterval(function () {
            count += increment;
            if (count >= target) {
              entry.target.textContent = target;
              clearInterval(timer);
              entry.target.classList.add('counted');
            } else {
              entry.target.textContent = Math.floor(count);
            }
          }, 25);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) { observer.observe(counter); });
  })();

  /* ===== 0G. HEADING UNDERLINE ANIMATION ===== */
  (function headingAnimation() {
    var headings = document.querySelectorAll('.heading-section h2');
    headings.forEach(function (heading) {
      heading.addEventListener('mouseenter', function () {
        var pseudo = window.getComputedStyle(this, ':after');
        if (pseudo) {
          this.style.setProperty('--underline-width', '100%');
        }
      });

      heading.addEventListener('mouseleave', function () {
        this.style.setProperty('--underline-width', '60px');
      });
    });
  })();

  /* ===== 0H. INTERSECTION OBSERVER FOR LAZY IMAGES ===== */
  (function lazyLoadImages() {
    var images = document.querySelectorAll('img[data-src]');
    if (!images.length || !('IntersectionObserver' in window)) return;

    var imageObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(function (img) { imageObserver.observe(img); });
  })();

  /* ===== 0I. FORM INPUT FOCUS ENHANCEMENT ===== */
  (function formEnhancement() {
    var inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(function (input) {
      input.addEventListener('focus', function () {
        this.parentElement.style.boxShadow = '0 4px 16px rgba(255, 107, 53, 0.15)';
      });

      input.addEventListener('blur', function () {
        this.parentElement.style.boxShadow = 'none';
      });
    });
  })();

  /* ===== 0J. MOTION PREFERENCE RESPECT ===== */
  (function respectMotionPreference() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.body.classList.add('reduce-motion');
      var style = document.createElement('style');
      style.innerHTML = `
        .reduce-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    }
  })();

  /* ===== END MODERN ANIMATIONS ===== */

  /* ===== 0K. TYPING ANIMATION - FADE IN/OUT (Encapsulated) ===== */
  (function typingAnimation() {
    var typingEl = document.getElementById('typing-animation');
    if (!typingEl) return;

    var typingTexts = [
      'Data Engineer  ',
      'Agentic AI Engineer  ',
      'Consultant  ',
    ];

    // Add fade animation styles if not already present
    if (!document.querySelector('style[data-fade-animation]')) {
      var style = document.createElement('style');
      style.setAttribute('data-fade-animation', 'true');
      style.innerHTML = `
        @keyframes fadeInText {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOutText {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        [id="typing-animation"] {
          animation: none;
        }
      `;
      document.head.appendChild(style);
    }

    var currentTextIndex = 0;
    var fadeInDuration = 600;    // Fade in over 600ms
    var displayDuration = 2000;  // Show for 2000ms
    var fadeOutDuration = 600;   // Fade out over 600ms

    function updateAllTypingElements(text, animationName, duration) {
      // Update all cloned elements (Owl carousel creates multiple clones)
      var allTypingEls = document.querySelectorAll('[id="typing-animation"]');
      allTypingEls.forEach(function(el) {
        el.textContent = text;
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow to reset animation
        if (animationName) {
          el.style.animation = animationName + ' ' + duration + 'ms ease-in-out forwards';
        }
      });
    }

    function cycle() {
      var currentText = typingTexts[currentTextIndex];
      
      // Fade in
      updateAllTypingElements(currentText, 'fadeInText', fadeInDuration);
      
      // After fade in + display, fade out
      setTimeout(function() {
        updateAllTypingElements(currentText, 'fadeOutText', fadeOutDuration);
      }, fadeInDuration + displayDuration);
      
      // After fade out, move to next text
      setTimeout(function() {
        currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
        cycle();
      }, fadeInDuration + displayDuration + fadeOutDuration);
    }

    // Start the animation
    setTimeout(cycle, 300);
  })();

  /* ===== 0L. SKILLS TYPING ANIMATION (Encapsulated) ===== */
  (function skillsTypingAnimation() {
    var skillsEl = document.getElementById('skills-typing-animation');
    if (!skillsEl) return;

    var skillsList = [
      'Databricks',
      'SQL',
      'AWS',
      'Data Modelling',
      'Data quality and assurance',
      'Power BI',
      'Google Cloud', 
      'Delta Live Tables', 
      'Data Pipelines'
    ];

    var currentSkillIndex = 0;
    var currentCharIndex = 0;
    var isDeleting = false;
    var typingSpeed = 100;
    var deletingSpeed = 50;
    var pauseTime = 2000;

    function updateAllSkillsElements(text) {
      // Update all cloned elements (Owl carousel creates multiple clones)
      var allSkillsEls = document.querySelectorAll('[id="skills-typing-animation"]');
      allSkillsEls.forEach(function(el) {
        el.textContent = text;
      });
    }

    function typeSkill() {
      var currentSkill = skillsList[currentSkillIndex];
      
      if (!isDeleting) {
        // Typing mode - build text character by character
        if (currentCharIndex < currentSkill.length) {
          currentCharIndex++;
          var displayText = currentSkill.substring(0, currentCharIndex);
          updateAllSkillsElements(displayText);
          setTimeout(typeSkill, typingSpeed);
        } else {
          // Pause at end of skill before deleting
          isDeleting = true;
          setTimeout(typeSkill, pauseTime);
        }
      } else {
        // Deleting mode
        if (currentCharIndex > 0) {
          currentCharIndex--;
          var displayText = currentSkill.substring(0, currentCharIndex);
          updateAllSkillsElements(displayText);
          setTimeout(typeSkill, deletingSpeed);
        } else {
          // Move to next skill
          isDeleting = false;
          currentSkillIndex = (currentSkillIndex + 1) % skillsList.length;
          setTimeout(typeSkill, 500);
        }
      }
    }

    // Start the skills animation
    setTimeout(typeSkill, 500);
  })();

  /* ===== 1. DARK / LIGHT MODE ===== */
  (function themeToggle() {
    var body = document.body;
    var STORAGE_KEY = 'karan-portfolio-theme';

    // Create the toggle button and drop it into the nav
    var navList = document.querySelector('#ftco-nav .navbar-nav');
    if (navList) {
      var li = document.createElement('li');
      li.className = 'nav-item d-flex align-items-center';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'themeToggleBtn';
      btn.className = 'theme-toggle-btn';
      btn.setAttribute('aria-label', 'Toggle dark mode');
      btn.innerHTML = '<span class="icon-moon"></span>';
      li.appendChild(btn);
      navList.appendChild(li);

      var applyTheme = function (isDark) {
        body.classList.toggle('dark-mode', isDark);
        btn.innerHTML = isDark ? '☀️' : '🌙';
        btn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        
        // Force repaint for better transition
        body.offsetHeight;
      };

      var saved = localStorage.getItem(STORAGE_KEY);
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(saved ? saved === 'dark' : prefersDark);

      btn.addEventListener('click', function () {
        var isDark = !body.classList.contains('dark-mode');
        applyTheme(isDark);
        localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
        
        // Add smooth transition class
        body.style.transition = 'background-color 0.35s ease, color 0.35s ease';
      });
    }
  })();

  /* ---------------------------------------------------------------------
     2. ANIMATED SKILL BARS
  --------------------------------------------------------------------- */
  (function skillBars() {
    var bars = document.querySelectorAll('.skill-mf .progress-bar');
    if (!bars.length) return;

    bars.forEach(function (bar) {
      // remember the intended target width, then zero it out until in view
      var target = bar.style.width || (bar.getAttribute('aria-valuenow') + '%');
      bar.setAttribute('data-target-width', target);
      bar.style.width = '0%';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          bar.style.width = bar.getAttribute('data-target-width');
          bar.classList.add('animated');
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(function (bar) { observer.observe(bar); });
  })();

  /* ---------------------------------------------------------------------
     3. SCROLL-TO-TOP BUTTON
  --------------------------------------------------------------------- */
  (function scrollTop() {
    var btn = document.createElement('button');
    btn.id = 'scrollTopBtn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<span class="ion-ios-arrow-up"></span>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
      btn.classList.toggle('show', window.scrollY > 400);
    });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  /* ---------------------------------------------------------------------
     4. ACTIVE NAV LINK HIGHLIGHTING
  --------------------------------------------------------------------- */
  (function activeNav() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('#ftco-nav .nav-link');
    if (!sections.length || !navLinks.length) return;

    var linkFor = function (id) {
      return document.querySelector('#ftco-nav .nav-link[href="#' + id + '"]');
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkFor(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('active-link'); });
          link.classList.add('active-link');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  })();

  /* ---------------------------------------------------------------------
     5. CAREER / TECH TIMELINE
  --------------------------------------------------------------------- */
  (function careerTimeline() {
    var container = document.getElementById('career-timeline');
    if (!container) return;

    // Edit this array to update your journey — no HTML editing required.
    var timelineData = [
      {
        date: 'Apr 2026',
        dateLabel: 'Present',
        title: 'Deloitte | Consultant',
        role: 'Mumbai · Agentic AI & Data Engineering',
        desc: 'Built an agentic RAG-based system using LangChain and LangGraph on Databricks, with MLOps for deployment and monitoring. Delivered a multi-agent system for a client using Google\u2019s Agent Development Kit (ADK). Automated invoice processing in Python, cutting per-invoice time from ~3-4 minutes to ~40 seconds (~80% reduction) across a 700-invoice batch — saving 30+ hours of manual effort.',
        tech: ['LangChain', 'LangGraph', 'Databricks', 'MLOps', 'Google ADK', 'Python'],
        position: 'left'
      },
      {
        date: 'Sep 2025 — Apr 2026',
        dateLabel: 'Sep 2025',
        title: 'EY | Consultant',
        role: 'Mumbai · Data Engineering',
        desc: 'Worked as a Data Engineer on Databricks, handling multiple projects end-to-end while managing a team of 6+. Led the team in designing, developing, and optimizing scalable ETL pipelines for complex datasets, and implemented best practices for data modeling and transformation.',
        tech: ['Databricks', 'SQL', 'PySpark', 'ETL'],
        position: 'right'
      },
      {
        date: 'Aug 2024 — Sep 2025',
        dateLabel: 'Aug 2024',
        title: 'EY | Associate Consultant',
        role: 'Mumbai, Maharashtra, India',
        desc: 'Developed and led end-to-end Power BI solutions, transforming complex data into interactive dashboards. Contributed to Generative AI (GenAI) projects with Python-driven components. Designed and optimized databases using SQL and Snowflake.',
        tech: ['Power BI', 'Python', 'SQL', 'Snowflake', 'GenAI'],
        position: 'left'
      },
      {
        date: 'Jul 2023 — Aug 2024',
        dateLabel: 'Jul 2023',
        title: 'EY | Senior Data Analyst',
        role: 'Mumbai, Maharashtra, India',
        desc: 'Worked across a wide range of data, problem statements, and business scenarios using Power BI, Python, SQL, Machine Learning, and Robotic Process Automation (RPA).',
        tech: ['Power BI', 'Python', 'SQL', 'Machine Learning', 'RPA'],
        position: 'right'
      },
      {
        date: '2019 — 2023',
        dateLabel: '2019',
        title: 'Bachelor of Engineering, Computer Engineering',
        role: 'A.P. Shah Institute of Technology — CGPA 9.03',
        desc: 'Built a strong foundation in computer science, databases, and software engineering principles.',
        tech: ['DBMS', 'Java', 'Python', 'Data Structures'],
        position: 'left'
      }
    ];

    var wrap = document.createElement('div');
    wrap.className = 'career-timeline-wrap infographic';

    // Create the center timeline line
    var timelineLine = document.createElement('div');
    timelineLine.className = 'timeline-center-line';
    wrap.appendChild(timelineLine);

    timelineData.forEach(function (item, index) {
      var itemRow = document.createElement('div');
      itemRow.className = 'timeline-item-row ' + item.position;

      // Create the timeline dot
      var dot = document.createElement('div');
      dot.className = 'timeline-dot-center';
      dot.innerHTML = '<span class="dot-inner"></span>';

      // Create the card
      var card = document.createElement('div');
      card.className = 'timeline-card-infographic';
      
      // Create the connecting arrow line
      var connector = document.createElement('div');
      connector.className = 'connector-line';

      card.innerHTML =
        '<div class="card-badge">' + (index + 1).toString().padStart(2, '0') + '</div>' +
        '<div class="timeline-card-header">' +
        '  <span class="timeline-date-label">' + item.dateLabel + '</span>' +
        '  <h3>' + item.title + '</h3>' +
        '</div>' +
        '<span class="timeline-role">' + item.role + '</span>' +
        '<p class="timeline-desc">' + item.desc + '</p>' +
        '<div class="tech-badge-group">' +
          item.tech.map(function (t) { return '<span class="tech-badge">' + t + '</span>'; }).join('') +
        '</div>';

      itemRow.appendChild(card);
      itemRow.appendChild(connector);
      itemRow.appendChild(dot);
      wrap.appendChild(itemRow);
    });

    container.appendChild(wrap);

    // Animate items on scroll
    var items = container.querySelectorAll('.timeline-item-row');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach(function (item) { observer.observe(item); });
  })();

  /* -----------------------------------------------
     6. ENHANCED INTERACTIVITY & POLISH
  ------------------------------------------------ */
  (function enhancements() {
    // Add smooth transitions to all interactive elements
    var interactive = document.querySelectorAll('a, button, .btn, .nav-link, .block-18, .resume-wrap');
    interactive.forEach(function (el) {
      el.style.willChange = 'transform, box-shadow';
    });

    // Enhance counter animations when visible
    var counters = document.querySelectorAll('.number');
    if (counters.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            var target = parseInt(entry.target.getAttribute('data-number'), 10);
            var count = 0;
            var increment = target / 30; // Animate over 30 frames
            var timer = setInterval(function () {
              count += increment;
              if (count >= target) {
                entry.target.textContent = target;
                clearInterval(timer);
                entry.target.classList.add('counted');
              } else {
                entry.target.textContent = Math.floor(count);
              }
            }, 30);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(function (counter) { observer.observe(counter); });
    }

    // Enhance project image loading with fade-in effect
    var projectImages = document.querySelectorAll('.zoom-effect');
    projectImages.forEach(function (img) {
      img.style.opacity = '0';
      var timer = setTimeout(function () {
        img.style.transition = 'opacity 0.6s ease-out';
        img.style.opacity = '1';
      }, 100);
    });

    // Improve navbar dropdown behavior on mobile
    var navToggle = document.querySelector('.navbar-toggler');
    if (navToggle) {
      navToggle.addEventListener('click', function () {
        var navbar = document.querySelector('.navbar-collapse');
        if (navbar) {
          navbar.style.transition = 'max-height 0.3s ease';
        }
      });
    }
  })();

});

/* ===== AWARDS CAROUSEL - CONTINUOUS SMOOTH SCROLLING ===== */
(function initAwardsCarousel() {
  const wrapper = document.getElementById('awardsScrollWrapper');

  if (!wrapper) return;

  const originalCards = Array.from(
    wrapper.querySelectorAll('.award-card')
  );

  if (!originalCards.length) return;

  /*
   * Create one duplicate set.
   * We only need one additional copy because
   * the animation continuously moves through one
   * complete set before repeating.
   */
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    wrapper.appendChild(clone);
  });

  const scrollContainer = wrapper.parentElement;

  if (!scrollContainer) return;

  /*
   * Make sure the container hides cards outside
   * the visible area.
   */
  scrollContainer.style.overflow = 'hidden';

  /*
   * Make the wrapper a single horizontal row.
   */
  wrapper.style.display = 'flex';
  wrapper.style.flexWrap = 'nowrap';
  wrapper.style.willChange = 'transform';

  let position = 0;
  let animationFrame;
  let lastTimestamp = null;

  /*
   * Adjust this value to control speed.
   *
   * 0.04 = slower
   * 0.06 = normal
   * 0.08 = faster
   */
  const speed = 0.03;

  function animate(timestamp) {
    if (!lastTimestamp) {
      lastTimestamp = timestamp;
    }

    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    position -= speed * deltaTime;

    /*
     * Calculate the width of the first set of cards.
     * The second set is an exact copy, so once the
     * first set has completely moved away, we reset
     * the position by exactly that amount.
     */
    const firstCardSetWidth =
      wrapper.scrollWidth / 2;

    if (Math.abs(position) >= firstCardSetWidth) {
      position += firstCardSetWidth;
    }

    wrapper.style.transform =
      `translate3d(${position}px, 0, 0)`;

    animationFrame =
      requestAnimationFrame(animate);
  }

  /*
   * Start animation.
   */
  animationFrame =
    requestAnimationFrame(animate);

  /*
   * Pause when the browser tab is not visible.
   * This avoids unnecessary processing.
   */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
      lastTimestamp = null;
    } else {
      animationFrame =
        requestAnimationFrame(animate);
    }
  });
})();
