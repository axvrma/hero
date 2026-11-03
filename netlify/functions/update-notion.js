import {
  authorize,
  json,
  readPayload,
  validateProperties,
} from "../lib/security.mjs";
export default async function handler(req) {
  const denied = authorize(req);
  if (denied) return denied;
  if (!process.env.NOTION_API_KEY)
    return json(503, { error: "Content integration is not configured." });
  try {
    const body = await readPayload(req);
    if (
      Object.keys(body).some(
        (k) => !["database_id", "properties"].includes(k),
      ) ||
      !validateProperties(body.database_id, body.properties)
    )
      return json(400, { error: "Invalid database or property schema." });
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: body.database_id },
        properties: body.properties,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok)
      return json(502, {
        error:
          "Notion rejected the request. Check server configuration and database access.",
      });
    return json(201, { ok: true });
  } catch (error) {
    return json(error.status || 502, {
      error: error.status ? error.message : "Content service unavailable.",
    });
  }
}
export const config = { path: "/api/update-notion" };
