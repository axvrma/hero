import { authorize, json, readPayload } from "../lib/security.mjs";
export default async function handler(req) {
  const denied = authorize(req);
  if (denied) return denied;
  try {
    const payload = await readPayload(req, 1024);
    if (Object.keys(payload).length)
      return json(400, { error: "Send an empty JSON object." });
    const hook = process.env.NETLIFY_BUILD_HOOK;
    let url;
    try {
      url = new URL(hook);
    } catch {
      return json(503, { error: "Build integration is not configured." });
    }
    if (
      url.origin !== "https://api.netlify.com" ||
      !/^\/build_hooks\/[a-zA-Z0-9_-]+$/.test(url.pathname) ||
      url.search ||
      url.hash ||
      url.username ||
      url.password
    )
      return json(503, { error: "Build integration is not configured." });
    const response = await fetch(url, {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok)
      return json(502, {
        error: "The build service did not accept the request.",
      });
    return json(202, {
      ok: true,
      message: "Build requested. Check Netlify for build progress.",
    });
  } catch (error) {
    return json(error.status || 502, {
      error: error.status ? error.message : "Build service unavailable.",
    });
  }
}
// Synchronous 202 acknowledgement: callers can see whether the hook accepted the request.
export const config = { path: "/api/sync-notion-background" };
