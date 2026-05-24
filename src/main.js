import './style.css';

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function updateThemeIcon(isLight) {
  if (isLight) {
    // Show Moon icon for light mode (to switch to dark)
    themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
  } else {
    // Show Sun icon for dark mode (to switch to light)
    themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
  }
}

// Check saved theme
const savedTheme = localStorage.getItem('theme');
const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
  document.documentElement.setAttribute('data-theme', 'light');
  if(themeIcon) updateThemeIcon(true);
} else {
  if(themeIcon) updateThemeIcon(false);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme === 'light');
  });
}

// Client-side Hydration
import { db } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';

async function hydrateProfile() {
  if (!db) return; // Firebase not configured
  try {
    const docRef = doc(db, "portfolio", "content");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if(data.name) document.getElementById('profile-name').innerText = data.name;
      if(data.headline) document.getElementById('profile-headline').innerText = data.headline;
      if(data.about) document.getElementById('profile-about').innerText = data.about;
      if(data.location) document.getElementById('profile-location').innerText = data.location;
      if(data.experience) document.getElementById('profile-experience').innerText = data.experience;
      if(data.resumeLink) document.getElementById('profile-resume').href = data.resumeLink;
    }
  } catch (e) {
    console.error("Hydration failed (maybe rules restrict read or project is missing):", e);
  }
}

// Only run hydration on the home page (where profile-name exists)
if (document.getElementById('profile-name')) {
  hydrateProfile();
}
