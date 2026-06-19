import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal config: the site is static pages + one Web-standard route handler
// (app/api/contact), so no incremental cache / queue adapters are needed yet.
// Add an `incrementalCache` adapter here if you later introduce ISR.
export default defineCloudflareConfig();
