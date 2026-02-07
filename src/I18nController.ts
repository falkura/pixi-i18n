import type { i18n } from "i18next";
import type { AbstractTextField, I18nOptions } from "./I18nText";
import i18next from "i18next";

export interface I18nControllerOptions<
  T extends AbstractTextField,
> extends I18nOptions<T> {
  /**
   * Instance that implements {@link AbstractTextField}
   */
  target: T;
}

/**
 * Simple i18next controller for instances that implements {@link AbstractTextField}
 *
 * Automatically updates text when active language of an i18next instance changes.
 *
 * The class integrates global `i18next` by default.
 *
 * @see {@link https://www.i18next.com/ i18next documentation} for more information
 */
export class I18nController<T extends AbstractTextField> {
  /** Currently active i18next translation key */
  private _key!: string;

  /** Bounded i18next instance */
  private _instance!: i18n;

  /** Optional language change hook */
  private _languageChangeHook: I18nOptions<T>["languageChangeHook"];

  /** Target {@link AbstractTextField} instance to update */
  private target: T;

  constructor(options: I18nControllerOptions<T>) {
    this.target = options.target;

    if (options.i18nInstance) {
      this.instance = options.i18nInstance;
    } else {
      this.instance = i18next;
    }

    this._languageChangeHook = options?.languageChangeHook?.bind(this);

    this.key = options.key;
  }

  /**
   * Gets the currently assigned i18next key.
   */
  public get key() {
    return this._key;
  }

  /**
   * Sets a new i18next key and immediately updates the text.
   *
   * @param key - Translation key
   */
  public set key(key: string) {
    this._key = key;

    this.updateI18n(this.instance.language);
  }

  /**
   * Gets the active i18next instance.
   */
  public get instance(): i18n {
    return this._instance;
  }

  /**
   * Sets a new i18next instance.
   *
   * Automatically unsubscribes from the previous instance
   * and subscribes to language change events on the new one.
   *
   * @param instance - i18next instance
   */
  public set instance(instance: i18n) {
    if (this._instance) {
      this.unsubscribeI18n();
    }

    this._instance = instance;

    this.subscribeI18n();
  }

  /**
   * Subscribes to language change events on the current i18next instance.
   */
  private subscribeI18n(): void {
    this.instance.on("languageChanged", this.updateI18n.bind(this));
  }

  /**
   * Unsubscribes from language change events on the current i18next instance.
   */
  private unsubscribeI18n(): void {
    this.instance.off("languageChanged", this.updateI18n.bind(this));
  }

  /**
   * Updates the displayed text when the language changes.
   *
   * @param _lng - New language code
   */
  private updateI18n(_lng: string): void {
    if (this.target.destroyed) {
      this.destroy();
      return;
    }

    let textToPlace: string;

    if (this._languageChangeHook) {
      textToPlace = this._languageChangeHook.call(this, this.key, _lng);
    } else {
      textToPlace = this.instance.t(this.key, _lng);
    }

    this.target.text = textToPlace ?? "undefined";
  }

  /**
   * Cleans up i18next subscriptions.
   */
  public destroy() {
    this.unsubscribeI18n();
  }
}
