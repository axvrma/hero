# Photography and public assets

Put finished, approved photographs at the exact paths below. The repository currently uses original geometric hero artwork and omits empty photography regions.

- `public/images/portraits/abhishek-professional.webp` is the hero portrait. Supply 1200 × 1500 or larger at 4:5. Allow space around the face for a nearly square crop.
- `public/images/portraits/abhishek-casual.webp` appears with the personal growth section. Supply 1440 × 1080 at 4:3.
- `public/images/journey/dp-world-office.webp` appears in the DP World career chapter. Supply 1600 × 1000 at 8:5.
- `public/images/recognition/paytm-hackathon.webp` appears with the hackathon stories. Supply 1440 × 1080 at 4:3.
- `public/images/recognition/award-certificate.webp` appears in Recognition. Supply around 1440 × 1080 or use the redacted original document ratio.
- `public/images/workshop/workbench.webp` appears in the Lab. Supply 1440 × 1080 at 4:3.

Prepare the final image outside the repository. Confirm publication rights and consent for anyone pictured. Inspect office photographs for screens, customer information, badges and documents. Inspect certificates for signatures, QR codes, identifiers and personal details. Export a compressed WebP or AVIF and strip EXIF and location metadata. Add the approved file and update its manifest entry in `content/publication.mjs` with the actual path, pixel dimensions, alt text, caption, optional attribution and focal point. Set `publication: "approved"` and `rights: "cleared"` in the same review.

Layouts omit a registered image when its file is missing. The build rejects a file at a manifest path that lacks approval and rights clearance. Keep all unapproved files outside `public` and outside Git. Review the preview at wide and narrow sizes. Images outside the hero load lazily and can use a keyboard-accessible expansion dialog.

Product screenshots keep their existing paths under `public/images`. Retain existing captures, dimensions, responsive widths and art licensing. `public/favicon.svg` is the site icon. The 1200 × 630 `public/social.svg` is the editable social image source and `public/social.png` is the PNG used by social metadata.
