# Photography and brand assets

The owner-supplied originals are in the Git-ignored `.asset-inbox/` directory. `content/publication.mjs` records the approved derivative paths, intrinsic sizes, responsive candidates, provenance and rights status. The build admits each original and its variants independently of other assets and rejects unregistered files in the reserved image directories.

## Released images

- **Professional portrait** at `public/images/portraits/hero-portrait.webp` with 480px, 640px, 768px and 1080px widths. The hero and social preview disclose that the portrait is AI-assisted.
- **Casual and San Francisco portraits** in `public/images/portraits/`. The 420px San Francisco original appears in a compact homepage tile and in Story. The casual portrait uses 480px and 768px widths on Story.
- **Google Assistant recognition** at `public/images/recognition/google-assistant-2018.webp` with 480px, 768px and 1320px widths. The caption identifies developer recognition in 2018.
- **IIT Guwahati certificate** at `public/images/recognition/iit-guwahati-ai-ml-2026-redacted.webp` with 480px and 800px previews and the exact supplied 1684 × 1191 redacted WebP for expansion. The owner explicitly approved portfolio use. Visual review confirmed the certificate identifier and handwritten signatures remain obscured. The full document fits in the credential tile, education section and Story, with a keyboard-accessible full-resolution viewer.
- **Workshop laptop** at `public/images/workshop/homelab.webp` with 480px, 768px and 1080px widths. It appears in the milestones and Workshop beside a conceptual ecosystem illustration.

## Supplied photographs awaiting third-party clearance

The owner approved portfolio use of `dp-world-kudos-2023.webp`. The photo remains staged pending consent from the other identifiable participant and DP World’s publication clearance. The release build uses the typographic 2023 milestone. Once cleared, the photo appears in the milestones, Story, and Experience’s career and recognition sections. Its 640px, 960px and 1320px versions preserve both participants, the award and the branding. The 2026 recognition has its own entry.

The optional DP World office and Paytm event photographs have yet to be supplied. Existing product screenshots cover the hackathon results. See [owner review](CONTENT-REVIEW.md).

## Supplied employer logos

All four originals were supplied for intended portfolio use in `.asset-inbox/axvrma-brand-assets/`. Optimised WebP derivatives in the ignored `prepared/` subdirectory trim excess padding and preserve the source colors and proportions. IRIS retains its original neutral background. Logo slots use containment and a neutral backplate in both themes. Each entry has a text fallback, which is the current public treatment.

- **DP World** · `dp-world.png` (960 × 713) → `dp-world.webp` (187 × 116, 9,496 bytes). Obtain approval covering portfolio use from the brand rights holder. [DP World terms](https://www.dpworld.com/en/terms-conditions) · [Dubai Trade guidance for customer and affiliate logo use](https://www.dubaitrade.ae/en/news-announcements/show-tags/ip)
- **Airtel Africa** · `airtel-africa.webp` (960 × 966) → 115 × 116, 6,036 bytes. Airtel Africa’s terms reserve rights in site artwork and describe permission for republication. [Airtel Africa terms](https://www.airtel.africa/terms-use)
- **IRIS Worldwide** · `iris.png` (254 × 120) → `iris.webp` (91 × 84, 2,514 bytes). IRIS’s terms reserve rights in its site logo artwork and describe written permission for republication. [IRIS terms](https://www.iris-worldwide.com/terms-of-use/)
- **Nurtr** · `nurtr.webp` (597 × 201) → 240 × 42, 8,794 bytes. Nurtr’s terms reserve rights in its site logo artwork and describe written consent for reuse. [Nurtr terms](https://www.nurtr.com/terms-of-service)

Move only cleared derivatives into the matching `public/images/brands/` paths and update each asset’s approval and rights status together. The owner’s instruction is recorded separately from rights clearance. Local verification used the supplied derivatives in an isolated loopback build. The public artifact carries no remote logo requests.

Product imagery keeps its existing screenshots, concept art and licensing. `public/social.svg` is the editable source for the local PNG used by social metadata.
