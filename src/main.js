import './style.css';

// Theme Toggle Logic
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = savedTheme ? savedTheme : (prefersLight ? 'light' : 'dark');
  
  if (initialTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    updateBtnIcon(btn, initialTheme);
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      if (newTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      localStorage.setItem('theme', newTheme);
      themeToggleBtns.forEach(b => updateBtnIcon(b, newTheme));
    });
  });
};

const updateBtnIcon = (btn, theme) => {
  const sunIcon = btn.querySelector('.sun-icon');
  const moonIcon = btn.querySelector('.moon-icon');
  if (sunIcon && moonIcon) {
    if (theme === 'light') {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  }
};

initTheme();

// Glass header blur effect on scroll
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.borderBottom = '1px solid var(--border-color)';
    } else {
      header.style.borderBottom = '1px solid var(--border-hover)';
    }
  });
}

// Bento box hover glow effect
const handleOnMouseMove = e => {
  const { currentTarget: target } = e;
  
  const rect = target.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;
        
  target.style.setProperty('--mouse-x', `${x}px`);
  target.style.setProperty('--mouse-y', `${y}px`);
}

for (const card of document.querySelectorAll('.bento-cell, .project-card, .btn, .nav-btn-primary')) {
  card.onmousemove = e => handleOnMouseMove(e);
}

// Resume Section Full Expand Toggle
const resumePreviewWrapper = document.getElementById('resumePreviewWrapper');
const showFullResumeBtn = document.getElementById('showFullResumeBtn');
const resumeFadeMask = document.getElementById('resumeFadeMask');

if (showFullResumeBtn && resumePreviewWrapper && resumeFadeMask) {
  showFullResumeBtn.addEventListener('click', () => {
    resumePreviewWrapper.style.maxHeight = resumePreviewWrapper.scrollHeight + 'px';
    resumeFadeMask.style.opacity = '0';
    setTimeout(() => {
      resumeFadeMask.style.display = 'none';
      resumePreviewWrapper.style.maxHeight = 'none';
    }, 800);
  });
}

// Mobile Hamburger Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-content a');

if (mobileMenuBtn && mobileNavOverlay) {
  const toggleMenu = () => {
    mobileMenuBtn.classList.toggle('open');
    mobileNavOverlay.classList.toggle('open');
    if (mobileNavOverlay.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  mobileMenuBtn.addEventListener('click', toggleMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('open');
      mobileNavOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Footer Scroll-driven Highlight
const scrollWords = document.querySelectorAll('.scroll-word');
const scrollerPrefix = document.querySelector('.scroller-prefix');

if (scrollWords.length > 0 && scrollerPrefix) {
  const checkHighlight = () => {
    const viewportCenter = window.innerHeight / 2;
    let closestWord = null;
    let minDistance = Infinity;

    scrollWords.forEach(word => {
      const rect = word.getBoundingClientRect();
      const wordCenter = rect.top + rect.height / 2;
      const distance = Math.abs(viewportCenter - wordCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestWord = word;
      }
    });

    scrollWords.forEach(word => {
      if (word === closestWord) {
        word.classList.add('active');
      } else {
        word.classList.remove('active');
      }
    });

    // Animate prefix to align perfectly with the active word
    if (closestWord) {
      scrollerPrefix.style.transform = `translateY(${closestWord.offsetTop}px)`;
    }
  };
  window.addEventListener('scroll', checkHighlight, { passive: true });
  window.addEventListener('resize', checkHighlight, { passive: true });
  // Initial check
  checkHighlight();
}
