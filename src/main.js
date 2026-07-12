import './style.css';

// Glass header blur effect on scroll
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.backgroundColor = 'rgba(10, 10, 10, 0.65)';
      header.style.borderBottom = '1px solid #2a2a30';
    } else {
      header.style.backgroundColor = 'rgba(10, 10, 10, 0.35)';
      header.style.borderBottom = '1px solid #1f1f23';
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
