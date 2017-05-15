QGIS Web Client 2 Demo Application
==================================

**Consult the [ChangeLog](https://github.com/qgis/qwc2-demo-app/blob/master/ChangeLog.md) for a summary of changes between releases**

Quick Start
-----------

Clone the repository with the --recursive option to automatically clone submodules.
* If you are a developer, use

        git clone --recursive https://github.com/qgis/qwc2-demo-app.git

* If you are an end-user and want to clone the latest stable release, use

        git clone --recursive --branch stable https://github.com/qgis/qwc2-demo-app.git

Install NodeJS, if needed, from [here](https://nodejs.org/en/blog/release/v0.12.7/).

We highly recommend using [yarn](https://yarnpkg.com/) to manage the dependencies instead of `npm`.

Start the development application locally:

    yarn install
    yarn start

The application runs at `http://localhost:8081` afterwards. You can change the address and port
by tweaking the `start` script in `package.json`, i.e.

    "start": "npm run themesconfig && webpack-dev-server --progress --colors --host <ip_addr> --port <port>"


Configuration
--------------

### Application

There are five main configuration files:

 * `js/appConfig.js`: This file configures which components and which map
 projections are compiled into the application bundle, the human readable labels
 for the EPSG codes as well as the available locales.
 Changing this file will require a re-deployment of the application.

 * `config.json`: This file controls the plugin configuration (whether they are
 enabled in desktop/mobile plus plugin specific configuration) and also stores
 some global properties. This file can be changed without re-deploying the application.

 * `styleConfig.js`: This file contains variables for the main styling properties
 (mainly colors). Changing this file will require a re-deployment of the application.

 * `themesConfig.json`: This file configures the themes which will be available
 in the application, see below for details.

 * `index.html`: This is the main entry point of the application. Among other things,
 the window title is set here. This file can be changed without re-deploying the application.

In addition, there are some additional important files (changing any of these
files will require a re-depolyment of the application):

 * `js/Help.jsx`: This component is displayed when selecting Help in the
 Application Menu. It can be customized as desired.

 * `js/SearchProviders.js`: This file contains the implementation of the search
 providers. The key names for the providers specified in the `module.exports`
 in this file can be listed under `searchProviders` in `themesConfig.json` to
 control which search servies are available for which themes.

 * `assets/css/qwc2.css`: This is a global style sheet which can contain any
 desired style tweaks.

### Map projection configuration

The map projection is configured individually for each theme in `themesConfig.json` (see below).
Remember to register the projection you wish to use in `js/appConfig.js`.
Note that the leaflet backend currently does not support projections other than `EPSG:3857`.

### Themes

Themes and map scales are configured in `themesConfig.json`.

Configuration format:
```
{
  "themes": {
    "items": [
      {
        "url": "<http://localhost/wms/theme>",
        "title": "<Custom theme title>",            // optional, use WMS title if not set
        "thumbnail": "<filename>",                  // optional image file in assets/img/mapthumbs, if not set uses WMS GetMap to generate the thumbnail and stores it in assets/img/mapthumbs
        "attribution": "<Attribution>",             // optional theme attribution
        "attributionUrl": "<attribution URL>",      // optional theme attribution URL
        "default": true,                            // optional, set this as the initial theme
        "scales": [25000, 10000, 5000, 2500],       // optional, custom map scales, defaults to defaultScales (see below)
        "printScales": [25000, 10000, 5000, 2500],  // optional, confined list of available print scales, defaults to defaultPrintScales (see below)
        "printResolutions": [150, 300, 600],        // optional, confined list of abailable print resolutions, defaults to defaultPrintResolutions (see below)
        "printGrid": [                              // optional, list of grid intervals to use for various scales when printing.
            {"s": 10000, x: 1000, y: 1000},         //   Keep this list sorted in descending order by scale (s)
            {"s": 1000, x: 100, y: 100},            //   In this example, {x: 100, y: 100} will be used for 1000 <= scale < 10000
            ...                                     //   If not specified, defaultPrintGrid will be usd (see below)
        ],
        "printLabelForSearchResult": "<labelid>"    // optional, a labelid in the print composition where to insert the label of the selected search result
        "printLabelConfig": {                       // optional, configuration of input textareas for print composition labels.
            "labelId": {
                "rows": 4,
                "maxLength: "40"
              },
              ...
        }
        "extent": [xmin, ymin, xmax, ymax],         // optional custom extent which overrides extent from WMS capabilities
        "tiled": true,                              // optional, use tiled WMS (default is false)
        "format": "image/png",                      // optional, the image format to use in the WMS request, defaults to image/png
        "backgroundLayers": [                       // optional background layers
          {
            "name": "<background layer name>",      // background layer name from list below
            "printLayer": "<qgis layer name>",      // optional, name of a qgis layer to use as equivalent background layer when printing
            "visibility": true                      // optional initial visibility on topic selection
          }
        ],
        "searchProviders": ["<search provider>"],   // optional search providers
        "mapCrs: "EPSG:3857",                       // optional, the map projection, defaults to EPSG:3857
        "additionalMouseCrs": ["<epsg code>"]       // optional list of additional CRS for mouse position (map projection and WGS84 are listed by default). Make sure proj defs are loaded in js/appConfig.js.
        "watermark": {                              // optional, configuration of watermark to place on raster-export images
          "text": "<watermark text>",
          "texpadding": "1",                        // optional, padding between text and frame, in points
          "fontsize": "14",                         // optional, font size
          "fontfamily": "sans",                     // optional, font family
          "fontcolor": "#0000FF",                   // optional, font color
          "backgroundcolor": "#FFFFFF",             // optional, background color of the frame
          "framecolor": "#000000",                  // optional, color of the frame border
          "framewidth": 1                           // optional, width of the frame border, in pixels
        },
        "collapseLayerGroupsBelowLevel": <level>    // optional, layer tree level below which to initially collapse groups. If unspecified, groups are not initially collapsed.
        "skipEmptyFeatureAttributes": true          // optional, whether to skip empty feature attributes in the identify results. Default is false.
      }
    ],
    "groups": [                                     // optional, nested groups
      {
        "title": "<Group title>",
        "items": [
          {
            "url": "<http://localhost/wms/group_theme>"
          }
        ]
        "groups": [
          // subgroups
        ]
      }
    ],
    "backgroundLayers": [                           // optional list of background layers for themes
      {
        "name": "<background layer name>",          // referenced by themes
        "title": "<Background layer title>",
        "thumbnail": "<filename>",                  // optional image file in assets/img/mapthumbs, use default.jpg if not set
        ...                                         // layer params (excluding "group" and "visibility")
      }
    ]
  },
  "defaultScales": [50000, 25000, 10000, 5000],     // required, default map scales
  "defaultPrintScales": [50000, 25000, 10000, 5000],// optional, confined list of available print scales. If not specified, scale is freely choosable.
  "defaultPrintResolutions": [150, 300, 600],       // optional, confined list of abailable print resolutions. If not specified, resolution is freely choosable.
  "defaultPrintGrid": [<as printGrid above>]        // optional, list of grid intervals to use for various scales when printing, no grid is primted if omitted
}
```

`yarn run themesconfig` requests the capabilities of all WMS services and
generates a runtime configuration `themes.json`. It is automatically run on
`yarn start`. To update the `themes.json` of a deployed application, just run
`yarn run themesconfig` in the development tree and copy the resulting
`themes.json` to the production folder.

### URL parameters
The following parameters can appear in the URL:

 * `t`: The active theme
 * `l`: The visible layers in the map
 * `bl`: The visible background layer
 * `st`: The search text
 * `e`: The visible extent
 * `c`: The center of the visible extent
 * `s`: The current scale
 * `crs`: The CRS of extent/center coordinates

The `urlPositionFormat` parameter in `config.json` determines whether extent or
center + scale appear in the URL. Allowed values are `extent` and `centerAndZoom`.
Default is `extent`.

The `urlPositionCrs` parameter in `config.json` determines the CRS to use for the
extent/center coordinates in the URL. The value is an EPSG code (i.e. `EPSG:4326`).
Default is the map projection.

If `urlPositionCrs` is equal to the map projection, the `crs` parameter is
omitted in the URL, but it can be manually added to the URL to specify the initial
extent/center in a desired CRS.

#Toggle on/off groups sublayers
In `config.json` by changing the boolean value of the `groupTogglesSublayers` option
under the `LayerTree`, you can configure the wanted behavior, for mobile and for
desktop.

### Server

A server component is necessary for generating and resolving permalinks.
A sample server can be found [here](https://github.com/sourcepole/qwc2-server).
The url to the server must be specified under `qwc2serverUrl` in `config.json`.

Translations
------------

Translations are stored in the `data.<locale>` files stored under `translations`.
These are plain text files in JSON format. Translations available to the application
need to be listed under `supportedLocales` in `js/appConfig.js`.

When running `yarn start` (or manually `yarn run tsupdate`), translations from
the common QWC2 components, located in `qwc2/translations`, are automatically
merged. This ensures the translations remain up-to-date when updating the `qwc2`
submodule. The languages for which translations need to be generated are listed
under `translations/tsconfig.json`. If you ship applications-specific components,
you must list the message ids in the `strings` section of `translations/tsconfig.json`,
analogously to `qwc2/translations/tsconfig.json`.

You can test a locale by adding the `locale` query parameter to the URL, i.e. `locale=de`.

You can also override the locale in `config.json` via the `locale` setting.


Deployment
----------

Run

    yarn run prod

The files created inside `./prod` can then be deployed to a web server.

If you deploy to a folder other than the root of the web server, be sure to adjust
the asset paths in `styleConfig.js` and `config.json`.


HTTP headers for printing
-------------------------

QGIS Server doesn't emit a HTTP header with a file name, which usually results in an ugly file name for print outputs. Therefore the web server should add a `Content-Disposition` header.

Example for Apache:

    SetEnvIf Request_URI "^/wms.*/(.+)$" project_name=$1
    Header always setifempty Content-Disposition "attachment; filename=%{project_name}e.pdf" "expr=%{CONTENT_TYPE} = 'application/pdf'"

This example uses the `setenvif` and the `headers` modules:

    a2enmod setenvif
    a2enmod headers


Preparation for developers
--------------------------

### Short MapStore2 introduction

* https://github.com/geosolutions-it/MapStore2/wiki/ReactJS-and-Redux-introduction

### ECMAScript 2015

* https://babeljs.io/docs/learn-es2015/

### ReactJS

* https://facebook.github.io/react/docs/thinking-in-react.html
* https://medium.com/@diamondgfx/learning-react-with-create-react-app-part-1-a12e1833fdc
* https://medium.com/@diamondgfx/learning-react-with-create-react-app-part-2-3ad99f38b48d
* https://medium.com/@diamondgfx/learning-react-with-create-react-app-part-3-322447d14192


### Redux

* http://redux.js.org/
* https://egghead.io/courses/getting-started-with-redux
* https://egghead.io/courses/building-react-applications-with-idiomatic-redux
