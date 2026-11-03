# Notion content management

The existing database IDs and `2022-06-28` API mapping are preserved. No Notion schema or remote record was changed. Share these databases with the integration associated with `NOTION_API_KEY`:

| Dataset | Database ID | Existing properties |
| --- | --- | --- |
| Projects | `39b3888d-7765-8123-a7de-fff0ca4fdf3b` | Name (title), Description/Slug (rich_text), Tags (multi_select), Github URL (url), Order (number); optional Live URL (url) |
| Experience | `39b3888d-7765-8136-8887-d1e40594e620` | Company (title), Role/Duration/Details (rich_text), Order (number) |
| Skills | `39b3888d-7765-81ce-b5ea-df48c5d34555` | Category (title), Tags (multi_select), Order (number) |
| Education | `39b3888d-7765-8176-8bba-e7132440897d` | Degree (title), Institution/Duration (rich_text), Order (number) |
| Profile | `39b3888d-7765-81a5-a395-ea404ea6371d` | Name (title), Heading/Subtitle (rich_text), Link (url) |

All non-profile databases retain ascending `Order` sorting. If Notion reports an absent sort field, the reader retries without sorting. It follows every pagination cursor, rejects repeated cursors, bounds records and request timeouts, and reports errors without logging secrets or response bodies.

## Profile rows

`Hero Section` uses Heading/Subtitle. `Contact Section` optionally uses Heading. `About Section` optionally uses Subtitle. `Resume` uses Link. Optional `Identity` uses Heading for the name and Subtitle for the role; `Location` and `Email` use Subtitle; `GitHub` and `LinkedIn` use Link. These additional rows are supported without requiring existing database modifications. Existing `Footer Section`, `Marquee`, `Badge` and `Copyright` rows are preserved in normalized profileRows so no remote data is discarded; the obsolete animated presentation is retired.

The requested hero copy is in the committed fallback. A connected existing Hero Section takes precedence, so update that row in Notion to the new approved copy when connecting the CMS. Editable data is rendered as escaped plain text; purple HTML annotations are intentionally not trusted as markup.

## Projects

Keep Slug stable. `vox-ar` maps to Envision, and `azure-devops-pr-helper` maps to Prism. New names and their legacy aliases match the same registry product. Descriptions and tags can be edited in Notion; technical case-study sections and verified implementation notes live in the typed registry. Live URLs and historical source URLs for the five flagships are fixed as requested. The technical registry records source links and limitations rather than fabricated metrics. No automated script writes content back to Notion.

All sixteen old case-study bodies remain in `legacy-projects.json` and the original documents remain in `content/legacy/`. Four map to current flagships; twelve retain dedicated secondary routes. Atlas is the additional flagship. Secondary Notion records can update descriptions/tags/source/live links, retaining the archived body. A new Notion project without a body renders its description and real source links. `archive-overrides.json` suppresses a specifically verified dead legacy demo URL without changing the preserved original content. A different replacement URL supplied through Notion is allowed.

## Local and production behavior

No key: use `content/fallback.json` intentionally and print that choice. Key present: read all datasets and fail on integration errors. `NOTION_ALLOW_FALLBACK=true` explicitly allows the committed snapshot if the remote read fails. No automatic snapshot mutation occurs. Review and commit snapshot updates deliberately so a build never overwrites authored templates or creates nondeterministic Git diffs.

Environment variables are in `.env.example`. `SITE_URL`, `NOTION_API_KEY`, `NOTION_ALLOW_FALLBACK`, `API_SECRET`, `ADMIN_ORIGIN`, `NETLIFY_BUILD_HOOK` are server/build configuration; only site metadata reaches output. Local `.env` is ignored. Netlify provides URL/CONTEXT/DEPLOY_PRIME_URL. No VITE_ credential is supported.

After editing Notion, run the normal Netlify build or request it through `/sync.html` with an administrator secret. A successful request acknowledges the build hook, not the final deployment result. Follow build logs in Netlify.
