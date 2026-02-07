import { defineConfig, LibConfig, RslibConfig } from "@rslib/core";
import { pluginDts } from "rsbuild-plugin-dts";

export default defineConfig(() => {
  const esmLib: LibConfig = {
    format: "esm",
    syntax: "esnext",
    bundle: true,
    dts: false,
    output: {
      distPath: "./lib/esm",
    },
  };

  const cjsLib: LibConfig = {
    format: "cjs",
    syntax: "esnext",
    bundle: true,
    dts: false,
    output: {
      distPath: "./lib/cjs",
    },
  };

  return {
    plugins: [
      pluginDts({
        distPath: "./lib/types",
      }),
    ],
    lib: [esmLib, cjsLib],
    output: {
      cleanDistPath: true,
      target: "web",
      /**
       * Disable minification.
       *
       * Keeps output readable and improves debugging,
       * while allowing consumer bundlers to minify.
       */
      minify: false,
      sourceMap: true,
    },
  } satisfies RslibConfig;
});
