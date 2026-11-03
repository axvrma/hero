import "dotenv/config";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { databases, fetchDatabase, normalize } from "./lib/content.mjs";
const fallback = JSON.parse(
  await readFile(new URL("../content/fallback.json", import.meta.url), "utf8"),
);
let content = structuredClone(fallback);
if (process.env.NOTION_API_KEY) {
  try {
    const entries = await Promise.all(
      Object.entries(databases).map(async ([key, id]) => [
        key,
        normalize(
          key,
          await fetchDatabase(
            id,
            process.env.NOTION_API_KEY,
            fetch,
            key !== "profile",
          ),
        ),
      ]),
    );
    const remote = Object.fromEntries(entries);
    for (const key of ["projects", "experience", "skills", "education"])
      content[key] = remote[key];
    // Preserve legacy row mappings. Contact/profile rows are optional additions, not schema migrations.
    for (const row of remote.profile) {
      if (row.name === "Hero Section") {
        if (row.heading) content.profile.heading = row.heading;
        if (row.subtitle) content.profile.subtitle = row.subtitle;
      }
      if (row.name === "Contact Section" && row.heading)
        content.profile.contactHeading = row.heading;
      if (row.name === "Resume" && row.link) content.profile.resume = row.link;
      if (row.name === "About Section" && row.subtitle)
        content.profile.about = row.subtitle;
      if (row.name === "Identity") {
        if (row.heading) content.profile.name = row.heading;
        if (row.subtitle) content.profile.role = row.subtitle;
      }
      if (row.name === "Location" && row.subtitle)
        content.profile.location = row.subtitle;
      if (
        row.name === "Email" &&
        /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(row.subtitle)
      )
        content.profile.email = row.subtitle;
      if (row.name === "GitHub" && row.link) content.profile.github = row.link;
      if (row.name === "LinkedIn" && row.link)
        content.profile.linkedin = row.link;
    }
    content.profileRows = remote.profile;
    console.log("Content: read all five Notion databases (no writes).");
  } catch (error) {
    if (process.env.NOTION_ALLOW_FALLBACK !== "true")
      throw new Error(
        `Content build failed. ${error.message} Set NOTION_ALLOW_FALLBACK=true only to deliberately use the committed snapshot.`,
        { cause: error },
      );
    console.warn(
      `Content: Notion unavailable; using committed snapshot. ${error.message}`,
    );
  }
} else
  console.log(
    "Content: NOTION_API_KEY absent; using committed, previously generated Notion snapshot.",
  );
await mkdir(".generated", { recursive: true });
await writeFile(
  ".generated/content.json",
  JSON.stringify(content, null, 2) + "\n",
);
