import './style.css';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const GITHUB_USERNAME = 'axvrma';

// Add the exact names of the GitHub repositories you want to feature.
// Example: ['my-awesome-project', 'another-cool-repo']
// Leave the array empty to automatically show your top 12 repositories.
const FEATURED_PROJECTS = [
  'servio',
  'formflow-ai-assistant',
  'web-xr',
  'lighthouse-agent',
  'reels',
  'azure-devops-pr-helper',
  'pop-pay',
  'figma-design-checker',
  'environment-sync',
  'design-spec-generator',
  'paytm-hackathon',
  'figma-compliance-checker',
  'claude-code-predictor'
];
const profileData = {
  name: "Abhishek Verma",
  headline: "Software Development Engineer 2 | Frontend (Angular, React) | Building Scalable UI Systems | Exploring AI & Automation",
  about: "I build frontend systems that scale, not just screens. Strong in Angular, React, UI architecture, and performance-focused design.",
  experience: "Software Development Engineer 2 at DP World",
  location: "Bengaluru, Karnataka, India"
};

const app = document.querySelector('#app');

// Initial Layout Structure
app.innerHTML = `
  <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
    <svg id="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg>
  </button>
  <div class="bg-blob"></div>
  <div class="container">
    <header>
      <h1>${profileData.name}</h1>
      <div class="headline">${profileData.headline}</div>
      <p class="about">${profileData.about}</p>
      <div class="meta-info">
        <span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          ${profileData.location}
        </span>
        <span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          ${profileData.experience}
        </span>
      </div>
      <div class="hero-actions">
        <a href="https://drive.google.com/file/d/1vrhPiirAeWcPQdVbA3BZ9CdhjiMAfUFX/view?usp=sharing" class="btn btn-primary" target="_blank" rel="noopener noreferrer" onclick="if(typeof gtag !== 'undefined') gtag('event', 'click', {'event_category': 'outbound', 'event_label': 'resume_view'});">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 8 9"></polyline></svg>
          View Resume
        </a>
        <a href="https://medium.com/@axvrma" class="btn btn-secondary" target="_blank" rel="noopener noreferrer" onclick="if(typeof gtag !== 'undefined') gtag('event', 'click', {'event_category': 'outbound', 'event_label': 'blog_view'});">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          Read Blog
        </a>
      </div>
    </header>

    <main>
      <h2>Projects</h2>
      <div id="projects-container" class="projects-grid">
        <div class="loader"></div>
      </div>
    </main>
  </div>

  <div class="modal-overlay" id="project-modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title" id="modal-title">Project Name</h2>
        <button class="close-btn" id="close-modal">&times;</button>
      </div>
      <div class="modal-body" id="modal-body">
        <div class="text-center"><div class="loader"></div></div>
      </div>
    </div>
  </div>
`;

// Fetch GitHub Repositories
async function fetchProjects() {
  const projectsContainer = document.getElementById('projects-container');
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
    const repos = await response.json();

    // Filter out forks and sort by stargazers_count then by updated_at
    let validRepos = repos
      .filter(repo => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));

    if (FEATURED_PROJECTS.length > 0) {
      // Show only manually selected projects
      validRepos = validRepos.filter(repo => FEATURED_PROJECTS.includes(repo.name));
    } else {
      // Fallback: Show top 12
      validRepos = validRepos.slice(0, 12);
    }

    projectsContainer.innerHTML = '';

    validRepos.forEach((repo, index) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.style.animation = `fadeInDown 0.5s ease-out ${index * 0.1}s backwards`;

      const homepageLink = repo.homepage ?
        `<a href="${repo.homepage}" class="project-link" target="_blank" rel="noopener noreferrer" title="View Hosted App">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>` : '';

      card.innerHTML = `
        <div class="project-name">
          <span>${repo.name}</span>
          ${homepageLink}
        </div>
        <div class="project-desc">${repo.description || 'No description provided.'}</div>
        <div class="project-meta">
          <span>${repo.language || 'Code'}</span>
          <span>⭐ ${repo.stargazers_count}</span>
        </div>
      `;

      // Prevent modal from opening if the user clicks the external link
      const linkEl = card.querySelector('.project-link');
      if (linkEl) {
        linkEl.addEventListener('click', (e) => e.stopPropagation());
      }

      card.addEventListener('click', () => openProjectModal(repo));
      projectsContainer.appendChild(card);
    });

  } catch (error) {
    projectsContainer.innerHTML = '<p>Failed to load projects.</p>';
    console.error('Error fetching projects:', error);
  }
}

// Modal Logic
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.getElementById('close-modal');

async function openProjectModal(repo) {
  modalTitle.textContent = repo.name;
  modalBody.innerHTML = '<div class="text-center"><div class="loader"></div></div>';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling

  try {
    const response = await fetch(`https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/README.md`);
    if (response.ok) {
      const markdown = await response.text();
      // Parse markdown to HTML and sanitize it
      const html = DOMPurify.sanitize(await marked.parse(markdown));
      modalBody.innerHTML = `<div class="markdown-body">${html}</div>`;
    } else {
      modalBody.innerHTML = `<div class="markdown-body"><p>No README.md found for this project.</p>
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View on GitHub</a></div>`;
    }
  } catch (error) {
    modalBody.innerHTML = '<p>Failed to load README.</p>';
  }
}

function closeProjectModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

closeModalBtn.addEventListener('click', closeProjectModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeProjectModal();
});

// Init
fetchProjects();

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
  updateThemeIcon(true);
} else {
  updateThemeIcon(false);
}

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
