

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
  // Allow hitting this from the browser via GET with a secret query parameter
  // Example: /api/sync-notion-background?secret=YOUR_SECRET
  
  const url = new URL(req.url);
  const secret = url.searchParams.get('secret') || (req.headers && req.headers.get('x-api-secret'));
  const configuredSecret = process.env.API_SECRET || 'dev-secret-key';
  
  if (secret !== configuredSecret) {
    return new Response('Unauthorized: Invalid secret token', { status: 401 });
  }

  console.log("Background sync started!");
  const token = process.env.NOTION_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const resumeUrl = process.env.RESUME_URL || 'https://drive.google.com/file/d/1VK5y-OIx-8EKoSX0bx1INsAJrqr0qX_-/view';
  const githubUser = process.env.GITHUB_USER || 'axvrma';

  try {


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

    // Trigger Netlify Rebuild so the new Notion data gets pulled into the static site
    if (process.env.NETLIFY_BUILD_HOOK) {
      console.log("Triggering Netlify rebuild...");
      await fetch(process.env.NETLIFY_BUILD_HOOK, { method: 'POST' });
    }

  } catch (error) {
    console.error("Background sync failed:", error);
  }
};
