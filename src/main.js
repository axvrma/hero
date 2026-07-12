import './style.css';

// Glass header blur effect on scroll
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.background = 'rgba(10, 10, 10, 0.9)';
      header.style.borderBottom = '1px solid #2a2a30';
    } else {
      header.style.background = 'rgba(10, 10, 10, 0.8)';
      header.style.borderBottom = '1px solid #1f1f23';
    }
  });
}

// Bento box hover glow & 3D Tilt effect
const handleOnMouseMove = e => {
  const { currentTarget: target } = e;
  
  const rect = target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
        
  target.style.setProperty('--mouse-x', `${x}px`);
  target.style.setProperty('--mouse-y', `${y}px`);
  
  if (target.classList.contains('bento-cell') || target.classList.contains('project-card')) {
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg tilt
    const rotateY = ((x - centerX) / centerX) * 5;
    
    target.style.transition = 'none';
    target.style.transform = `perspective(1000px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }
}

const handleOnMouseLeave = e => {
  const { currentTarget: target } = e;
  if (target.classList.contains('bento-cell') || target.classList.contains('project-card')) {
    target.style.transition = 'transform 0.5s ease-out';
    target.style.transform = `perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)`;
  }
}

for (const card of document.querySelectorAll('.bento-cell, .project-card, .btn, .nav-btn-primary')) {
  card.addEventListener('mousemove', handleOnMouseMove);
  card.addEventListener('mouseleave', handleOnMouseLeave);
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

// --- NEW: Custom Cursor Logic ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    // Dot follows exactly
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    
    // Outline follows with slight delay via JS animation
    cursorOutline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
  });

  // Add hover state for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, .nav-item, .bento-cell');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
  });
}

// --- NEW: Scroll-Driven Animations (Intersection Observer) ---
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

const elementsToAnimate = document.querySelectorAll('.hero-section, .bento-cell, .project-card, .resume-preview-section, .section-title');
elementsToAnimate.forEach((el, index) => {
  el.classList.add('animate-on-scroll');
  if (index % 3 === 1) el.classList.add('delay-100');
  if (index % 3 === 2) el.classList.add('delay-200');
  observer.observe(el);
});
