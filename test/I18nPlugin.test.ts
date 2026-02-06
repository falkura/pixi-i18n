import { describe, expect, test } from "@rstest/core";
import { I18nPlugin } from "../src/I18nPlugin";
import { Application, extensions } from "pixi.js";
import i18next from "i18next";

describe("i18next extension", () => {
  test("instance exists", () => {
    expect(i18next).toBeDefined();
  });

  test("application have shared instance", async () => {
    const app = new Application();
    extensions.add(I18nPlugin);

    await app.init();

    expect(app.i18n).toBe(i18next);
  });

  test("application have custom instance", async () => {
    const app = new Application();
    extensions.add(I18nPlugin);

    const customI18n = i18next.createInstance();

    await app.init({
      i18nInstance: customI18n,
    });

    expect(app.i18n).toBe(customI18n);
    expect(app.i18n).not.toBe(i18next);
  });
});
