import { describe, expect, test } from "@rstest/core";
import { I18nText } from "../src/I18nText";
import { Application } from "pixi.js";
import i18next from "i18next";

describe("i18next text", () => {
  test("text reacts on language change", async () => {
    await import("../src/index");

    const app = new Application();

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
    await import("../src/index");

    const app = new Application();

    await app.init();

    const textField = new I18nText({
      key: "hello",
      i18nInstance: i18next.createInstance(),
    });

    expect(textField.i18n).not.toBe(app.i18n);
  });

  test("custom language change hook", async () => {
    await import("../src/index");

    const app = new Application();

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
        return this.instance.t(key, _lng) + "!!!";
      },
    });

    expect(textField.text).toBe(resources.en.translation.hello + "!!!");
  });

  test("i18n injected into AbstractText", async () => {
    class MyText {
      set text(value: string) {
        value;
      }

      get destroyed() {
        return false;
      }
    }

    const myText = new MyText();

    // @ts-ignore
    expect(myText.i18n).not.toBeDefined();

    I18nText.from(myText, { key: "zuzu" });

    // @ts-ignore
    expect(myText.i18n).toBeDefined();
  });
});
