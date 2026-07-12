import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOKEN = process.env.NOTION_API_KEY;

const DB_PROJECTS = '39b3888d-7765-8123-a7de-fff0ca4fdf3b';
const DB_EXPERIENCE = '39b3888d-7765-8136-8887-d1e40594e620';
const DB_SKILLS = '39b3888d-7765-81ce-b5ea-df48c5d34555';
const DB_EDUCATION = '39b3888d-7765-8176-8bba-e7132440897d';
const DB_PROFILE = '39b3888d-7765-81a5-a395-ea404ea6371d';

async function fetchDb(dbId, sortBy = 'Order') {
  const body = {};
  if (sortBy) {
    body.sorts = [
      {
        property: sortBy,
        direction: 'ascending',
      },
    ];
  }
  
  const response = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (data.object === 'error') {
    throw new Error(data.message);
  }
  return data.results;
}

function getPlainText(richTextArr) {
  if (!richTextArr) return '';
  return richTextArr.map(t => t.plain_text).join('');
}

function getHtmlText(richTextArr) {
  if (!richTextArr) return '';
  return richTextArr.map(t => {
    let text = t.plain_text;
    if (t.annotations && t.annotations.color === 'purple') {
      text = `<span class="text-gradient">${text}</span>`;
    }
    return text;
  }).join('');
}

