import i18next, { type i18n } from "i18next";
import { Text, type CanvasTextOptions } from "pixi.js";

export interface I18nTextOptions {
  key: string;
  i18nInstance?: i18n;
  languageChangeHook?: (
    this: I18nText,
    key: string,
    ...params: Parameters<I18nText["updateI18n"]>
  ) => string;
}

export class I18nText extends Text {
  private _i18nKey!: string;
  private _i18nInstance!: i18n;
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

  public get i18nKey() {
    return this._i18nKey;
  }

  public set i18nKey(key: string) {
    this._i18nKey = key;

    this.updateI18n(this.i18nInstance.language);
  }

  public get i18nInstance(): i18n {
    return this._i18nInstance;
  }

  public set i18nInstance(instance: i18n) {
    if (this._i18nInstance) {
      this.unsubscribeI18n();
    }

    this._i18nInstance = instance;

    this.subscribeI18n();
  }

  private subscribeI18n(): void {
    this.i18nInstance.on("languageChanged", this.updateI18n.bind(this));
  }

  private unsubscribeI18n(): void {
    this.i18nInstance.off("languageChanged", this.updateI18n.bind(this));
  }

  protected updateI18n(_lng: string): void {
    let textToPlace;

    if (this._languageChangeHook) {
      textToPlace = this._languageChangeHook(this.i18nKey, _lng);
    } else {
      textToPlace = this.i18nInstance.t(this.i18nKey, _lng);
    }

    this.text = textToPlace ?? "undefined";
  }

  public override destroy(options?: any) {
    this.unsubscribeI18n();

    super.destroy(options);
  }
}
