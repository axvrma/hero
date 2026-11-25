# Design system

AXVRMA uses warm paper, charcoal and vermilion. Light mode uses deep terracotta with warm stone dividers. Dark mode uses coral and muted charcoal surfaces. Geist and Geist Mono remain self-hosted. Product colors stay within the product presentations.

## Type and layout

Geist carries headlines and body copy. Geist Mono labels technical diagrams, editorial section headings and image credits. The portrait and the headline share the hero on desktop. The mobile reading order starts with name, role, tenure, headline and actions, then presents the portrait. The image keeps the face and shoulders in view, with an accessible AI-assisted caption.

The shell caps content with `--content-width` and uses responsive `--space` gutters. `--section` sets the default vertical rhythm and `--gap` aligns columns. Photography and case-study panels use small corner radii and restrained dividers. The five milestone tiles use a 12-column desktop grid, two columns on mid-size screens, and full-width recognition and education features at phone widths. The smaller San Francisco and Workshop images pair beneath them. Product features alternate image and text on wider screens and lead with the screenshot on phones.

Main navigation switches at 900px. The home hero and product features stack at 760px. Milestone and Workshop layouts change at 720px. Most shared editorial layouts stack at 680px. Keep the navigation CSS and browser breakpoint in sync.

## Artwork

The orbit remains the AXVRMA wordmark motif and the fallback hero art. The enterprise previews use high-level process diagrams. The three engineering principles use original diagrams for cause tracing, simplification and execution. Story uses small illustrations of its interactive chapters. The Workshop pairs real laptop photography with a conceptual map of six activity areas. Product features use labelled product captures and existing labelled concept art.

## Motion and controls

The marquee uses a slow CSS transform with two equal-length groups, edge masks and a visible pause or resume button. Hover or keyboard focus inside the lane pauses movement. The semantic list appears once, and the duplicate group is inert and hidden from assistive technology. The reduced-motion and no-JavaScript versions show the same names and relationships in a horizontal scrolling list. The remaining motion is limited to short hover transitions and small editorial entrances.

Expandable photos start as anchor links to the original public derivative. The dialog focuses its close control, supports Escape, and restores focus to the trigger. The printable résumé uses high-contrast text and groups jobs and qualifications where space allows.
