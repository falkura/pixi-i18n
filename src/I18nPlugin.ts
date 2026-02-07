import { Application, ExtensionType, type ApplicationOptions } from "pixi.js";
import i18next, { type i18n, type InitOptions } from "i18next";

/**
 * Initialization options for the Pixi i18next application plugin.
 */
export interface I18nInitOptions {
  /**
   * i18next initialization options.
   *
   * These options are passed directly to {@link i18n.init}.
   */
  i18n: InitOptions;
}

declare global {
  namespace PixiMixins {
    interface Application {
      /**
       * Active i18next instance attached to the Pixi {@link Application}.
       */
      i18n: i18n;
    }

    interface ApplicationOptions {
      /**
       * i18next initialization options.
       *
       * When provided, the i18n plugin will initialize the instance
       * during application startup.
       *
       * These options are passed directly to {@link i18n.init}.
       */
      i18n: InitOptions;

      /**
       * Optional custom i18n instance.
       *
       * If not provided, the global `i18next` instance will be used.
       */
      i18nInstance?: i18n;
    }
  }
}

/**
 * PixiJS Application plugin that integrates `i18next` into the
 * {@link Application} lifecycle.
 *
 * Once registered, the i18next instance becomes available as
 * {@link Application.i18n}.
 *
 * @example
 * ```ts
 * import { Application, extensions } from "pixi.js";
 * import { I18nPlugin } from "pixi-i18n";
 *
 * extensions.add(I18nPlugin);
 * const app = new Application();
 *
 * await app.init({
 *   i18n: {
 *     lng: 'en',
 *     resources,
 *   },
 * });
 *
 * app.i18n.changeLanguage('ua');
 * ```
 */
export class I18nPlugin {
  /**
   * PixiJS extension definition.
   */
  public static extension = {
    type: [ExtensionType.Application],
    name: "i18n",
  };

  /**
   * Initializes the i18n plugin during {@link Application} construction.
   *
   * @see {@link https://pixijs.download/dev/docs/extensions.html}
   * @see {@link https://pixijs.com/8.x/guides/concepts/architecture}
   */
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
