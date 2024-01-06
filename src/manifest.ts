import { defineManifest } from "@crxjs/vite-plugin";
import { version } from "./package-json";

export default defineManifest(() => ({
  manifest_version: 3,
  name: "Tiny wallet",
  description: "The tiny wallet for dapp.",
  version,
  version_name: version,
  // icons: {
  //   "128": "logo.png",
  // },
  action: { default_popup: "index.html" },
  permissions: ["storage"],
  background: {
    service_worker: "src/scripts/index.background.ts",
  },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*"],
      js: ["src/scripts/index.content.ts"],
      run_at: "document_start",
    },
  ],
  // web_accessible_resources: [
  //   {
  //     resources: ["dapp-api.js"],
  //     matches: ["http://*/*", "https://*/*"],
  //   },
  // ],
}));
