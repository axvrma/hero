# Photography and public assets

The owner-supplied originals are staged under `.asset-inbox/axvrma-visual-assets/`. Git ignores that directory. `content/publication.mjs` records the approved derivative paths, intrinsic dimensions, responsive candidates, focal points, captions, alternative text, provenance and rights status.

## Supplied assets in the public build

- **Professional portrait** at `public/images/portraits/hero-portrait.webp` with 480px, 640px, 768px and 1080px widths. It appears in the hero and the social preview. The portrait was generated with AI using the owner’s reference photographs. Both placements say “AI-assisted portrait.”
- **Casual portrait** at `public/images/portraits/portrait-casual.webp` with 480px and 768px widths. The owner’s photograph appears in Story.
- **San Francisco portrait** at `public/images/portraits/portrait-san-francisco.webp`. The 420 × 420 original appears in a compact homepage tile and in Story.
- **Google Assistant recognition** at `public/images/recognition/google-assistant-2018.webp` with 480px, 768px and 1320px widths. The owner’s photograph appears in the homepage milestones, Story and Experience. The caption identifies developer recognition in 2018.
- **Workshop laptop** at `public/images/workshop/homelab.webp` with 480px, 768px and 1080px widths. The owner’s photograph appears in the homepage milestones and on Lab. The paired ecosystem illustration is conceptual.

## Supplied assets awaiting publication clearance

- **DP World 2023 Kudos Award** is registered as `public/images/recognition/dp-world-kudos-2023.webp`, with planned 640px, 960px and 1320px widths. Obtain consent for the participants and verify employer policy. The homepage currently shows a typographic milestone, and Experience retains the award citation. Once cleared, the photo appears in the milestones, Story and Experience. The homepage image uses containment so both participants and the award presentation stay visible.
- **IIT Guwahati certificate** is registered as `public/images/recognition/iit-guwahati-ai-ml-2026-redacted.webp`, with planned 480px, 800px and 1684px widths. Visual review at 1684 × 1191 confirmed that the certificate identifier and signatures are obscured. Issue information, typed names and the qualification details remain legible. The derivative is a flattened WebP. The factual claim is verified, and image publication has its own approval. Once cleared, the rendered thumbnail will preserve the full document, and the keyboard-accessible viewer will link to the full-resolution redacted image.

The DP World office and Paytm event photographs remain optional pending entries. Existing hackathon product screenshots remain in use. See [owner review](CONTENT-REVIEW.md) for release conditions.

## Prepare and approve derivatives

Export at original resolution or smaller, preserve aspect ratio, and strip EXIF, XMP and location data. The full certificate derivative preserves the supplied document pixels. Use explicit intrinsic dimensions and validate each responsive candidate. The build rejects pending files or variants, orphaned variants, and unregistered files in the four editorial image directories. Certificates also require the recorded visual redaction review and a redacted filename. Add the optimised files and mark approval and rights clearance in the manifest together.

Product imagery uses the existing screenshots and concept art. Keep the archive’s image licensing and the distinction between screenshot and illustration. `public/social.svg` references the local portrait and is the editable source for the 1200 × 630 `public/social.png` used in social metadata.

## Organisation names

The homepage marquee uses locally rendered typography for DP World, Airtel Africa, IIT Guwahati, Google Assistant, Microsoft GitTogether, Paytm and Emeritus. Relationship labels come from the employment, recognition, hackathon and qualification records. No official logo files were added. Any future official logo needs a documented source and usage permission before it replaces a name.
