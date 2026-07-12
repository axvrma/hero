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

// Experience Section Toggle
const expTimeline = document.getElementById('expTimeline');
const expToggleBtn = document.getElementById('expToggleBtn');
if (expTimeline && expToggleBtn) {
  const items = expTimeline.querySelectorAll('.timeline-item');
  if (items.length > 2) {
    for (let i = 2; i < items.length; i++) {
      items[i].style.display = 'none';
    }
    let isExpanded = false;
    expToggleBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      for (let i = 2; i < items.length; i++) {
        items[i].style.display = isExpanded ? 'block' : 'none';
      }
      expToggleBtn.innerHTML = isExpanded ? 'Show Less Experience &uarr;' : 'Show More Experience &darr;';
    });
  } else {
    expToggleBtn.style.display = 'none';
  }
}
