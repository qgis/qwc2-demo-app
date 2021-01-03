/**
 * Copyright 2016-2021 Sourcepole AG
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {SearchProviders, searchProviderFactory} from './SearchProviders';
import {renderHelp} from './Help';

import MapPlugin from 'qwc2/plugins/Map';
import EditingSupport from 'qwc2/plugins/map/EditingSupport';
import MeasurementSupport from 'qwc2/plugins/map/MeasurementSupport';
import LocateSupport from 'qwc2/plugins/map/LocateSupport';
import OverviewSupport from 'qwc2/plugins/map/OverviewSupport';
import RedliningSupport from 'qwc2/plugins/map/RedliningSupport';
import ScaleBarSupport from 'qwc2/plugins/map/ScaleBarSupport';
import SelectionSupport from 'qwc2/plugins/map/SelectionSupport';
import HomeButtonPlugin from 'qwc2/plugins/HomeButton';
import LocateButtonPlugin from 'qwc2/plugins/LocateButton';
import {ZoomInPlugin, ZoomOutPlugin} from 'qwc2/plugins/ZoomButtons';
import TaskButtonPlugin from 'qwc2/plugins/TaskButton';
import BackgroundSwitcherPlugin from 'qwc2/plugins/BackgroundSwitcher';
import TopBarPlugin from 'qwc2/plugins/TopBar';
import AppMenu from 'qwc2/components/AppMenu';
import Search from 'qwc2/components/Search';
import Toolbar from 'qwc2/components/Toolbar';
import FullscreenSwitcher from 'qwc2/components/FullscreenSwitcher';
import BottomBarPlugin from 'qwc2/plugins/BottomBar';
import MeasurePlugin from 'qwc2/plugins/Measure';
import ThemeSwitcherPlugin from 'qwc2/plugins/ThemeSwitcher';
import LayerTreePlugin from 'qwc2/plugins/LayerTree';
import IdentifyPlugin from 'qwc2/plugins/Identify';
import MapTipPlugin from 'qwc2/plugins/MapTip';
import SharePlugin from 'qwc2/plugins/Share';
import MapCopyrightPlugin from 'qwc2/plugins/MapCopyright';
import PrintPlugin from 'qwc2/plugins/Print';
import HelpPlugin from 'qwc2/plugins/Help';
import DxfExportPlugin from 'qwc2/plugins/DxfExport';
import RasterExportPlugin from 'qwc2/plugins/RasterExport';
import RedliningPlugin from 'qwc2/plugins/Redlining';
import BufferSupport from 'qwc2/plugins/redlining/RedliningBufferSupport';
import EditingPlugin from 'qwc2/plugins/Editing';
import MapComparePlugin from 'qwc2/plugins/MapCompare';
import HeightProfilePlugin from 'qwc2/plugins/HeightProfile';
import MapInfoTooltipPlugin from 'qwc2/plugins/MapInfoTooltip';
import IdentifyRegionPlugin from 'qwc2/plugins/IdentifyRegion';
import StartupMarkerPlugin from 'qwc2/plugins/StartupMarker';
import ScratchDrawingPlugin from 'qwc2/plugins/ScratchDrawing';
import APIPlugin from 'qwc2/plugins/API';
import {customAttributeCalculator} from './CustomAttributeCalculator';

import defaultLocaleData from '../translations/en-US.json';

export default {
    defaultLocaleData: defaultLocaleData,
    initialState: {
        defaultState: {},
        mobile: {}
    },
    pluginsDef: {
        plugins: {
            MapPlugin: MapPlugin({
                EditingSupport: EditingSupport,
                MeasurementSupport: MeasurementSupport,
                LocateSupport: LocateSupport,
                OverviewSupport: OverviewSupport,
                RedliningSupport: RedliningSupport,
                ScaleBarSupport: ScaleBarSupport,
                SelectionSupport: SelectionSupport
            }),
            HomeButtonPlugin: HomeButtonPlugin,
            LocateButtonPlugin: LocateButtonPlugin,
            ZoomInPlugin: ZoomInPlugin,
            ZoomOutPlugin: ZoomOutPlugin,
            TaskButtonPlugin: TaskButtonPlugin,
            BackgroundSwitcherPlugin: BackgroundSwitcherPlugin,
            TopBarPlugin: TopBarPlugin({
                AppMenu: AppMenu,
                Search: Search(SearchProviders, searchProviderFactory),
                Toolbar: Toolbar,
                FullscreenSwitcher: FullscreenSwitcher
            }),
            BottomBarPlugin: BottomBarPlugin,
            MeasurePlugin: MeasurePlugin,
            ThemeSwitcherPlugin: ThemeSwitcherPlugin,
            LayerTreePlugin: LayerTreePlugin,
            IdentifyPlugin: IdentifyPlugin,
            MapTipPlugin: MapTipPlugin,
            SharePlugin: SharePlugin,
            MapCopyrightPlugin: MapCopyrightPlugin,
            PrintPlugin: PrintPlugin,
            HelpPlugin: HelpPlugin(renderHelp),
            DxfExportPlugin: DxfExportPlugin,
            RasterExportPlugin: RasterExportPlugin,
            RedliningPlugin: RedliningPlugin({
                BufferSupport: BufferSupport
            }),
            // Per default the editing interface qwc2/utils/EditingInterface.js is used
            // You can pass a custom editing interface here if desired
            EditingPlugin: EditingPlugin(/* CustomEditingInterface */),
            MapComparePlugin: MapComparePlugin,
            HeightProfilePlugin: HeightProfilePlugin,
            MapInfoTooltipPlugin: MapInfoTooltipPlugin,
            IdentifyRegionPlugin: IdentifyRegionPlugin,
            StartupMarkerPlugin: StartupMarkerPlugin,
            ScratchDrawingPlugin: ScratchDrawingPlugin,
            APIPlugin: APIPlugin
        },
        cfg: {
            IdentifyPlugin: {
                attributeCalculator: customAttributeCalculator
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
    }
    /*externalLayerRestorer: (externalLayers, themes, callback) => {
        // Optional function to handle restoring of external layers from the l URL parameter
        // If omitted, the default handler is used which downloads capabilities for each service to restore the layer
    }*/
};
