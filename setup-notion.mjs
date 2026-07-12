

const TOKEN = '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';
const PAGE_ID = '39b3888d-7765-80f3-9483-c56e9790ed8c';
const HEADERS = {
  'Authorization': `Bearer ${TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
};

async function createDb(title, properties) {
  const res = await fetch('https://api.notion.com/v1/databases', {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      parent: { type: 'page_id', page_id: PAGE_ID },
      title: [{ type: 'text', text: { content: title } }],
      properties: properties
    })
  });
  const data = await res.json();
  if (data.object === 'error') {
    console.error(`Error creating ${title}:`, data.message);
  } else {
    console.log(`Created ${title} DB: ${data.id}`);
  }
  return data;
}

async function run() {
  await createDb('Projects', {
    'Name': { title: {} },
    'Description': { rich_text: {} },
    'Tags': { multi_select: {} },
    'Github URL': { url: {} },
    'Live URL': { url: {} },
    'Slug': { rich_text: {} },
    'Order': { number: { format: "number" } }
  });

  await createDb('Experience', {
    'Company': { title: {} },
    'Role': { rich_text: {} },
    'Duration': { rich_text: {} },
    'Details': { rich_text: {} },
    'Order': { number: { format: "number" } }
  });

  await createDb('Skills', {
    'Category': { title: {} },
    'Tags': { multi_select: {} },
    'Order': { number: { format: "number" } }
  });

  await createDb('Education', {
    'Degree': { title: {} },
    'Institution': { rich_text: {} },
    'Duration': { rich_text: {} },
    'Order': { number: { format: "number" } }
  });
}

run();
