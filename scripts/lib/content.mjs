import sanitizeHtml from "sanitize-html";
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
