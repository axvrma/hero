

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

  try {
    // Trigger Netlify Rebuild so the new Notion data gets pulled into the static site
    if (process.env.NETLIFY_BUILD_HOOK) {
      console.log("Triggering Netlify rebuild...");
      await fetch(process.env.NETLIFY_BUILD_HOOK, { method: 'POST' });
    } else {
      console.log("No NETLIFY_BUILD_HOOK found in env variables.");
    }
    console.log("Background sync complete!");
  } catch (error) {
    console.error("Background sync failed:", error);
  }
};
