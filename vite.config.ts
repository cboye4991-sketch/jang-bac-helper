// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Build GitHub Pages (GITHUB_PAGES=1) : site 100 % statique servi sous /<nom-du-repo>/,
// pages pré-générées ; la correction passe par la fonction Supabase « corriger » (VITE_CORRIGER_URL).
// Sans GITHUB_PAGES : build Lovable / serveur habituel, inchangé.
const pages = process.env["GITHUB_PAGES"] === "1";
const base = process.env["PAGES_BASE"] ?? "/jang-bac-helper/";

export default defineConfig(
  pages
    ? {
        vite: { base },
        nitro: false,
        tanstackStart: {
          server: { entry: "server" },
          spa: { enabled: true },
          prerender: { enabled: true, crawlLinks: true },
          router: { basepath: base },
        },
      }
    : {
        tanstackStart: {
          // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
          // nitro/vite builds from this
          server: { entry: "server" },
        },
      },
);
