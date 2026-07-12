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

for(const cell of document.querySelectorAll('.bento-cell')) {
  cell.onmousemove = e => handleOnMouseMove(e);
}
