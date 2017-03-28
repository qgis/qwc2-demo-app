v0.3 (XXX XX 2017):

**Important**:
- Run `yarn install` to upgrade dependencies.
- Consult the list of incompatible changes below.

**News**:
- Allow specifying WMS image format in themes configuration
- Add Toolbar component for quick-launch buttons next to search bar
- Add option to store current view as center + scale in URL
- Add support for URL crs parameter to specify in wich CRS the center/extent coordinates are specified
- Make TopBar components configurable
- Make logo format configurable
- Move coordinates search provider to app
- Add optional search provider selection menu
- Add support for search queries with multiple input fields
- Allow removing entire layers from identify results list
- Add button to export the identify results to json
- Add component to identify all features within a selected region
- Add possibility to not display any background layer
- Make the short permalink share component fall back to the full URL if no QWC2 server is configured
- Make map button positions configurable
- Add button to toggle the layertree
- Add expanders to layer tree groups
- Allow hiding layer icons in layertree
- Honour layer drawing order
- Allow limiting available map scales for printing
- Also encode layer transparencies in the layer query parameter
- Make the overview map display the actual theme map instead of an OSM layer
- Add info dialog for displaying layer metadata and legend
- Expose composer labels in print dialog
- Show label with search result text along with pin marker
- Also highlight the geometry of the selected search result in the print output
- Increase size of theme thumbnails
- Add raster-export component to save a selected area of the map to an image
- Add button to print current layertree legend
- Automatically select search result if only one result is returned
- Automatically perform search when theme is loaded an a search text query parameter exists. If the search results in exactly one result, it will get selected.
- Make custom commands in package.json windows compatible
- Update all dependencies to latest version available as of Feb 27 2017
- Add draw component
- Move various scripts to qwc2/scripts
- Allow selectively overriding translation strings while importing the rest from the qwc2/translations
- Map projections are now set individually for each theme
- Add preserveExtentOnThemeSwitch and preserveBackgroundOnThemeSwitch to config.json to control whether extent / background layer should be preserved (if possible) on theme switch
- Make identify results dialog resizeable
- Insert anchor tags for urls / email addresses in feature attributes
- Allow configuring grid interval for print output
- Allow specifying human readable labels for the CRS EPSG codes in js/appConfig.js
- Allow limiting available resolutions for printing
- Add per-theme "collapseLayerGroupsBelowLevel" setting to control level below which layer groups are collapsed by default in the layer tree
- Add per-theme "skipEmptyFeatureAttributes" setting to control whether empty/NULL attributes should be skipped in the feature info table
- Add optional label attribute to search result items to display in map on select (defaults to item text)
- Added LayerTree config properties: showRootEntry, showQueryableIcon, allowMapTips
- Use assets/templates/legendprint.html as a template for the map legend print.
- Added LayerTree groupTogglesSublayers config property to control whether toggling a group toggles just the group or also all the sublayers


**Incompatible changes**:
- Keys of TopBar menuItems in config.js have been renamed
- Center/extent coordinates in URL by default in map projection instead of EPSG:4326
- The search text URL parameter key is now `st` instead of `s`
- The individual TopBar plugin components are now configured in js/appConfig.js
- The coordinate search provider was moved to js/SearchProviders.js
- The search providers onSearch and getMoreResults take an additional requestId argument
- The searchResultsLoaded action has changed:

        -const {searchResultLoaded} = require("../qwc2/MapStore2/web/client/actions/search");
        +const {addSearchResults} = require("../qwc2/QWC2Components/actions/search");

- The search providers must return the additional fields provider and reqId:

        {data: results, provider: providerId, reqId: requestId}

- Various scripts have been moved to qwc2/scripts. The "scripts" section of package.json has been adapted to use these.
- The translations/updateTranslations.py was removed in favour of qwc2/scripts/updateTranslations.js, the translation  languages now need to be specified in translations/tsconfig.json along with application specific message ids. Consult the README for more details.
- Map projections are now set individually for each theme via the mapCrs entry. If unset, it will default to EPSG:3857.
- The defaultScales list in themesConfig.json is now required
- The locale definitions under `supportedLocales` in `appConfig.js` must provide a localeData field

        localeData: require('react-intl/locale-data/<lang>')
- The print legend functionality requires a assets/templates/legendprint.html file with an element with id="legendcontainer", which will contain the legend graphics. The HTML document title of this template **may** influence the suggested output name when printing to a file (depending on the browser).


v0.2 (Jan 03 2017):
- https://github.com/qgis/qwc2-demo-app/compare/v0.1...v0.2


v0.1 (Dec 21 2017):
- Initial public release
