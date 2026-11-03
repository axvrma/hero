import { timingSafeEqual } from "node:crypto";
import { databases, safeUrl } from "../../scripts/lib/content.mjs";
export function json(status, body, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...extra,
    },
  });
}
export function authorize(req, env = process.env) {
  if (req.method !== "POST")
    return json(405, { error: "Use POST." }, { Allow: "POST" });
  if (new URL(req.url).search)
    return json(400, { error: "Query parameters are not accepted." });
  if (!env.API_SECRET || env.API_SECRET.length < 32)
    return json(503, { error: "Administrative API is not configured." });
  const origin = req.headers.get("origin");
  const allowed = env.ADMIN_ORIGIN && safeUrl(env.ADMIN_ORIGIN);
  if (origin && (!allowed || new URL(allowed).origin !== origin))
    return json(403, { error: "Origin not allowed." });
  const supplied = req.headers.get("x-api-secret") || "";
  const a = Buffer.from(supplied);
  const b = Buffer.from(env.API_SECRET);
  if (a.length !== b.length || !timingSafeEqual(a, b))
    return json(401, { error: "Unauthorized." });
  return null;
}
export async function readPayload(req, maxBytes = 32768) {
  if (
    !req.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    throw Object.assign(Error("Use application/json."), { status: 415 });
  if (Number(req.headers.get("content-length")) > maxBytes)
    throw Object.assign(Error("Payload too large."), { status: 413 });
  const reader = req.body?.getReader();
  let size = 0;
  const chunks = [];
  if (!reader)
    throw Object.assign(Error("JSON body required."), { status: 400 });
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw Object.assign(Error("Payload too large."), { status: 413 });
    }
    chunks.push(value);
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!value || Array.isArray(value) || typeof value !== "object")
      throw Error();
    return value;
  } catch {
    throw Object.assign(Error("Invalid JSON object."), { status: 400 });
  }
}
const schemas = {
  [databases.projects]: {
    Name: "title",
    Description: "rich_text",
    Slug: "rich_text",
    Tags: "multi_select",
    "Github URL": "url",
    "Live URL": "url",
    Order: "number",
  },
  [databases.experience]: {
    Company: "title",
    Role: "rich_text",
    Duration: "rich_text",
    Details: "rich_text",
    Order: "number",
  },
  [databases.skills]: {
    Category: "title",
    Tags: "multi_select",
    Order: "number",
  },
  [databases.education]: {
    Degree: "title",
    Institution: "rich_text",
    Duration: "rich_text",
    Order: "number",
  },
  [databases.profile]: {
    Name: "title",
    Heading: "rich_text",
    Subtitle: "rich_text",
    Link: "url",
  },
};
export function validateProperties(database, properties) {
  const schema = Object.hasOwn(schemas, database) ? schemas[database] : null;
  if (
    !schema ||
    !properties ||
    typeof properties !== "object" ||
    Array.isArray(properties) ||
    !Object.keys(properties).length
  )
    return false;
  const required = Object.entries(schema).find(([, v]) => v === "title")[0];
  if (!properties[required]) return false;
  return Object.entries(properties).every(([key, value]) => {
    const type = Object.hasOwn(schema, key) ? schema[key] : null;
    if (
      !type ||
      !value ||
      typeof value !== "object" ||
      Array.isArray(value) ||
      Object.keys(value).length !== 1 ||
      !Object.hasOwn(value, type)
    )
      return false;
    const data = value[type];
    if (type === "url") return data === null || Boolean(safeUrl(data));
    if (type === "number")
      return data === null || (Number.isFinite(data) && Math.abs(data) < 1e6);
    if (type === "multi_select")
      return (
        Array.isArray(data) &&
        data.length <= 30 &&
        data.every(
          (t) =>
            t &&
            Object.keys(t).every((k) => k === "name") &&
            typeof t.name === "string" &&
            t.name.trim().length > 0 &&
            t.name.length <= 100,
        )
      );
    return (
      Array.isArray(data) &&
      data.length <= 30 &&
      (type !== "title" || data.length > 0) &&
      data.every(
        (t) =>
          t &&
          Object.keys(t).every((k) => k === "type" || k === "text") &&
          (!t.type || t.type === "text") &&
          t.text &&
          Object.keys(t.text).every((k) => k === "content") &&
          typeof t.text.content === "string" &&
          t.text.content.length <= 2000 &&
          (type !== "title" || t.text.content.trim().length > 0),
      )
    );
  });
}
