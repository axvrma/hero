import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { GoogleGenAI } from '@google/genai';

const NOTION_HEADERS = {
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
};

const DB_PROJECTS = '39b3888d-7765-8123-a7de-fff0ca4fdf3b';
const DB_EXPERIENCE = '39b3888d-7765-8136-8887-d1e40594e620';
const DB_SKILLS = '39b3888d-7765-81ce-b5ea-df48c5d34555';
const DB_EDUCATION = '39b3888d-7765-8176-8bba-e7132440897d';

async function clearDb(dbId, token) {
  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: { ...NOTION_HEADERS, 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (data.results) {
    for (const page of data.results) {
      await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
        method: 'PATCH',
        headers: { ...NOTION_HEADERS, 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ archived: true })
      });
    }
  }
}

async function createPage(dbId, properties, token) {
  await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: { ...NOTION_HEADERS, 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      parent: { database_id: dbId },
      properties: properties
    })
  });
}

export default async (req, context) => {
  console.log("Background sync started!");
  const token = process.env.NOTION_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const resumeUrl = process.env.RESUME_URL || 'https://drive.google.com/file/d/1VK5y-OIx-8EKoSX0bx1INsAJrqr0qX_-/view';
  const githubUser = process.env.GITHUB_USER || 'axvrma';

  if (!geminiKey) {
    console.error("GEMINI_API_KEY is missing. Cannot parse resume.");
    return;
  }

  try {
    // 1. Fetch Resume PDF
    console.log("Downloading resume...");
    const driveIdMatch = resumeUrl.match(/d\/([a-zA-Z0-9_-]+)/);
    const resumeId = driveIdMatch ? driveIdMatch[1] : '1VK5y-OIx-8EKoSX0bx1INsAJrqr0qX_-';
    
    const pdfRes = await fetch(`https://drive.google.com/uc?export=download&id=${resumeId}`);
    const pdfBuffer = await pdfRes.arrayBuffer();
    
    console.log("Parsing PDF...");
    const pdfData = await pdfParse(Buffer.from(pdfBuffer));
    const resumeText = pdfData.text;

    // 2. Extract Data via Gemini
    console.log("Extracting structured data using Gemini...");
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    
    const prompt = `
Extract the following information from the provided resume text and format it as a JSON object:
{
  "experience": [
    { "company": "Company Name", "role": "Role Name", "duration": "Start - End", "details": "Full description of achievements (keep newlines for bullet points)" }
  ],
  "skills": [
    { "category": "Category Name (e.g., Frontend)", "tags": ["Tag1", "Tag2"] }
  ],
  "education": [
    { "degree": "Degree/Certification Name", "institution": "Institution Name", "duration": "Year or Duration" }
  ]
}
Return ONLY the raw JSON without any markdown code blocks or backticks. Make sure it is completely valid JSON.

Resume Text:
${resumeText}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let rawJson = response.text.trim();
    if (rawJson.startsWith('```json')) {
      rawJson = rawJson.replace(/```json\n?/, '').replace(/```$/, '');
    }
    const parsedData = JSON.parse(rawJson);

    // 3. Update Notion (Experience, Skills, Education)
    console.log("Clearing existing Notion data...");
    await clearDb(DB_EXPERIENCE, token);
    await clearDb(DB_SKILLS, token);
    await clearDb(DB_EDUCATION, token);

    console.log("Pushing Experience...");
    for (let i = 0; i < parsedData.experience.length; i++) {
      const exp = parsedData.experience[i];
      await createPage(DB_EXPERIENCE, {
        'Company': { title: [{ text: { content: exp.company } }] },
        'Role': { rich_text: [{ text: { content: exp.role } }] },
        'Duration': { rich_text: [{ text: { content: exp.duration } }] },
        'Details': { rich_text: [{ text: { content: exp.details } }] },
        'Order': { number: i + 1 }
      }, token);
    }

    console.log("Pushing Skills...");
    for (let i = 0; i < parsedData.skills.length; i++) {
      const skill = parsedData.skills[i];
      await createPage(DB_SKILLS, {
        'Category': { title: [{ text: { content: skill.category } }] },
        'Tags': { multi_select: skill.tags.map(t => ({ name: t })) },
        'Order': { number: i + 1 }
      }, token);
    }

    console.log("Pushing Education...");
    for (let i = 0; i < parsedData.education.length; i++) {
      const edu = parsedData.education[i];
      await createPage(DB_EDUCATION, {
        'Degree': { title: [{ text: { content: edu.degree } }] },
        'Institution': { rich_text: [{ text: { content: edu.institution } }] },
        'Duration': { rich_text: [{ text: { content: edu.duration } }] },
        'Order': { number: i + 1 }
      }, token);
    }

    // 4. Fetch GitHub & Update Projects
    console.log("Fetching Github Repos...");
    const ghRes = await fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=10`);
    if (ghRes.ok) {
      const repos = await ghRes.json();
      console.log("Pushing Projects...");
      await clearDb(DB_PROJECTS, token);
      for (let i = 0; i < repos.length; i++) {
        const repo = repos[i];
        if (repo.fork) continue; // skip forks
        await createPage(DB_PROJECTS, {
          'Name': { title: [{ text: { content: repo.name } }] },
          'Description': { rich_text: [{ text: { content: repo.description || '' } }] },
          'Slug': { rich_text: [{ text: { content: repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') } }] },
          'Github URL': { url: repo.html_url },
          'Tags': { multi_select: repo.language ? [{ name: repo.language }] : [] },
          'Order': { number: i + 1 }
        }, token);
      }
    }

    console.log("Background sync complete!");

  } catch (error) {
    console.error("Background sync failed:", error);
  }
};
