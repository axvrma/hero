# Security and integration audit

## Existing findings and implementation

The old functions used `API_SECRET || 'dev-secret-key'`; the rebuild endpoint also accepted a secret in the URL. Both now fail closed without a configured secret of at least 32 characters, allow POST only, refuse query parameters and compare supplied header secrets with timing-safe comparison. They do not return wildcard CORS. Browser Origin must match explicit ADMIN_ORIGIN; server requests without Origin still require the same secret. OPTIONS is intentionally unsupported because cross-origin browser administration is not supported.

Requests require application/json objects, bounded streaming payloads and strict field allowlists. Notion creation accepts only the five existing databases and their documented writable fields. Arbitrary nested links, operations, unexpected fields, invalid rich text and unsafe URL schemes are rejected. Notion credentials, raw upstream errors, page IDs and response bodies are not returned to callers. Calls have timeouts. The rebuild hook must be an HTTPS api.netlify.com/build_hooks URL without query credentials; redirects are rejected. No unused archive/delete/clear-database logic remains.

Server secrets are never saved in browser storage or bundles. The rebuild UI clears its password field after each request and reports acknowledgment rather than simulated progress. Do not paste the API secret into URLs, commit it, or distribute it to other visitors. This is a single-owner administrative mechanism, not a multi-user authorization system. Rate limiting is not implemented; use Netlify/platform controls if exposing administrative traffic beyond a trusted owner workflow.

HTML text and attributes are escaped. Rich legacy documentation goes through a build-time allowlist sanitizer. Script tags, embedded objects, events, images and unsafe href protocols are removed. Notion URL values must be explicit HTTPS without embedded credentials. JSON-LD escapes `<` to prevent script-element injection. A same-origin script CSP (without unsafe-inline), anti-framing, MIME sniffing, strict referrer, HSTS and permissions headers are configured in netlify.toml.

## Firebase preservation and required infrastructure action

`src/firebase.js` configures the existing project `portfolio-mvp-axvrma`. Its client API key identifies the project and is public configuration, not a database write credential. Firebase remains installed because there is insufficient evidence to delete the historical content-management workflow. Repository evidence shows that the existing public static site no longer reads Firestore, while the admin writes `portfolio/content`; actual use by the owner cannot be established from source alone.

The retained admin labels this accurately and never promises live-site updates. It uses textContent for identity display, form constraints and the `portfolio_admin` claim to control its UI. **The actual write security boundary is Firestore rules**, not the frontend claim check. The checked-in rules permit read/create/update only at `portfolio/content` to a verified signed-in custom admin claim, restrict the six legacy fields/types/lengths, and reject deletion and unrelated paths.

Those rules have not been applied to the remote project. Before enabling this workflow, review current data shape, merge any deliberate unrelated application rules carefully, deploy the supplied rules to the intended existing project, and provision the claim from a trusted Admin SDK environment. No remote Firebase state or account claims were changed. Rule behavior has not been exercised against a Firebase emulator or deployed project; test that boundary before using the historical editor.

## Deployment scope

No secrets were available in this checkout, no Notion record was mutated, and no Firebase/Netlify/GitHub deployment was performed. Unit tests exercise authorization, malformed data and mocked upstream success/failure. External account integration, rules enforcement and production hook configuration require a configured environment. Server functions are not emulated by the static preview server.
