/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
    initialState: {
        defaultState: {
            mousePosition: {
                enabled: true,
                crs: "EPSG:4326"
            },
            mapInfo: {
                enabled: true
            }
        },
        mobile: {}
    },
    pluginsDef: {
        plugins: {
            MapPlugin: require('../qwc2/QWC2Components/plugins/Map'),
            LocateButtonPlugin: require('../qwc2/QWC2Components/plugins/LocateButton'),
            ZoomInPlugin: require('../qwc2/QWC2Components/plugins/ZoomButtons'),
            ZoomOutPlugin: require('../qwc2/QWC2Components/plugins/ZoomButtons'),
            BackgroundSwitcherButtonPlugin: require('../qwc2/QWC2Components/plugins/BackgroundSwitcherButton'),
            BackgroundSwitcherMenuPlugin: require('../qwc2/QWC2Components/plugins/BackgroundSwitcherMenu'),
            TopBarPlugin: require('../qwc2/QWC2Components/plugins/TopBar'),
            BottomBarPlugin: require('../qwc2/QWC2Components/plugins/BottomBar'),
            MeasurePlugin: require('../qwc2/QWC2Components/plugins/Measure'),
            ThemeSwitcherPlugin: require('../qwc2/QWC2Components/plugins/ThemeSwitcher'),
            LayerTreePlugin: require('../qwc2/QWC2Components/plugins/LayerTree'),
            IdentifyPlugin: require('../qwc2/QWC2Components/plugins/Identify'),
            MapTipPlugin: require('../qwc2/QWC2Components/plugins/MapTip'),
            SharePlugin: require('../qwc2/QWC2Components/plugins/Share'),
            MapCopyrightPlugin: require('../qwc2/QWC2Components/plugins/MapCopyright'),
            PrintPlugin: require('../qwc2/QWC2Components/plugins/Print'),
            DxfExportPlugin: require('../qwc2/QWC2Components/plugins/DxfExport')
        },
        requires: {}
    }
};
