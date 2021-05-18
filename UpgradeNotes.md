Upgrade notes
=============

This document describes incompatibilites and other aspects which QWC2 applications need to address when updating against the latest qwc2 submodule.

When updating the `qwc2` submodule, run `yarn install` to ensure the dependencies are up to date!

Update to qwc2 submodule revision [e08aed5](https://github.com/qgis/qwc2/tree/e08aed5) (18.05.2021)
---------------------------------------------------------------------------------------------------

**Reworked Identify plugin**

The Identify plugin has been completely reworked, and the IdentifyRegion plugin has been merged into the Identify plugin:

- Remove the IdentifyRegion plugin from `js/appConfig.js` and `config.json`
- Create menu/toolbar entries in config.json for the region identify tool mode by specifying `"mode": "Region"`, i.e.:

      {"key": "Identify", "icon": "identify_region", "mode": "Region"},

- The translation message id `identifyregion.info` has been changed to `infotool.clickhelpPolygon` (unless the string is overridden, `yarn run tsupdate` will take care of this automatically).
- *Note*: The identify tool state is now handled internally by the Identify component, it does not store the results in the global application state anymore.


Update to qwc2 submodule revision [317eea3](https://github.com/qgis/qwc2/tree/317eea3) (03.01.2021)
---------------------------------------------------------------------------------------------------

**Updated dependencies**

Many dependencies in the `qwc2` submodule have been update, please run `yarn install` to update them in your application.

In the demo app, also many dependencies in the application `package.json` have been updated.
It's recommended to synchronize the application `package.json` and `webpack.config.js` with the ones of the demo app.


**Plugins do not need to specify the reducers they use anymore**

Action files register now the reducers they use automatically, so whenever a symbol is imported from an action file, the respective reducer is automatically enabled.

If you have a custom action/reducer file outside the `qwc2` submodule folder (i.e. `js/{actions,reducers}/myfunctionality.js`), you should add lines similar to

    import ReducerIndex from 'qwc2/reducers/index';
    import myfunctionalityReducer from '/reducers/myfunctionality';
    ReducerIndex.register("myfunctionality", myfunctionalityReducer);

to `js/actions/myfunctionality.js`.

If you have custom QWC2 plugins, remove the `reducers` field of the plugin export.

**ES6 imports**

QWC2 now uses the ES6 import/export syntax throughout. For instance

    const Icon = require('qwc2/components/Icon');
    const {addLayer} = require('qwc2/actions/layers');

become

    import Icon from 'qwc2/components/Icon';
    import {addLayer} from 'qwc2/actions/layers';

And

    module.exports = MyClass;

becomes

    export default MyClass;

resp.

    function foo() {...};
    function bar() {...};
    module.exports = {foo, bar};

becomes

    export function foo() {...};
    export function bar() {...};

In particular, `js/appConfig.js` needs to be heavily adapted.

**Update to React 16.14**

As per React 16.3, various component lifecycle methods have been deprecated.
All qwc2 core components are updated to avoid their use. Custom components should also be updated.
See [https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html) for details.

**Reworked localization**

Localization in QWC2 has been reworked:
- Instead of `<Message msgId="<msgid>" />` and `LocaleUtils.getMessageById()`, use `LocaleUtils.tr(<msgid>)`.
- For message IDs which are not translated directly via `LocaleUtils.tr`, use `LocaleUtils.trmsg` to mark the string as a message ID.
- The `Message` component has been dropped.
- Static message IDs are now picked up automatically by `updateTranslations.js` (invoked by `yarn run tsupdate`).
- Message IDs built at runtime will beed to be specified manually in `tsconfig.json` in the `extra_strings` section.
- The translation files are now called `translations/<lang>-<COUNTRY>.json` rather than `translations/data.<lang>-<COUNTRY>`. The format of the files remains unchanged.
- The `supportedLocales` section in `appConfig.js` needs to be dropped.
- Previously, the fallback locale was specified as `fallbacklocale` in config.json. Now, it must be specified as `defaultLocaleData` in `appConfig.js`.

**Default editing interface now shipped in the qwc2 submodule**

The `js/EditingInterface.js` in the demo app has been moved to `qwc2/utils/EditingInterface.js`.
This is the interface which acts as a counterpart to the [QWC data service](https://github.com/qwc-services/qwc-data-service).
If you want to use a custom editing interface, you can still do so, passing it to the `Editing` plugin in `appConfig.js` as before.

**Assets and translations path now optional**

Assets and translations path can now be omitted from the `config.json`, and are resolved to `assets` resp `translations` relative to the `index.html` path of the QWC2 application by default.

Use `ConfigUtils.getAssetsPath()` and `ConfigUtils.getTranslationsPath()` in your custom components instead of `ConfigUtils.getConfigProp`.

You can still specify `assetsPath` and `translationsPath` in `config.json` to override the default values.

**Changes to map click point/feature state**

The previous `state.map.clickPoint` and `state.map.clickFeature` have been merged to a single `state.map.click`. The `clickFeatureOnMap` action has been removed.
