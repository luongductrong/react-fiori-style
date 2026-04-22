import '@ui5/webcomponents-theming/dist/Assets.js';
import '@ui5/webcomponents/dist/generated/json-imports/Themes.js';
import '@ui5/webcomponents-fiori/dist/generated/json-imports/Themes.js';
import enLocaleData from '@ui5/webcomponents-localization/dist/generated/assets/cldr/en.json';
import { registerLocaleDataLoader } from '@ui5/webcomponents-base/dist/asset-registries/LocaleData.js';

registerLocaleDataLoader('en', async () => enLocaleData);
