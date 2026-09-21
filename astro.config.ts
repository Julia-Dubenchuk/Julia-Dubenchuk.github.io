import { defineConfig } from "astro/config";
import { SITE_ORIGIN, BASE_PATH } from "./src/data/urls";

// `site` and `base` come from src/data/urls.ts so the origin has exactly one
// definition. See the comment there: a duplicated origin drifts silently and
// breaks og:image with no build error.
export default defineConfig({
  site: SITE_ORIGIN,
  // Astro wants a path, not an empty string; BASE_PATH is "" for a user site.
  base: BASE_PATH || "/",
});
