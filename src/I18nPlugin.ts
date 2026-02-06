import { Application, ExtensionType, type ApplicationOptions } from "pixi.js";
import i18next, { type i18n, type InitOptions } from "i18next";

export interface I18nInitOptions {
  i18n: InitOptions;
}

declare global {
  namespace PixiMixins {
    interface Application {
      i18n: i18n;
    }

    interface ApplicationOptions {
      i18n: InitOptions;
      i18nInstance?: i18n;
    }
  }
}

export class I18nPlugin {
  public static extension = {
    type: [ExtensionType.Application],
    name: "i18n",
  };

  public static init(
    this: Application,
    options: Partial<ApplicationOptions>,
  ): void {
    if (options?.i18nInstance) {
      this.i18n = options.i18nInstance;
    } else {
      this.i18n = i18next;
    }

    this.i18n.init({
      showSupportNotice: false,
      ...(options?.i18n || {}),
    });
  }
}
