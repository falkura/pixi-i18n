import { defineConfig } from "@rstest/core";
import { withRslibConfig } from "@rstest/adapter-rslib";

export default defineConfig({
  extends: withRslibConfig({ cwd: "./rslib.config.ts" }),
  browser: {
    enabled: true,
    provider: "playwright",
    headless: true, // Do not open browser window
  },
});
