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
            MapPlugin: require('qwc2/plugins/Map')({
                EditingSupport: require('qwc2/plugins/map/EditingSupport'),
                MeasurementSupport: require('qwc2/plugins/map/MeasurementSupport'),
                LocateSupport: require('qwc2/plugins/map/LocateSupport'),
                OverviewSupport: require('qwc2/plugins/map/OverviewSupport'),
                RedliningSupport: require('qwc2/plugins/map/RedliningSupport'),
                ScaleBarSupport: require('qwc2/plugins/map/ScaleBarSupport'),
                SelectionSupport: require('qwc2/plugins/map/SelectionSupport')
            }),
            HomeButtonPlugin: require('qwc2/plugins/HomeButton'),
            LocateButtonPlugin: require('qwc2/plugins/LocateButton'),
            ZoomInPlugin: require('qwc2/plugins/ZoomButtons'),
            ZoomOutPlugin: require('qwc2/plugins/ZoomButtons'),
            TaskButtonPlugin: require('qwc2/plugins/TaskButton'),
            BackgroundSwitcherPlugin: require('qwc2/plugins/BackgroundSwitcher'),
            TopBarPlugin: require('qwc2/plugins/TopBar')({
                 AppMenu: require("qwc2/components/AppMenu"),
                 Search: require("qwc2/components/Search")(SearchProviders, searchProviderFactory),
                 Toolbar: require("qwc2/components/Toolbar"),
                 FullscreenSwitcher: require("qwc2/components/FullscreenSwitcher")
            }),
            BottomBarPlugin: require('qwc2/plugins/BottomBar'),
            MeasurePlugin: require('qwc2/plugins/Measure'),
            ThemeSwitcherPlugin: require('qwc2/plugins/ThemeSwitcher'),
            LayerTreePlugin: require('qwc2/plugins/LayerTree'),
            IdentifyPlugin: require('qwc2/plugins/Identify'),
            MapTipPlugin: require('qwc2/plugins/MapTip'),
            SharePlugin: require('qwc2/plugins/Share'),
            MapCopyrightPlugin: require('qwc2/plugins/MapCopyright'),
            PrintPlugin: require('qwc2/plugins/Print'),
            HelpPlugin: require('qwc2/plugins/Help')(renderHelp),
            DxfExportPlugin: require('qwc2/plugins/DxfExport'),
            RasterExportPlugin: require('qwc2/plugins/RasterExport'),
            RedliningPlugin: require('qwc2/plugins/Redlining')({
                // BufferSupport: require('qwc2/plugins/redlining/RedliningBufferSupport')
            }),
            EditingPlugin: require('qwc2/plugins/Editing')(EditingInterface),
            MapComparePlugin: require('qwc2/plugins/MapCompare'),
            HeightProfilePlugin: require('qwc2/plugins/HeightProfile'),
            MapInfoTooltipPlugin: require('qwc2/plugins/MapInfoTooltip'),
            IdentifyRegionPlugin: require('qwc2/plugins/IdentifyRegion'),
            StartupMarkerPlugin: require('qwc2/plugins/StartupMarker')
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

        // A list of theme layers to merge into the theme
        let newLayers = [];

        // A dictionary mapping the name of the searched layer name with the resulting layer name(s) as an array, i.e.
        // {searchlayername: ["resultlayername1", "resultlayername2"], ...}
        let newLayerNames = {};

        callback(newLayers, newLayerNames);
    },
    /*externalLayerRestorer: (externalLayers, themes, callback) => {
        // Optional function to handle restoring of external layers from the l URL parameter
        // If omitted, the default handler is used which downloads capabilities for each service to restore the layer
    },*/
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
