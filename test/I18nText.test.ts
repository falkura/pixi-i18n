import { describe, expect, test } from "@rstest/core";
import { I18nPlugin } from "../src/I18nPlugin";
import { I18nText } from "../src/I18nText";
import { Application, extensions } from "pixi.js";
import i18next from "i18next";

describe("i18next text", () => {
  test("text reacts on language change", async () => {
    const app = new Application();
    extensions.add(I18nPlugin);

    const resources = {
      en: {
        translation: {
          hello: "Hello!",
        },
      },
      es: {
        translation: {
          hello: "Hola!",
        },
      },
    };

    await app.init({
      i18n: {
        fallbackLng: "en",
        resources,
      },
    });

    const textField = new I18nText({
      key: "hello",
    });

    expect(textField.text).toBe(resources.en.translation.hello);

    app.i18n.changeLanguage("es");

    expect(textField.text).toBe(resources.es.translation.hello);
  });

  test("text has different i18next instance", async () => {
    const app = new Application();
    extensions.add(I18nPlugin);

    await app.init();

    const textField = new I18nText({
      key: "hello",
      i18nInstance: i18next.createInstance(),
    });

    expect(textField.i18nInstance).not.toBe(app.i18n);
  });

  test("custom language change hook", async () => {
    const app = new Application();
    extensions.add(I18nPlugin);

    const resources = {
      en: { translation: { hello: "Hello!" } },
    };

    await app.init({
      i18n: {
        lng: "en",
        resources,
      },
    });

    const textField = new I18nText({
      key: "hello",
      languageChangeHook(key: string, _lng: string) {
        return this.i18nInstance.t(key, _lng) + "!!!";
      },
    });

    expect(textField.text).toBe(resources.en.translation.hello + "!!!");
  });
});
