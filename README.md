<a id="readme-top"></a>

# pixi-i18n 🌐

<p align="center">
<a href="https://npmjs.com/package/pixi-i18n"><img src="https://img.shields.io/npm/v/pixi-i18n" alt="npm package"></a>
<img src="https://img.shields.io/badge/license-MIT-green.svg" alt="license" />
</p>

**pixi-i18n** is a plugin for [PixiJS v8.x][pixijs-url] that integrates [i18next][i18next-url] into the Pixi application lifecycle using the Pixi Extensions architecture.

It provides:
- automatic **i18next** initialization on `Application.init`
- a reactive [I18nText](#i18ntext) class that updates when language changes
- full TypeScript typings via Pixi global mixins

## Installation

```bash
bun add pixi-i18n
```

## Basic usage

The plugin must be imported **before** calling `Application.init` so the extension is registered.

```ts
import "pixi-i18n"; // register extension

import { Application } from "pixi.js";

const app = new Application();

await app.init({
  ...
  // i18next initialization options
  i18n: {
    ...
    resources: {
      en: {
        translation: {
          "my-text-key": "Hello!",
        },
      },
      ua: {
        translation: {
          "my-text-key": "Привіт!",
        },
      },
    },
  },
});
```

After initialization, the i18next instance is available on the application:

```ts
app.i18n.changeLanguage("ua");
```

## Creating localized text

To create a text object bound to i18next, use [`I18nText`](#i18ntext).

```ts
import { I18nText } from "pixi-i18n";

const textField = new I18nText({
  key: "my-text-key", // translation key from i18next resources
});
```

`I18nText` automatically subscribes to the i18next instance attached to the application.

When the language changes:

```ts
app.i18n.changeLanguage("ua");
```

the value of `textField.text` is updated automatically to match the current language.

You can also inject `i18next` controller into any PIXI.AbstractText (Bitmap, Canvas, Split, etc) by calling:

```ts
I18nText.from(textContainer, {
  key: "my-text-key"
});
```


## I18nText

`I18nText` accepts a combination of:

- standard `PIXI.Text` / `CanvasTextOptions`
- additional i18n-specific options

### I18nOptions

```ts
export interface I18nOptions<T extends AbstractTextField> {
  /**
   * Translation key used to resolve the text from the i18next instance automatically.
   */
  key: string;

  /**
   * Optional i18next instance. If not provided, the global i18n instance will be used.
   */
  i18nInstance?: i18n;

  /**
   * Optional hook that is called on every language change.
   */
  languageChangeHook?: (
    this: I18nController<T>,
    key: string,
    lng: string,
  ) => string;
}
```

This allows `I18nText` to behave exactly like a normal Pixi text object, while remaining fully reactive to language changes.

## Architecture

This project is based on the [PixiJS Extensions Architecture][pixijs-architecture-url].

Key points:

- uses `ExtensionType.Application` to integrate with `Application.init`
- extends Pixi types via **global mixins** with fully typed public API

The plugin behaves like a native Pixi subsystem rather than an external helper.

## Build and development

This project uses [**Bun**][bun-url]  as the package manager and script runner.

### Install dependencies

```bash
bun install
```

### Build the package

```bash
bun run build
```

### Development (watch mode)

```bash
bun run dev
```

## Testing

Tests are written using **RSTest**.

To run tests successfully, you must:

1. Set up the [Node environment][rstest-environment-url] with **fnm**
2. Prepare browser [testing dependencies][rstest-browser-url]

> [!WARNING]
> package test scripts will work **only with fnm** node manager!

After setup, run:

```bash
# One time project test
bun run test

# Tests in watch mode
bun run test:watch
```

## TODO

- [x] Create mixin to mix I18nText methods into any instance that implements `AbstractText`.
- [x] Create `static I18nText.from()` to make instance from abstraction.

## License

MIT

<p align="right">(<a href="#readme-top">back to top</a>)</p>



[pixijs-url]: https://pixijs.com/
[bun-url]: https://bun.com
[pixijs-architecture-url]: https://pixijs.com/8.x/guides/concepts/architecture
[i18next-url]: https://www.i18next.com/
[rstest-environment-url]: https://rstest.rs/guide/start/quick-start#setup-environment
[rstest-browser-url]: https://rstest.rs/guide/browser-testing/getting-started#1-install-dependencies