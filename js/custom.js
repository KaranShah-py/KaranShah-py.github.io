/* ==========================================================================
   CUSTOM.JS — dynamic feature behaviour
   1. Dark / Light mode toggle (persisted with localStorage)
   2. Animated skill bars on scroll
   3. Scroll-to-top button
   4. Active nav link highlighting on scroll
   5. Career / tech timeline rendering + reveal-on-scroll
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------------------
     1. DARK / LIGHT MODE
  --------------------------------------------------------------------- */
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
      };

      var saved = localStorage.getItem(STORAGE_KEY);
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(saved ? saved === 'dark' : prefersDark);

      btn.addEventListener('click', function () {
        var isDark = !body.classList.contains('dark-mode');
        applyTheme(isDark);
        localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
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
        date: 'Apr 2026 — Present',
        title: 'Deloitte | Consultant',
        role: 'Mumbai · Agentic AI & Data Engineering',
        desc: 'Built an agentic RAG-based system using LangChain and LangGraph on Databricks, with MLOps for deployment and monitoring. Delivered a multi-agent system for a client using Google\u2019s Agent Development Kit (ADK). Automated invoice processing in Python, cutting per-invoice time from ~3-4 minutes to ~40 seconds (~80% reduction) across a 700-invoice batch — saving 30+ hours of manual effort.',
        tech: ['LangChain', 'LangGraph', 'Databricks', 'MLOps', 'Google ADK', 'Python']
      },
      {
        date: 'Sep 2025 — Apr 2026',
        title: 'EY | Consultant',
        role: 'Mumbai · Data Engineering',
        desc: 'Worked as a Data Engineer on Databricks, handling multiple projects end-to-end while managing a team of 6+. Led the team in designing, developing, and optimizing scalable ETL pipelines for complex datasets, and implemented best practices for data modeling and transformation.',
        tech: ['Databricks', 'SQL', 'PySpark', 'ETL']
      },
      {
        date: 'Aug 2024 — Sep 2025',
        title: 'EY | Associate Consultant',
        role: 'Mumbai, Maharashtra, India',
        desc: 'Developed and led end-to-end Power BI solutions, transforming complex data into interactive dashboards. Contributed to Generative AI (GenAI) projects with Python-driven components. Designed and optimized databases using SQL and Snowflake.',
        tech: ['Power BI', 'Python', 'SQL', 'Snowflake', 'GenAI']
      },
      {
        date: 'Jul 2023 — Aug 2024',
        title: 'EY | Senior Data Analyst',
        role: 'Mumbai, Maharashtra, India',
        desc: 'Worked across a wide range of data, problem statements, and business scenarios using Power BI, Python, SQL, Machine Learning, and Robotic Process Automation (RPA).',
        tech: ['Power BI', 'Python', 'SQL', 'Machine Learning', 'RPA']
      },
      {
        date: '2019 — 2023',
        title: 'Bachelor of Engineering, Computer Engineering',
        role: 'A.P. Shah Institute of Technology — CGPA 9.03',
        desc: 'Built a strong foundation in computer science, databases, and software engineering principles.',
        tech: ['DBMS', 'Java', 'Python', 'Data Structures']
      }
    ];

    var wrap = document.createElement('div');
    wrap.className = 'career-timeline-wrap';

    timelineData.forEach(function (item) {
      var el = document.createElement('div');
      el.className = 'timeline-item';
      el.innerHTML =
        '<span class="timeline-dot"></span>' +
        '<span class="timeline-date">' + item.date + '</span>' +
        '<h3>' + item.title + '</h3>' +
        '<span class="timeline-role">' + item.role + '</span>' +
        '<p class="timeline-desc">' + item.desc + '</p>' +
        '<div class="tech-badge-group">' +
          item.tech.map(function (t) { return '<span class="tech-badge">' + t + '</span>'; }).join('') +
        '</div>';
      wrap.appendChild(el);
    });

    container.appendChild(wrap);

    var items = container.querySelectorAll('.timeline-item');
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

});
