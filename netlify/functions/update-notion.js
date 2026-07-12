export default async (req, context) => {
  // CORS headers for preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('OK', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-secret',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Basic authorization check
  const apiSecret = req.headers.get('x-api-secret');
  const configuredSecret = process.env.API_SECRET || 'dev-secret-key';
  
  if (apiSecret !== configuredSecret) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const { database_id, properties } = body;

    if (!database_id || !properties) {
      return new Response('Missing database_id or properties', { status: 400 });
    }

    // In production, NOTION_API_KEY should be set in Netlify Environment Variables.
    const notionToken = process.env.NOTION_API_KEY;

    // Call Notion API to add a new page (row) to the database
    const notionRes = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parent: { database_id },
        properties
      })
    });

    const data = await notionRes.json();
    
    if (notionRes.ok) {
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } else {
      return new Response(JSON.stringify({ error: data }), {
        status: notionRes.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

export const config = {
  path: "/api/update-notion"
};
