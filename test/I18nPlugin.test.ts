import { describe, expect, test } from "@rstest/core";
import { Application } from "pixi.js";
import i18next from "i18next";

describe("i18next extension", () => {
  test("instance exists", () => {
    expect(i18next).toBeDefined();
  });

  test("plugin registers on import", async () => {
    expect(
      // @ts-ignore
      Application._plugins.find((p) => p?.extension?.name === "i18n"),
    ).not.toBeDefined();

    await import("../src/index");

    expect(
      // @ts-ignore
      Application._plugins.find((p) => p?.extension?.name === "i18n"),
    ).toBeDefined();
  });

  test("application have shared instance", async () => {
    await import("../src/index");

    const app = new Application();

    await app.init();

    expect(app.i18n).toBe(i18next);
  });

  test("application have custom instance", async () => {
    await import("../src/index");

    const app = new Application();

    const customI18n = i18next.createInstance();

    await app.init({
      i18nInstance: customI18n,
    });

    expect(app.i18n).toBe(customI18n);
    expect(app.i18n).not.toBe(i18next);
  });
});
