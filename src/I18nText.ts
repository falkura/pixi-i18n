import i18next, { type i18n } from "i18next";
import {
  Text,
  type CanvasTextOptions,
  type Application,
  type DestroyOptions,
} from "pixi.js";

/**
 * Configuration options for {@link I18nText}.
 */
export interface I18nTextOptions {
  /**
   * Translation key used to resolve the text from the i18next instance automatically.
   *
   * @example
   * ```ts
   * key: "ui.button.play"
   * ```
   */
  key: string;

  /**
   * Optional i18next instance.
   * If not provided, the global {@link Application.i18n i18n} instance will be used.
   */
  i18nInstance?: i18n;

  /**
   * Optional hook that is called on every language change.
   *
   * Allows overriding the default translation resolution logic.
   * The returned string will be assigned to {@link Text.text PIXI.Text().text}.
   *
   * @param key - Translation key
   * @param params - Parameters forwarded from {@link I18nText.updateI18n}
   *
   * @returns The text that should be displayed
   */
  languageChangeHook?: (
    this: I18nText,
    key: string,
    ...params: Parameters<I18nText["updateI18n"]>
  ) => string;
}

/**
 * PixiJS {@link Text} extension that automatically updates its content
 * when the active language of an i18next instance changes.
 *
 * The class integrates global `i18next` by default.
 *
 * @see {@link https://www.i18next.com/ i18next documentation} for more information
 */
export class I18nText extends Text {
  /** Currently active i18next translation key */
  private _i18nKey!: string;

  /** Bounded i18next instance */
  private _i18nInstance!: i18n;

  /** Optional language change hook */
  private _languageChangeHook: I18nTextOptions["languageChangeHook"];

  constructor(options: I18nTextOptions & Partial<CanvasTextOptions>) {
    super(options);

    if (options.i18nInstance) {
      this.i18nInstance = options.i18nInstance;
    } else {
      this.i18nInstance = i18next;
    }

    this._languageChangeHook = options?.languageChangeHook?.bind(this);

    this.i18nKey = options.key;
  }

  /**
   * Gets the currently assigned i18next key.
   */
  public get i18nKey() {
    return this._i18nKey;
  }

  /**
   * Sets a new i18next key and immediately updates the text.
   *
   * @param key - Translation key
   */
  public set i18nKey(key: string) {
    this._i18nKey = key;

    this.updateI18n(this.i18nInstance.language);
  }

  /**
   * Gets the active i18next instance.
   */
  public get i18nInstance(): i18n {
    return this._i18nInstance;
  }

  /**
   * Sets a new i18next instance.
   *
   * Automatically unsubscribes from the previous instance
   * and subscribes to language change events on the new one.
   *
   * @param instance - i18next instance
   */
  public set i18nInstance(instance: i18n) {
    if (this._i18nInstance) {
      this.unsubscribeI18n();
    }

    this._i18nInstance = instance;

    this.subscribeI18n();
  }

  /**
   * Subscribes to language change events on the current i18next instance.
   */
  private subscribeI18n(): void {
    this.i18nInstance.on("languageChanged", this.updateI18n.bind(this));
  }

  /**
   * Unsubscribes from language change events on the current i18next instance.
   */
  private unsubscribeI18n(): void {
    this.i18nInstance.off("languageChanged", this.updateI18n.bind(this));
  }

  /**
   * Updates the displayed text when the language changes.
   *
   * @param _lng - New language code
   */
  protected updateI18n(_lng: string): void {
    let textToPlace;

    if (this._languageChangeHook) {
      textToPlace = this._languageChangeHook(this.i18nKey, _lng);
    } else {
      textToPlace = this.i18nInstance.t(this.i18nKey, _lng);
    }

    this.text = textToPlace ?? "undefined";
  }

  /**
   * Destroys the text instance and cleans up i18next subscriptions.
   *
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   *
   * @see {@link Text.destroy}
   */
  public override destroy(options?: DestroyOptions) {
    this.unsubscribeI18n();

    super.destroy(options);
  }
}
