import sanitizeHtml from "sanitize-html";
export const databases = Object.freeze({
  projects: "39b3888d-7765-8123-a7de-fff0ca4fdf3b",
  experience: "39b3888d-7765-8136-8887-d1e40594e620",
  skills: "39b3888d-7765-81ce-b5ea-df48c5d34555",
  education: "39b3888d-7765-8176-8bba-e7132440897d",
  profile: "39b3888d-7765-81a5-a395-ea404ea6371d",
});
export const text = (value) =>
  Array.isArray(value)
    ? value
        .map((t) => t.plain_text ?? t.text?.content ?? "")
        .join("")
        .slice(0, 20000)
    : "";
export const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export function safeUrl(value, protocols = ["https:"]) {
  if (typeof value !== "string") return "";
  try {
    const u = new URL(value);
    return protocols.includes(u.protocol) && !u.username && !u.password
      ? u.href
      : "";
  } catch {
    return "";
  }
}
export function slug(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}
export function cleanLegacy(value) {
  return sanitizeHtml(value, {
    allowedTags: [
      "h2",
      "h3",
      "h4",
      "p",
      "ul",
      "ol",
      "li",
      "strong",
      "em",
      "code",
      "pre",
      "a",
      "blockquote",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "br",
      "hr",
    ],
    allowedAttributes: { a: ["href", "title"] },
    allowedSchemes: ["https", "mailto"],
    transformTags: { h1: "h2" },
    exclusiveFilter: (frame) =>
      frame.tag === "a" &&
      /localhost|127\.0\.0\.1/.test(frame.attribs.href ?? ""),
  });
}
const field = (p, name, type = "rich_text") => text(p?.[name]?.[type]);
export function normalize(database, pages) {
  return pages
    .filter((page) => !page.archived && !page.in_trash)
    .map((page) => {
      const p = page.properties ?? {};
      if (database === "experience")
        return {
          company: field(p, "Company", "title"),
          role: field(p, "Role"),
          duration: field(p, "Duration"),
          details: field(p, "Details")
            .split("\n")
            .map((s) => s.replace(/^\d+\.\s*/, "").trim())
            .filter(Boolean),
        };
      if (database === "skills")
        return {
          category: field(p, "Category", "title"),
          tags: (p.Tags?.multi_select ?? []).map((t) =>
            String(t.name).slice(0, 100),
          ),
        };
      if (database === "education")
        return {
          degree: field(p, "Degree", "title"),
          institution: field(p, "Institution"),
          duration: field(p, "Duration"),
        };
      if (database === "profile")
        return {
          name: field(p, "Name", "title"),
          heading: field(p, "Heading"),
          subtitle: field(p, "Subtitle"),
          link: safeUrl(p.Link?.url),
        };
      return {
        id: slug(field(p, "Slug") || field(p, "Name", "title")),
        name: field(p, "Name", "title"),
        description: field(p, "Description"),
        stack: (p.Tags?.multi_select ?? []).map((t) =>
          String(t.name).slice(0, 100),
        ),
        source: safeUrl(p["Github URL"]?.url),
        live: safeUrl(p["Live URL"]?.url),
      };
    })
    .filter((item) =>
      database === "projects"
        ? item.id && item.name
        : database === "experience"
          ? item.company
          : database === "skills"
            ? item.category
            : database === "education"
              ? item.institution
              : item.name,
    );
}
export async function fetchDatabase(id, token, fetcher = fetch, sort = true) {
  const records = [];
  let cursor;
  const seen = new Set();
  do {
    const response = await fetcher(
      `https://api.notion.com/v1/databases/${id}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page_size: 100,
          ...(sort
            ? { sorts: [{ property: "Order", direction: "ascending" }] }
            : {}),
          ...(cursor ? { start_cursor: cursor } : {}),
        }),
        signal: AbortSignal.timeout(15000),
      },
    );
    if (!response.ok) {
      if (response.status === 400 && sort)
        return fetchDatabase(id, token, fetcher, false);
      throw new Error(
        `Notion database ${id}: HTTP ${response.status}. Check integration access and database mappings.`,
      );
    }
    const data = await response.json();
    if (!Array.isArray(data.results))
      throw new Error(`Notion database ${id}: invalid response.`);
    records.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
    if (cursor && seen.has(cursor))
      throw new Error("Notion pagination repeated a cursor.");
    if (cursor) seen.add(cursor);
    if (records.length > 10000)
      throw new Error(
        "Notion database exceeded the 10,000-record build limit.",
      );
  } while (cursor);
  return records;
}
export function resolveOrigin(env = process.env) {
  const candidate =
    env.CONTEXT && env.CONTEXT !== "production"
      ? env.DEPLOY_PRIME_URL
      : env.SITE_URL || env.URL;
  if (!candidate) return "";
  const url = safeUrl(candidate, ["https:", "http:"]);
  if (!url)
    throw new Error(
      "SITE_URL / deployment URL must be an absolute HTTP(S) origin without credentials.",
    );
  const u = new URL(url);
  if (u.pathname !== "/" || u.search || u.hash)
    throw new Error(
      "SITE_URL must contain an origin only, without a path, query or hash.",
    );
  return u.origin;
}
