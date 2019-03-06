/**
 * Copyright 2016, Sourcepole AG.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {SearchProviders, searchProviderFactory} = require('./SearchProviders');
const EditingInterface = require('./EditingInterface');
const renderHelp = require('./Help');

module.exports = {
    initialState: {
        defaultState: {},
        mobile: {}
    },
    pluginsDef: {
        plugins: {
            MapPlugin: require('../qwc2/QWC2Components/plugins/Map')({
                EditingSupport: require('../qwc2/QWC2Components/plugins/map/EditingSupport'),
                MeasurementSupport: require('../qwc2/QWC2Components/plugins/map/MeasurementSupport'),
                LocateSupport: require('../qwc2/QWC2Components/plugins/map/LocateSupport'),
                OverviewSupport: require('../qwc2/QWC2Components/plugins/map/OverviewSupport'),
                RedliningSupport: require('../qwc2/QWC2Components/plugins/map/RedliningSupport'),
                ScaleBarSupport: require('../qwc2/QWC2Components/plugins/map/ScaleBarSupport'),
                SelectionSupport: require('../qwc2/QWC2Components/plugins/map/SelectionSupport')
            }),
            HomeButtonPlugin: require('../qwc2/QWC2Components/plugins/HomeButton'),
            LocateButtonPlugin: require('../qwc2/QWC2Components/plugins/LocateButton'),
            ZoomInPlugin: require('../qwc2/QWC2Components/plugins/ZoomButtons'),
            ZoomOutPlugin: require('../qwc2/QWC2Components/plugins/ZoomButtons'),
            BackgroundSwitcherPlugin: require('../qwc2/QWC2Components/plugins/BackgroundSwitcher'),
            TopBarPlugin: require('../qwc2/QWC2Components/plugins/TopBar')({
                 AppMenu: require("../qwc2/QWC2Components/components/AppMenu"),
                 Search: require("../qwc2/QWC2Components/components/Search")(SearchProviders, searchProviderFactory),
                 Toolbar: require("../qwc2/QWC2Components/components/Toolbar"),
                 FullscreenSwitcher: require("../qwc2/QWC2Components/components/FullscreenSwitcher")
            }),
            BottomBarPlugin: require('../qwc2/QWC2Components/plugins/BottomBar'),
            MeasurePlugin: require('../qwc2/QWC2Components/plugins/Measure'),
            ThemeSwitcherPlugin: require('../qwc2/QWC2Components/plugins/ThemeSwitcher'),
            LayerTreePlugin: require('../qwc2/QWC2Components/plugins/LayerTree'),
            IdentifyPlugin: require('../qwc2/QWC2Components/plugins/Identify'),
            MapTipPlugin: require('../qwc2/QWC2Components/plugins/MapTip'),
            SharePlugin: require('../qwc2/QWC2Components/plugins/Share'),
            MapCopyrightPlugin: require('../qwc2/QWC2Components/plugins/MapCopyright'),
            PrintPlugin: require('../qwc2/QWC2Components/plugins/Print'),
            HelpPlugin: require('../qwc2/QWC2Components/plugins/Help')(renderHelp),
            DxfExportPlugin: require('../qwc2/QWC2Components/plugins/DxfExport'),
            RasterExportPlugin: require('../qwc2/QWC2Components/plugins/RasterExport'),
            RedliningPlugin: require('../qwc2/QWC2Components/plugins/Redlining'),
            EditingPlugin: require('../qwc2/QWC2Components/plugins/Editing')(EditingInterface),
            MapComparePlugin: require('../qwc2/QWC2Components/plugins/MapCompare'),
            HeightProfilePlugin: require('../qwc2/QWC2Components/plugins/HeightProfile'),
            MapInfoTooltipPlugin: require('../qwc2/QWC2Components/plugins/MapInfoTooltip'),
            IdentifyRegionPlugin: require('../qwc2/QWC2Components/plugins/IdentifyRegion')
        },
        cfg: {
            IdentifyPlugin: {
                attributeCalculator: require('./CustomAttributeCalculator')
            }
        }
    },
    actionLogger: (action) => {
        /* Do something with action, i.e. Piwik/Mamoto event tracking */
    },
    themeLayerRestorer: (missingLayers, theme, callback) => {
        // Invoked for layers specified in the l url parameter which are missing in the specified theme
        // Could be used to query a search provider for the missing theme layers
        // Return a list of theme layers to merge into the theme
        callback([]);
    },
    supportedLocales: {
         "pt": {
             code: "pt-BR",
             description: "Português Brasil",
             localeData: require('react-intl/locale-data/pt')
         },
         "it": {
             code: "it-IT",
             description: "Italiano",
             localeData: require('react-intl/locale-data/it')
         },
         "en": {
            code: "en-US",
            description: "English",
            localeData: require('react-intl/locale-data/en')
         },
         "fr": {
           code: "fr-FR",
           description: "Français",
           localeData: require('react-intl/locale-data/fr')
        },
        "de": {
            code: "de-DE",
            description: "Deutsch",
            localeData: require('react-intl/locale-data/de')
        },
        "ro": {
            code: "ro-RO",
            description: "Română",
            localeData: require('react-intl/locale-data/ro')
        },
        "ru": {
            code: "ru-RU",
            description: "Русский",
            localeData: require('react-intl/locale-data/ru')
        }
   }
};
