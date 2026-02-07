import { type i18n } from "i18next";
import { Text, type CanvasTextOptions, type Application } from "pixi.js";
import { I18nController } from "./I18nController";

/**
 * Configuration options for {@link I18nController}.
 */
export interface I18nOptions<T extends AbstractTextField> {
  /**
   * Translation key used to resolve the text from the i18next instance automatically.
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
   * The returned string will be assigned to {@link AbstractTextField.text}.
   *
   * @param key - Translation key
   * @param lng - Language key
   *
   * @returns The text that should be displayed
   */
  languageChangeHook?: (
    this: I18nController<T>,
    key: string,
    lng: string,
  ) => string;
}

/**
 * Class instance that can be extended with {@link I18nController}
 */
export interface AbstractTextField {
  /**
   * Text setter that will recieve translated text
   */
  set text(value: string);

  /**
   * Flag to check if text destroyed for automatic
   * removing of subscribtion on i18next instance
   */
  get destroyed(): boolean;
}

/**
 * {@link Text PIXI.Text} extension with integration of {@link I18nController}
 */
export class I18nText extends Text implements AbstractTextField {
  /**
   * i18next controller with language change handler
   */
  i18n: I18nController<I18nText>;

  constructor(options: I18nOptions<I18nText> & Partial<CanvasTextOptions>) {
    super(options);

    this.i18n = new I18nController<I18nText>({
      target: this,
      ...options,
    });
  }

  /**
   * Injects {@link I18nController} into target instance
   *
   * @param target - instance that implements {@link AbstractTextField}
   * @param options - options to create translatable text
   *
   * @returns same instance with {@link I18nController} defined in `i18n` property
   */
  public static from<T extends AbstractTextField>(
    target: T,
    options: I18nOptions<T>,
  ): T & I18nClass<T> {
    Object.defineProperty(target, "i18n", {
      value: new I18nController({
        target,
        ...options,
      }),
    });

    return target as T & I18nClass<T>;
  }
}

/**
 * Instance with {@link I18nClass.i18n i18n} property
 */
export interface I18nClass<
  T extends AbstractTextField,
> extends AbstractTextField {
  /**
   * Instance of {@link I18nController}
   */
  i18n: I18nController<T>;
}
