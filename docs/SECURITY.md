# Security

## Static application

The portfolio has no backend, privileged write endpoint, login screen, external CMS adapter or runtime database connection. All content is reviewed in version-controlled local files and published through the normal Netlify deployment workflow.

## Content boundaries

HTML text and attributes are escaped. Preserved legacy documentation is processed by a build-time allowlist sanitizer that removes executable scripts, embedded objects, event handlers, unsafe URL protocols and local-development links. HTTPS source URLs cannot contain embedded credentials. JSON-LD escapes `<` to prevent script-element injection.

## Browser and deployment policy

Netlify headers enforce same-origin script/style/font/image/connect policies, disallow frames and plugins, prevent framing, disable unused camera/microphone/geolocation permissions, prevent MIME sniffing, and set strict referrer and HTTPS policies. Public pages make no analytics, Firebase, CMS or remote font requests.

There are no required secrets. `.env.example` documents only optional SITE_URL metadata configuration. Local environment files remain ignored. Netlify deployment credentials belong to the hosting platform rather than browser code. Missing paths, including retired administrative/API paths, return the static 404 rather than an SPA success page.

## Verification scope

Content tests check escaping, sanitized HTML and URL validation. Production output checks verify every route, local link, asset reference, fragment target and redirect. Browser tests cover accessibility, interactions, responsive layout and static delivery. Deployment-domain routing, production headers and external product availability still require verification on the actual host after an authorized deployment.

## Editorial publication and local demos

Business metrics stay external to Git until approved for public disclosure. The generator accepts only approved and verified metrics with complete scopes, attribution and evidence references. Pending entries carry identifiers and case associations. The photography manifest checks originals and responsive variants, rejects unregistered editorial files and enforces a visual redaction record for certificate derivatives. It requires approval and rights clearance before a derivative can enter the public build. Public assets can be requested by URL, so sensitive source imagery and unused proofs belong outside `public`.

The arithmetic demo interprets a bounded number of tokens with an explicit operator grammar. Life Calculator and fictional workflow demos neither transmit nor persist inputs. The form demonstration constructs elements with browser APIs and treats configuration labels as text. Optional photo expansion performs a local navigation or opens a native dialog using the same approved image URL.

The existing Netlify headers apply without inline scripts, styles, third-party frames or additional permissions. Production-artifact browser tests check the policy and browser errors. Product demos open as external links.