async function build() {
  console.log('Fetching Notion data...');
  
  const [projects, experience, skills, education, profile] = await Promise.all([
    fetchDb(DB_PROJECTS),
    fetchDb(DB_EXPERIENCE),
    fetchDb(DB_SKILLS),
    fetchDb(DB_EDUCATION),
    fetchDb(DB_PROFILE, null)
  ]);

  console.log('Generating Experience HTML...');
  let experienceHtml = '';
  experience.forEach((page, index) => {
    const props = page.properties;
    const company = getPlainText(props.Company?.title);
    const role = getPlainText(props.Role?.rich_text);
    const duration = getPlainText(props.Duration?.rich_text);
    const details = getPlainText(props.Details?.rich_text);
    
    let detailsHtml = '';
    if (details) {
      const items = details.split('\n').filter(i => i.trim());
      detailsHtml = '<ul class="exp-details">' + items.map(i => `<li>${i}</li>`).join('') + '</ul>';
    }

    const mtClass = index > 0 ? 'mt-8' : '';
    experienceHtml += `
      <div class="exp-item ${mtClass}">
        <div class="exp-header">
          <h3>${role}</h3>
          <span class="exp-company">${company}</span>
          <span class="exp-date">${duration}</span>
        </div>
        ${detailsHtml}
      </div>
    `;
  });

  console.log('Generating Education HTML...');
  let educationHtml = '';
  education.forEach(page => {
    const props = page.properties;
    const degree = getPlainText(props.Degree?.title);
    const institution = getPlainText(props.Institution?.rich_text);
    const duration = getPlainText(props.Duration?.rich_text);
    
    educationHtml += `
      <div class="edu-item">
        <h4>${institution}</h4>
        <p>${degree} (${duration})</p>
      </div>
    `;
  });

  console.log('Generating Skills HTML...');
  let skillsHtml = '';
  skills.forEach(page => {
    const props = page.properties;
    const category = getPlainText(props.Category?.title);
    const tags = props.Tags?.multi_select || [];
    
    skillsHtml += `
      <div class="skill-category">
        <h4>${category}</h4>
        <div class="tags">
          ${tags.map(t => `<span class="tag">${t.name}</span>`).join('')}
        </div>
      </div>
    `;
  });

  console.log('Generating Projects HTML...');
  let projectsHtmlFull = '';
  let projectsHtmlTop6 = '';
  
  projects.forEach((page, index) => {
    const props = page.properties;
    const name = getPlainText(props.Name?.title);
    const desc = getPlainText(props.Description?.rich_text);
    const slug = getPlainText(props.Slug?.rich_text) || 'unknown';
    const tags = props.Tags?.multi_select || [];
    const githubUrl = props['Github URL']?.url;
    
    const projectCard = `
      <a href="/project-${slug}.html" class="project-card">
        <div class="project-name">
          <span>${name}</span>
        </div>
        <div class="project-desc">${desc}</div>
        <div class="project-meta">
          ${tags.map(t => `<span class="tag">${t.name}</span>`).join('')}
        </div>
      </a>
    `;
    
    projectsHtmlFull += projectCard;
    if (index < 6) {
      projectsHtmlTop6 += projectCard;
    }
  });

  console.log('Generating Profile HTML...');
  let heroHtml = '';
  let footerWordsHtml = '';
  let marqueeHtml = '';
  let badgeHtml = '';
  let copyrightHtml = '&copy; 2026 Abhishek Verma. All rights reserved.';
  
  if (profile) {
    const profileData = {};
    profile.forEach(page => {
      const name = getPlainText(page.properties.Name?.title);
      profileData[name] = page.properties;
    });

    if (profileData['Hero Section']) {
      const props = profileData['Hero Section'];
      const headingHtml = getHtmlText(props.Heading?.rich_text);
      const subtitleHtml = getHtmlText(props.Subtitle?.rich_text);
      heroHtml = `
            <h1 class="hero-title">
              ${headingHtml}
            </h1>
            <p class="hero-desc">
              ${subtitleHtml}
            </p>
      `;
    }

    if (profileData['Footer Section']) {
      const props = profileData['Footer Section'];
      const wordsText = getPlainText(props.Subtitle?.rich_text);
      if (wordsText) {
        const words = wordsText.split(',').map(w => w.trim()).filter(w => w);
        footerWordsHtml = words.map(w => `<span class="scroll-word">${w}.</span>`).join('\n                ');
      }
    }

    if (profileData['Marquee']) {
      const props = profileData['Marquee'];
      const wordsText = getPlainText(props.Subtitle?.rich_text);
      if (wordsText) {
        const words = wordsText.split(',').map(w => w.trim()).filter(w => w);
        const repeatedWords = [...words, ...words, ...words];
        const innerHtml = repeatedWords.map(w => `<span>${w}</span><span class="marquee-dot">•</span>`).join('\n          ');
        marqueeHtml = `      <div class="marquee-container">
        <div class="marquee-content">
          ${innerHtml}
        </div>
        <div class="marquee-content" aria-hidden="true">
          ${innerHtml}
        </div>
      </div>`;
      }
    }

    if (profileData['Badge']) {
      const props = profileData['Badge'];
      const badgeText = getPlainText(props.Subtitle?.rich_text);
      const badgeLink = props.Link?.url;
      if (badgeText) {
        if (badgeLink) {
          badgeHtml = `<a href="${badgeLink}" class="hero-badge" target="_blank" rel="noopener noreferrer">${badgeText}</a>`;
        } else {
          badgeHtml = `<div class="hero-badge">${badgeText}</div>`;
        }
      }
    }

    if (profileData['Copyright']) {
      const props = profileData['Copyright'];
      const text = getPlainText(props.Subtitle?.rich_text);
      if (text) {
        copyrightHtml = text;
      }
    }
  }

  const injectMarquee = (html) => html.replace(
    /<!-- NOTION_MARQUEE_START -->[\s\S]*?<!-- NOTION_MARQUEE_END -->/g,
    `<!-- NOTION_MARQUEE_START -->\n${marqueeHtml}\n<!-- NOTION_MARQUEE_END -->`
  );

  // Inject into templates
  const rootDir = path.join(__dirname, '..');
  
  console.log('Building index.html...');
  let indexTemplate = fs.readFileSync(path.join(rootDir, 'index-template.html'), 'utf-8');
  indexTemplate = indexTemplate.replace('<!-- NOTION_HERO_BADGE -->', badgeHtml);
  indexTemplate = indexTemplate.replace('<!-- NOTION_COPYRIGHT -->', copyrightHtml);
  indexTemplate = indexTemplate.replace('<!-- NOTION_HERO -->', heroHtml);
  indexTemplate = indexTemplate.replace('<!-- NOTION_FOOTER_WORDS -->', footerWordsHtml);
  indexTemplate = indexTemplate.replace('<!-- NOTION_EXPERIENCE -->', experienceHtml);
  indexTemplate = indexTemplate.replace('<!-- NOTION_EDUCATION -->', educationHtml);
  indexTemplate = indexTemplate.replace('<!-- NOTION_SKILLS -->', skillsHtml);
  indexTemplate = indexTemplate.replace('<!-- NOTION_PROJECTS -->', projectsHtmlTop6);
  indexTemplate = injectMarquee(indexTemplate);
  fs.writeFileSync(path.join(rootDir, 'index.html'), indexTemplate);
  
  console.log('Building resume.html...');
  let resumeTemplate = fs.readFileSync(path.join(rootDir, 'resume-template.html'), 'utf-8');
  resumeTemplate = resumeTemplate.replace('<!-- NOTION_COPYRIGHT -->', copyrightHtml);
  resumeTemplate = resumeTemplate.replace('<!-- NOTION_FOOTER_WORDS -->', footerWordsHtml);
  resumeTemplate = resumeTemplate.replace('<!-- NOTION_EXPERIENCE -->', experienceHtml);
  resumeTemplate = resumeTemplate.replace('<!-- NOTION_EDUCATION -->', educationHtml);
  resumeTemplate = resumeTemplate.replace('<!-- NOTION_SKILLS -->', skillsHtml);
  resumeTemplate = injectMarquee(resumeTemplate);
  fs.writeFileSync(path.join(rootDir, 'resume.html'), resumeTemplate);
  
  console.log('Building projects.html...');
  let projectsTemplate = fs.readFileSync(path.join(rootDir, 'projects-template.html'), 'utf-8');
  projectsTemplate = projectsTemplate.replace('<!-- NOTION_COPYRIGHT -->', copyrightHtml);
  projectsTemplate = projectsTemplate.replace('<!-- NOTION_FOOTER_WORDS -->', footerWordsHtml);
  projectsTemplate = projectsTemplate.replace('<!-- NOTION_PROJECTS_FULL -->', projectsHtmlFull);
  projectsTemplate = injectMarquee(projectsTemplate);
  fs.writeFileSync(path.join(rootDir, 'projects.html'), projectsTemplate);
  
  console.log('Updating project pages...');
  const allFiles = fs.readdirSync(rootDir);
  const projectPages = allFiles.filter(f => f.startsWith('project-') && f.endsWith('.html'));
  for (const page of projectPages) {
    let content = fs.readFileSync(path.join(rootDir, page), 'utf-8');
    content = injectMarquee(content);
    fs.writeFileSync(path.join(rootDir, page), content);
  }
  
  console.log('Notion SSG Build Complete!');
}

build().catch(console.error);
