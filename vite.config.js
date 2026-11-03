import { defineConfig } from "vite";
import { resolve } from "node:path";
import { readdirSync, copyFileSync } from "node:fs";
const root = resolve(".generated/site");
function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? htmlFiles(resolve(dir, entry.name))
      : entry.name.endsWith(".html")
        ? [resolve(dir, entry.name)]
        : [],
  );
}
export default defineConfig({
  root,
  publicDir: resolve("public"),
  resolve: { alias: { "/src": resolve("src") } },
  server: { fs: { allow: [resolve(".")] }, port: 5173 },
  preview: { port: 4173 },
  build: {
    outDir: resolve("dist"),
    emptyOutDir: true,
    rolldownOptions: { input: htmlFiles(root) },
  },
  plugins: [
    {
      name: "static-deployment-files",
      closeBundle() {
        for (const file of ["_redirects", "robots.txt", "sitemap.xml"])
          copyFileSync(resolve(root, file), resolve("dist", file));
      },
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = new URL(req.url, "http://localhost").pathname;
          if (
            pathname !== "/" &&
            !pathname.includes(".") &&
            !pathname.startsWith("/@")
          )
            req.url =
              pathname +
              "/index.html" +
              (req.url.includes("?") ? "?" + req.url.split("?")[1] : "");
          next();
        });
      },
    },
  ],
});
