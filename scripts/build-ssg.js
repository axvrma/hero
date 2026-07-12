import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify'; // Need isomorphic DOMPurify for Node

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_USERNAME = 'axvrma';
const FEATURED_PROJECTS = [
  'servio', 'formflow-ai-assistant', 'web-xr', 'lighthouse-agent', 'reels',
  'azure-devops-pr-helper', 'pop-pay', 'figma-design-checker', 'environment-sync',
  'design-spec-generator', 'paytm-hackathon', 'figma-compliance-checker', 'claude-code-predictor'
];

function formatRepoName(name) {
  // Convert "figma-design-checker" -> "Figma Design Checker"
  return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function fetchProjects() {
  const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
  const repos = await response.json();

  let validRepos = repos
    .filter(repo => !repo.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));

  if (FEATURED_PROJECTS.length > 0) {
    validRepos = validRepos.filter(repo => FEATURED_PROJECTS.includes(repo.name));
  } else {
    validRepos = validRepos.slice(0, 12);
  }
  return validRepos;
}

async function fetchReadme(repoName) {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/main/README.md`);
    if (!response.ok) {
      const fallback = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/master/README.md`);
      if (!fallback.ok) return '';
      return await fallback.text();
    }
    return await response.text();
  } catch (e) {
    return '';
  }
}

async function build() {
  const rootDir = path.join(__dirname, '..');
  const template = fs.readFileSync(path.join(rootDir, 'index-template.html'), 'utf-8');
  const projectTemplate = fs.readFileSync(path.join(rootDir, 'project-template.html'), 'utf-8');

  console.log('Fetching projects...');
  const repos = await fetchProjects();

  // 1. Build Index.html
  console.log('Building index.html...');
  let projectsHtml = '';
  repos.forEach((repo, index) => {
    const homepageLink = repo.homepage ? 
      `<a href="${repo.homepage}" class="project-link" target="_blank" rel="noopener noreferrer" title="View Hosted App" onclick="if(typeof gtag !== 'undefined') gtag('event', 'click', {'event_category': 'outbound', 'event_label': 'project_live_${repo.name}'}); event.stopPropagation();">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
      </a>` : '';

    projectsHtml += `
      <div class="project-card" style="animation: fadeInDown 0.5s ease-out ${index * 0.1}s backwards" onclick="window.location.href='/project-${repo.name}.html'">
        <div class="project-name">
          <span>${formatRepoName(repo.name)}</span>
          ${homepageLink}
        </div>
        <div class="project-desc">${repo.description || 'No description provided.'}</div>
        <div class="project-meta">
          <span>${repo.language || 'Code'}</span>
        </div>
      </div>
    `;
  });

  const profileData = {
    name: "Abhishek Verma",
    headline: "Software Development Engineer 2 | Frontend (Angular, React) | Building Scalable UI Systems | Exploring AI & Automation",
    about: "I build frontend systems that scale, not just screens. Strong in Angular, React, UI architecture, and performance-focused design.",
    experience: "Software Development Engineer 2 at DP World",
    location: "Bengaluru, Karnataka, India"
  };

  const appHtml = `
  <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
    <svg id="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg>
  </button>
  <div class="bg-blob"></div>
  <div class="container">
    <header>
      <h1 id="profile-name">${profileData.name}</h1>
      <div class="headline" id="profile-headline">${profileData.headline}</div>
      <p class="about" id="profile-about">${profileData.about}</p>
      <div class="meta-info">
        <span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span id="profile-location">${profileData.location}</span>
        </span>
        <span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          <span id="profile-experience">${profileData.experience}</span>
        </span>
      </div>
      <div class="action-bar">
        <div class="hero-actions">
          <a id="profile-resume" href="https://drive.google.com/file/d/1vrhPiirAeWcPQdVbA3BZ9CdhjiMAfUFX/view?usp=sharing" class="btn btn-primary" target="_blank" rel="noopener noreferrer" onclick="if(typeof gtag !== 'undefined') gtag('event', 'click', {'event_category': 'outbound', 'event_label': 'resume_view'});">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 8 9"></polyline></svg>
            Resume <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
          <a href="https://medium.com/@axvrma" class="btn btn-secondary" target="_blank" rel="noopener noreferrer" onclick="if(typeof gtag !== 'undefined') gtag('event', 'click', {'event_category': 'outbound', 'event_label': 'blog_view'});">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            Read Blog
          </a>
        </div>
        <div class="social-links">
          <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener noreferrer" aria-label="GitHub" data-tooltip="GitHub" onclick="if(typeof gtag !== 'undefined') gtag('event', 'click', {'event_category': 'social', 'event_label': 'github'});">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
          <a href="https://linkedin.com/in/axvrma" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" data-tooltip="LinkedIn" onclick="if(typeof gtag !== 'undefined') gtag('event', 'click', {'event_category': 'social', 'event_label': 'linkedin'});">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a href="https://instagram.com/axvrma" target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-tooltip="Instagram" onclick="if(typeof gtag !== 'undefined') gtag('event', 'click', {'event_category': 'social', 'event_label': 'instagram'});">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
        </div>
      </div>
    </header>
    <main>
      <h2>Projects</h2>
      <div id="projects-container" class="projects-grid">
        ${projectsHtml}
      </div>
      <div style="text-align: center; margin-top: 3rem;">
        <a href="https://github.com/${GITHUB_USERNAME}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          More on GitHub
        </a>
      </div>
    </main>
  </div>
  `;

  const finalIndexHtml = template.replace('<div id="app"></div>', `<div id="app">${appHtml}</div>`);
  fs.writeFileSync(path.join(rootDir, 'index.html'), finalIndexHtml);

  // 2. Build Project Pages
  console.log('Building project pages...');
  for (const repo of repos) {
    const rawMarkdown = await fetchReadme(repo.name);
    let readmeHtml = '<p>No README found.</p>';
    if (rawMarkdown) {
      readmeHtml = DOMPurify.sanitize(marked.parse(rawMarkdown));
    }

    const projectHtml = `
    <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
      <svg id="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg>
    </button>
    <div class="bg-blob"></div>
    <div class="project-split-layout">
      <aside class="project-sidebar">
        <a href="/" class="btn btn-secondary" style="margin-bottom: 2rem; display: inline-flex;">&larr; Back to Home</a>
        <h1 style="margin-bottom: 1rem;">${formatRepoName(repo.name)}</h1>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">${repo.description || ''}</p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="${repo.html_url}" class="btn btn-primary" target="_blank" style="flex: 1; text-align: center;">Source on GitHub</a>
          ${repo.homepage ? `<a href="${repo.homepage}" class="btn btn-secondary" target="_blank" style="flex: 1; text-align: center;">Live App</a>` : ''}
        </div>
      </aside>
      <div class="project-content markdown-body">
        ${readmeHtml}
      </div>
    </div>
    `;

    // Set page title for SEO
    let pageTemplate = projectTemplate.replace(/<title>.*<\/title>/, `<title>${formatRepoName(repo.name)} | Abhishek Verma</title>`);
    
    // Inject the GA script tracking event to track the pageview properly
    const finalProjectHtml = pageTemplate.replace('<div id="app"></div>', `<div id="app">${projectHtml}</div>`);
    fs.writeFileSync(path.join(rootDir, `project-${repo.name}.html`), finalProjectHtml);
    console.log(`Generated project-${repo.name}.html`);
  }

  console.log('SSG Build Complete!');
}

build().catch(console.error);
