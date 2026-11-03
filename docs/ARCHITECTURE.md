# Architecture

## Rendering

One pipeline: Notion read → normalized content JSON → reusable HTML renderer → Vite production assets → `dist/` → Netlify static hosting. Each route contains its complete content in the response. Navigation uses ordinary links, with no hydration, client router, or SPA catch-all.

The source `index.html` is a document template. Generation writes only `.generated/`; Vite reads `.generated/site` as its root and resolves `/src` to the actual browser source. A build plugin copies generated redirects, robots and sitemap into `dist/`. The exact-artifact preview server resolves directory indexes, responds with the actual 404 and applies checked-in security headers and generated redirects.

Page composition is in `src/components/site.mjs`; the ecosystem and five deliberately different product visuals are in `visuals.mjs`. Only `src/main.js` ships public interactions: theme preferences, mobile navigation, archive search and résumé printing. Native anchors and static content remain useful without JavaScript. The mobile navigation is a nonmodal disclosure: its expanded state is announced, focus moves to the first link, Escape restores trigger focus, and outside activation or a desktop breakpoint closes it.

## Data ownership

Notion owns profile/copy, professional experience, skills, education and project editorial descriptions. `content/products.mjs` owns the five canonical identities, fixed external URLs, intentional rank, technical case-study evidence and legacy mappings. Matching Notion descriptions and tags override those editorial fields when available; they cannot reorder or remove the five flagships. New Notion projects join the archive. Empty/invalid rows are skipped. Archived Notion rows are excluded from fetched CMS content, but existing legacy case studies are retained for backlinks.

A local no-key build uses the committed snapshot. A configured integration that fails makes the build fail by default; it never silently publishes a partial dataset. Notion reads are paginated and all content is read before committing one output. Generation order is stable and no timestamps/random values enter the static outputs.

## Integrations

The public experience has no Firebase import, analytics or remote font requests. The old Firestore record editor is preserved at `/admin.html` as a distinct historical workflow; it does not claim to publish the Notion-backed site. Its bundle is loaded only on that page. The previous frontend email allowlist has been replaced by a custom authorization claim and corresponding Firestore rules.

`update-notion.js` is a deliberately authenticated, schema-limited row creation endpoint. `sync-notion.js` requests a build and waits for the hook acknowledgment; the historical `/api/sync-notion-background` path is retained. Its filename no longer ends in `-background`, so Netlify can return authorization/configuration failures instead of acknowledging an asynchronous invocation prematurely. Neither endpoint is used during ordinary browsing or builds.

## Assets

Geist / Geist Mono are self-hosted WOFF2 with OFL notices. Atlas, Servio and Envision visuals are resized WebP versions of real screenshots from the adjacent product repositories, at 720/1440 widths. The Vibes image is original CC0 sample art from its website; its frame is labeled illustrative. Prism uses a labeled SVG branch-plan illustration. The hero is inline SVG/CSS with keyboard-accessible product links. Product captures reserve layout space and load lazily. No image generation or remote stock assets are used.

The retained Firebase admin bundle is larger than public code; Vite reports it above its generic 500 KB warning threshold. It is not preloaded, imported or transferred by public routes. Dependencies are locked; explicit transitive overrides bring grpc-js, glob and minimatch onto patched releases. Override changes require renewed audit/build/browser validation.
