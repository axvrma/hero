# Legacy route migration

The build emits exact forced 301 rules in `dist/_redirects`. Each old project retains its own relevant canonical page; no project is sent to the homepage. Netlify serves generated directory indexes for canonical clean routes, without an SPA fallback.

| Old URL | Canonical URL |
| --- | --- |
| `/projects.html` | `/work` |
| `/projects` | `/work` |
| `/resume.html` | `/resume` |
| `/index.html` | `/` |
| `/project-azure-devops-pr-helper.html` | `/work/prism` |
| `/project-azure-devops-pr-helper` | `/work/prism` |
| `/project-claude-code-predictor.html` | `/work/claude-code-predictor` |
| `/project-claude-code-predictor` | `/work/claude-code-predictor` |
| `/project-design-spec-generator.html` | `/work/design-spec-generator` |
| `/project-design-spec-generator` | `/work/design-spec-generator` |
| `/project-environment-sync.html` | `/work/environment-sync` |
| `/project-environment-sync` | `/work/environment-sync` |
| `/project-figma-compliance-checker.html` | `/work/figma-compliance-checker` |
| `/project-figma-compliance-checker` | `/work/figma-compliance-checker` |
| `/project-figma-design-checker.html` | `/work/figma-design-checker` |
| `/project-figma-design-checker` | `/work/figma-design-checker` |
| `/project-formflow-ai-assistant.html` | `/work/formflow-ai-assistant` |
| `/project-formflow-ai-assistant` | `/work/formflow-ai-assistant` |
| `/project-lighthouse-agent.html` | `/work/auditbench` |
| `/project-lighthouse-agent` | `/work/auditbench` |
| `/project-luminescent.html` | `/work/luminescent` |
| `/project-luminescent` | `/work/luminescent` |
| `/project-paytm-hackathon.html` | `/work/paytm-hackathon` |
| `/project-paytm-hackathon` | `/work/paytm-hackathon` |
| `/project-pop-pay.html` | `/work/pop-pay` |
| `/project-pop-pay` | `/work/pop-pay` |
| `/project-reels.html` | `/work/reels` |
| `/project-reels` | `/work/reels` |
| `/project-servio.html` | `/work/servio` |
| `/project-servio` | `/work/servio` |
| `/project-vibes.html` | `/work/vibes` |
| `/project-vibes` | `/work/vibes` |
| `/project-vox-ar.html` | `/work/envision` |
| `/project-vox-ar` | `/work/envision` |
| `/project-web-xr.html` | `/work/web-xr` |
| `/project-web-xr` | `/work/web-xr` |

`/resume.html` redirects to the printable `/resume`; résumé CTAs retain the original document URL. Retired admin, sync and API paths have no handlers or redirects and return the ordinary 404.

Clean legacy paths `/work/vox-ar`, `/work/azure-devops-pr-helper`, and `/work/lighthouse-agent` also redirect to Envision, Prism, and Auditbench respectively.

## Beyond the Code pages

The 24 existing public routes stay canonical. The generator adds `/story`, `/lab`, and these six experience case studies.

- `/experience/intelligent-invoice-processing`
- `/experience/dynamic-shipment-workflows`
- `/experience/micro-frontend-communication`
- `/experience/configuration-driven-ui`
- `/experience/bridging-design-and-engineering`
- `/experience/life-calculator`

`/experience#work` is the professional case index. `/work` remains the independent product and project index, `/work#archive` opens the secondary archive, and `/#hackathons` remains linkable. `/about`, `/engineering`, `/resume`, and `/contact` remain distinct public destinations. The sitemap has 32 entries for a production build, plus the 404 document served outside the sitemap. All 39 exact legacy redirects remain in place.
