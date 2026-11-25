# Route migration

Home (`/`), Work (`/work`) and About (`/about`) are the three canonical pages in the production sitemap. The résumé prints from `/about#resume`. Unknown addresses serve the 404 document with an HTTP 404 status. The build also provides robots.txt and sitemap.xml.

The migration covers the 32 previous canonical addresses and all 39 existing alias addresses. Three canonicals remain unchanged. The other 29, the 39 aliases, and four Work and About filename variants map directly to a canonical page or section using a permanent 301. The generated rules ship as `dist/_redirects`. The production artifact check validates every target and fragment, and Playwright checks the HTTP status and Location of every rule.

Netlify currently redirects the production addresses `/work` and `/about` to trailing-slash directory URLs. The redesign emits `work.html` and `about.html` as flat files so Netlify can serve the requested slashless canonical addresses directly. The local artifact server verifies a 200 at both destinations and normalizes trailing-slash variants. [Netlify’s flat-file and trailing-slash guidance](https://answers.netlify.com/t/support-guide-how-can-i-alter-trailing-slash-behaviour-in-my-urls-will-enabling-pretty-urls-help/31191)

## Former primary pages and common aliases

- `/projects.html` → `/work`
- `/projects` → `/work`
- `/index.html` → `/`
- `/work/index.html`, `/work.html` → `/work`
- `/about/index.html`, `/about.html` → `/about`
- `/experience` → `/#journey`
- `/engineering` → `/#principles`
- `/contact` → `/#contact`
- `/resume` → `/about#resume`
- `/resume.html` → `/about#resume`
- `/story` → `/about#story`
- `/lab` → `/about#workshop`

## Enterprise cases

- `/experience/intelligent-invoice-processing` → `/work#intelligent-invoice-processing`
- `/experience/dynamic-shipment-workflows` → `/work#dynamic-shipment-workflows`
- `/experience/micro-frontend-communication` → `/work#micro-frontend-communication`
- `/experience/configuration-driven-ui` → `/work#configuration-driven-ui`
- `/experience/bridging-design-and-engineering` → `/work#bridging-design-and-engineering`
- `/experience/life-calculator` → `/work#life-calculator`

## Products, archive and legacy names

- `/work/atlas` → `/work#atlas`
- `/work/vibes`, `/project-vibes.html`, `/project-vibes` → `/work#vibes`
- `/work/envision`, `/work/vox-ar`, `/project-vox-ar.html`, `/project-vox-ar` → `/work#envision`
- `/work/servio`, `/project-servio.html`, `/project-servio` → `/work#servio`
- `/work/prism`, `/work/azure-devops-pr-helper`, `/project-azure-devops-pr-helper.html`, `/project-azure-devops-pr-helper` → `/work#prism`
- `/work/luminescent`, `/project-luminescent.html`, `/project-luminescent` → `/work#luminescent`
- `/work/auditbench`, `/work/lighthouse-agent`, `/project-lighthouse-agent.html`, `/project-lighthouse-agent` → `/work#auditbench`
- `/work/claude-code-predictor`, `/project-claude-code-predictor.html`, `/project-claude-code-predictor` → `/work#claude-code-predictor`
- `/work/design-spec-generator`, `/project-design-spec-generator.html`, `/project-design-spec-generator` → `/work#design-spec-generator`
- `/work/environment-sync`, `/project-environment-sync.html`, `/project-environment-sync` → `/work#environment-sync`
- `/work/figma-compliance-checker`, `/project-figma-compliance-checker.html`, `/project-figma-compliance-checker` → `/work#figma-compliance-checker`
- `/work/figma-design-checker`, `/project-figma-design-checker.html`, `/project-figma-design-checker` → `/work#figma-design-checker`
- `/work/formflow-ai-assistant`, `/project-formflow-ai-assistant.html`, `/project-formflow-ai-assistant` → `/work#formflow-ai-assistant`
- `/work/paytm-hackathon`, `/project-paytm-hackathon.html`, `/project-paytm-hackathon` → `/work#paytm-hackathon`
- `/work/pop-pay`, `/project-pop-pay.html`, `/project-pop-pay` → `/work#pop-pay`
- `/work/reels`, `/project-reels.html`, `/project-reels` → `/work#reels`
- `/work/web-xr`, `/project-web-xr.html`, `/project-web-xr` → `/work#web-xr`

Project fragment links focus the relevant entry and open its first technical disclosure when JavaScript is enabled. The visible case summary and native disclosure are present in the document. Existing Home fragment names including `#journey`, `#impact`, `#work`, `#products`, `#engineering`, `#achievements`, `#hackathons` and `#contact` still resolve. A fragment on an old page address is client-side, so the redirect uses the best destination for that page. The public Netlify CDN's redirect behavior awaits an authorized deployment.
