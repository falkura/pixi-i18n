import { extensions, Application } from "pixi.js";
import { I18nPlugin } from "./I18nPlugin";

/**
 * Automatic plugin registration
 *
 * Add `import "pixi-i18n"` before creating {@link Application}
 * to register the plugin
 */
extensions.add(I18nPlugin);
