/**
 * Copyright 2016-2021 Sourcepole AG
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {SearchProviders} from './SearchProviders';
import {renderHelp} from './Help';

import MapPlugin from 'qwc2/plugins/Map';
import EditingSupport from 'qwc2/plugins/map/EditingSupport';
import LocateSupport from 'qwc2/plugins/map/LocateSupport';
import MeasurementSupport from 'qwc2/plugins/map/MeasurementSupport';
import OverviewSupport from 'qwc2/plugins/map/OverviewSupport';
import RedliningSupport from 'qwc2/plugins/map/RedliningSupport';
import ScaleBarSupport from 'qwc2/plugins/map/ScaleBarSupport';
import SnappingSupport from 'qwc2/plugins/map/SnappingSupport';
import HomeButtonPlugin from 'qwc2/plugins/HomeButton';

import APIPlugin from 'qwc2/plugins/API';
import AppMenu from 'qwc2/components/AppMenu';
import AttributeTablePlugin from 'qwc2/plugins/AttributeTable';
import AuthenticationPlugin from 'qwc2/plugins/Authentication';
import BackgroundSwitcherPlugin from 'qwc2/plugins/BackgroundSwitcher';
import BookmarkPlugin from 'qwc2/plugins/Bookmark';
import BottomBarPlugin from 'qwc2/plugins/BottomBar';
import BufferSupport from 'qwc2/plugins/redlining/RedliningBufferSupport';
import CyclomediaPlugin from 'qwc2/plugins/Cyclomedia';
import DxfExportPlugin from 'qwc2/plugins/DxfExport';
import EditingPlugin from 'qwc2/plugins/Editing';
import FeatureFormPlugin from 'qwc2/plugins/FeatureForm';
import FullscreenSwitcher from 'qwc2/components/FullscreenSwitcher';
import HeightProfilePlugin from 'qwc2/plugins/HeightProfile';
import HelpPlugin from 'qwc2/plugins/Help';
import IdentifyPlugin from 'qwc2/plugins/Identify';
import LayerCatalogPlugin from 'qwc2/plugins/LayerCatalog';
import LayerTreePlugin from 'qwc2/plugins/LayerTree';
import LocateButtonPlugin from 'qwc2/plugins/LocateButton';
import LoginUserPlugin from 'qwc2/plugins/LoginUser';
import MapComparePlugin from 'qwc2/plugins/MapCompare';
import MapCopyrightPlugin from 'qwc2/plugins/MapCopyright';
import MapExportPlugin from 'qwc2/plugins/MapExport';
import MapFilterPlugin from 'qwc2/plugins/MapFilter';
import MapInfoTooltipPlugin from 'qwc2/plugins/MapInfoTooltip';
import MapLegendPlugin from 'qwc2/plugins/MapLegend';
import MapTipPlugin from 'qwc2/plugins/MapTip';
import MeasurePlugin from 'qwc2/plugins/Measure';
import NewsPopupPlugin from 'qwc2/plugins/NewsPopup';
import PortalPlugin from 'qwc2/plugins/Portal';
import PrintPlugin from 'qwc2/plugins/Print';
import ProcessNotificationsPlugin from 'qwc2/plugins/ProcessNotifications';
import RasterExportPlugin from 'qwc2/plugins/RasterExport';
import RedliningPlugin from 'qwc2/plugins/Redlining';
import RoutingPlugin from 'qwc2/plugins/Routing';
import ScratchDrawingPlugin from 'qwc2/plugins/ScratchDrawing';
import SearchBox from 'qwc2/components/SearchBox';
import FeatureSearchPlugin from 'qwc2/plugins/FeatureSearch';
import SettingsPlugin from 'qwc2/plugins/Settings';
import SharePlugin from 'qwc2/plugins/Share';
import StartupMarkerPlugin from 'qwc2/plugins/StartupMarker';
import TaskButtonPlugin from 'qwc2/plugins/TaskButton';
import ThemeSwitcherPlugin from 'qwc2/plugins/ThemeSwitcher';
import TimeManagerPlugin from 'qwc2/plugins/TimeManager';
import Toolbar from 'qwc2/components/Toolbar';
import TopBarPlugin from 'qwc2/plugins/TopBar';
import {ZoomInPlugin, ZoomOutPlugin} from 'qwc2/plugins/ZoomButtons';
import {customAttributeCalculator, attributeTransform, customExporters} from './IdentifyExtensions';

import defaultLocaleData from '../static/translations/en-US.json';

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
                SnappingSupport: SnappingSupport
            }),
            APIPlugin: APIPlugin,
            AttributeTablePlugin: AttributeTablePlugin(/* CustomEditingInterface */),
            AuthenticationPlugin: AuthenticationPlugin,
            BackgroundSwitcherPlugin: BackgroundSwitcherPlugin,
            BookmarkPlugin: BookmarkPlugin,
            BottomBarPlugin: BottomBarPlugin,
            CyclomediaPlugin: CyclomediaPlugin,
            DxfExportPlugin: DxfExportPlugin,
            EditingPlugin: EditingPlugin(/* CustomEditingInterface */),
            FeatureFormPlugin: FeatureFormPlugin(/* CustomEditingInterface */),
            HeightProfilePlugin: HeightProfilePlugin,
            HelpPlugin: HelpPlugin(renderHelp),
            HomeButtonPlugin: HomeButtonPlugin,
            IdentifyPlugin: IdentifyPlugin,
            LayerCatalogPlugin: LayerCatalogPlugin,
            LayerTreePlugin: LayerTreePlugin,
            LocateButtonPlugin: LocateButtonPlugin,
            LoginUserPlugin: LoginUserPlugin,
            MapComparePlugin: MapComparePlugin,
            MapCopyrightPlugin: MapCopyrightPlugin,
            MapExportPlugin: MapExportPlugin,
            MapFilterPlugin: MapFilterPlugin,
            MapInfoTooltipPlugin: MapInfoTooltipPlugin(),
            MapLegendPlugin: MapLegendPlugin,
            MapTipPlugin: MapTipPlugin,
            MeasurePlugin: MeasurePlugin,
            NewsPopupPlugin: NewsPopupPlugin,
            PortalPlugin: PortalPlugin,
            PrintPlugin: PrintPlugin,
            ProcessNotificationsPlugin: ProcessNotificationsPlugin,
            RasterExportPlugin: RasterExportPlugin,
            RedliningPlugin: RedliningPlugin({
                BufferSupport: BufferSupport
            }),
            RoutingPlugin: RoutingPlugin(SearchProviders),
            FeatureSearchPlugin: FeatureSearchPlugin,
            ScratchDrawingPlugin: ScratchDrawingPlugin,
            SettingsPlugin: SettingsPlugin,
            SharePlugin: SharePlugin,
            StartupMarkerPlugin: StartupMarkerPlugin,
            TaskButtonPlugin: TaskButtonPlugin,
            ThemeSwitcherPlugin: ThemeSwitcherPlugin,
            TimeManagerPlugin: TimeManagerPlugin,
            TopBarPlugin: TopBarPlugin({
                AppMenu: AppMenu,
                Search: SearchBox(SearchProviders),
                Toolbar: Toolbar,
                FullscreenSwitcher: FullscreenSwitcher
            }),
            ZoomInPlugin: ZoomInPlugin,
            ZoomOutPlugin: ZoomOutPlugin,
        },
        cfg: {
            IdentifyPlugin: {
                attributeCalculator: customAttributeCalculator,
                attributeTransform: attributeTransform,
                customExporters: customExporters
            }
        }
    },
    actionLogger: (action) => {
        /* Do something with action, i.e. Piwik/Mamoto event tracking */
    }
    /*
    themeLayerRestorer: (missingLayers, theme, callback) => {
        // Invoked for layers specified in the l url parameter which are missing in the specified theme
        // Could be used to query a search provider for the missing theme layers

        // A list of theme layers to merge into the theme
        const newLayers = [];

        // A dictionary mapping the name of the searched layer name with the resulting layer name(s) as an array, i.e.
        // {searchlayername: ["resultlayername1", "resultlayername2"], ...}
        const newLayerNames = {};

        callback(newLayers, newLayerNames);
    }*/
    /* externalLayerRestorer: (externalLayers, themes, callback) => {
        // Optional function to handle restoring of external layers from the l URL parameter
        // If omitted, the default handler is used which downloads capabilities for each service to restore the layer
    }*/
};
