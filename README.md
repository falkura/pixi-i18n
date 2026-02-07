# pixi-i18n

i18ntext is the text that integrates i18next library (link) into pixi.js ecosystem

modules esm and cjs

test coverage with rstest

rstest requires node, you need to have node 18+ (check rstest docs)

if you using only bun, you need to install fnm https://github.com/Schniz/fnm and run test_fnm for tests

playwright chromium also required for tests: bunx playwright install chromium or npx playwright install chromium

bun used as package manager: https://bun.com

pixi extensions architecture based https://pixijs.com/8.x/guides/concepts/architecture

if you dont want to test, you can skip parts with fnm and playwright

usage:

```ts
import "pixi-i18n" // register extension
import { Application } from "pixi.js";
import { I18nText } from "pixi-i18n";

const app = new Application();

// create i18n text
const textField = new I18nText({
    key: "hello",
});

await app.init({
    i18n: {} // i18next options
});

app.i18n.changeLanguage("ua");
```

full typization with pixi global mixins

build to build, dev to develop, test to test :)
