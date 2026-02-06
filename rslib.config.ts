import { defineConfig, LibConfig, RslibConfig } from "@rslib/core";

export default defineConfig(() => {
  const esmLib: LibConfig = {
    format: "esm",
    syntax: "esnext",
    bundle: true,
    dts: true,
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
    lib: [esmLib, cjsLib],
    output: {
      cleanDistPath: true,
      target: "web",
      minify: false,
      sourceMap: true
    },
  } satisfies RslibConfig;
});
