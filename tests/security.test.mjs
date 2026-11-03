import { test } from "node:test";
import assert from "node:assert/strict";
import {
  authorize,
  readPayload,
  validateProperties,
} from "../netlify/lib/security.mjs";
import { databases } from "../scripts/lib/content.mjs";
import update from "../netlify/functions/update-notion.js";
import sync from "../netlify/functions/sync-notion.js";
const secret = "a".repeat(48);
const request = (body = {}, extra = {}) =>
  new Request("https://example.com/api/update-notion", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-secret": secret },
    body: JSON.stringify(body),
    ...extra,
  });
test("authorization fails closed without server secret, refuses GET and query credentials", () => {
  assert.equal(authorize(request(), {}).status, 503);
  assert.equal(authorize(request(), { API_SECRET: "short" }).status, 503);
  assert.equal(
    authorize(new Request("https://example.com?secret=foo"), {
      API_SECRET: secret,
    }).status,
    405,
  );
  assert.equal(
    authorize(request({}, { headers: { "x-api-secret": "wrong" } }), {
      API_SECRET: secret,
    }).status,
    401,
  );
  assert.equal(
    authorize(
      new Request("https://example.com?secret=foo", { method: "POST" }),
      { API_SECRET: secret },
    ).status,
    400,
  );
  assert.equal(authorize(request(), { API_SECRET: secret }), null);
});
test("browser origins must match explicit origin and receive no wildcard CORS", () => {
  const req = request(
    {},
    { headers: { origin: "https://evil.example", "x-api-secret": secret } },
  );
  assert.equal(
    authorize(req, { API_SECRET: secret, ADMIN_ORIGIN: "https://example.com" })
      .status,
    403,
  );
  const ok = request(
    {},
    { headers: { origin: "https://example.com", "x-api-secret": secret } },
  );
  assert.equal(
    authorize(ok, { API_SECRET: secret, ADMIN_ORIGIN: "https://example.com" }),
    null,
  );
});
test("payload reads enforce content type, JSON object and byte limits", async () => {
  await assert.rejects(
    () =>
      readPayload(request({}, { headers: { "Content-Type": "text/plain" } })),
    (e) => e.status === 415,
  );
  await assert.rejects(
    () => readPayload(request({ data: "x".repeat(100) }), 10),
    (e) => e.status === 413,
  );
  await assert.rejects(
    () => readPayload(request([], {})),
    (e) => e.status === 400,
  );
  assert.deepEqual(await readPayload(request({ ok: true })), { ok: true });
});
test("property allowlist rejects arbitrary databases, fields, URLs and Notion operations", () => {
  const valid = {
    Name: { title: [{ text: { content: "A project" } }] },
    "Github URL": { url: "https://github.com/axvrma/atlas" },
  };
  assert.equal(validateProperties(databases.projects, valid), true);
  assert.equal(validateProperties("other", valid), false);
  assert.equal(
    validateProperties(databases.projects, { ...valid, archived: true }),
    false,
  );
  assert.equal(
    validateProperties(databases.projects, { ...valid, Name: { title: [] } }),
    false,
  );
  assert.equal(
    validateProperties(databases.projects, {
      ...valid,
      "Github URL": { url: "javascript:alert(1)" },
    }),
    false,
  );
  assert.equal(
    validateProperties(databases.projects, {
      ...valid,
      Name: {
        title: [
          { text: { content: "test", link: { url: "https://evil.example" } } },
        ],
      },
    }),
    false,
  );
});
test("both handlers reject requests before reaching an external service when unconfigured", async () => {
  const old = process.env.API_SECRET;
  delete process.env.API_SECRET;
  try {
    assert.equal((await update(request())).status, 503);
    assert.equal((await sync(request())).status, 503);
  } finally {
    if (old !== undefined) process.env.API_SECRET = old;
  }
});
test("authorized Notion write is schema-bounded, redacts upstream response and accepts only explicit creation", async () => {
  const old = {
    secret: process.env.API_SECRET,
    token: process.env.NOTION_API_KEY,
    fetch: globalThis.fetch,
  };
  process.env.API_SECRET = secret;
  process.env.NOTION_API_KEY = "server-token";
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body) });
    return Response.json({ id: "private", secret: "never return this" });
  };
  try {
    const res = await update(
      request({
        database_id: databases.projects,
        properties: { Name: { title: [{ text: { content: "Hello" } }] } },
      }),
    );
    assert.equal(res.status, 201);
    assert.deepEqual(await res.json(), { ok: true });
    assert.equal(calls.length, 1);
    const bad = await update(
      request({ database_id: "unknown", properties: {} }),
    );
    assert.equal(bad.status, 400);
    assert.equal(calls.length, 1);
  } finally {
    globalThis.fetch = old.fetch;
    for (const [key, val] of [
      ["API_SECRET", old.secret],
      ["NOTION_API_KEY", old.token],
    ])
      if (val === undefined) delete process.env[key];
      else process.env[key] = val;
  }
});
test("rebuild validates the hook and acknowledges actual hook success without mutating Notion", async () => {
  const previous = {
    secret: process.env.API_SECRET,
    hook: process.env.NETLIFY_BUILD_HOOK,
    fetch: globalThis.fetch,
  };
  process.env.API_SECRET = secret;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), method: options.method });
    return new Response("", { status: 200 });
  };
  try {
    process.env.NETLIFY_BUILD_HOOK = "https://evil.example/build_hooks/a";
    assert.equal((await sync(request())).status, 503);
    assert.equal(calls.length, 0);
    process.env.NETLIFY_BUILD_HOOK = "https://api.netlify.com/build_hooks/test";
    const res = await sync(request());
    assert.equal(res.status, 202);
    assert.deepEqual(calls, [
      { url: "https://api.netlify.com/build_hooks/test", method: "POST" },
    ]);
  } finally {
    globalThis.fetch = previous.fetch;
    for (const [key, val] of [
      ["API_SECRET", previous.secret],
      ["NETLIFY_BUILD_HOOK", previous.hook],
    ])
      if (val === undefined) delete process.env[key];
      else process.env[key] = val;
  }
});
