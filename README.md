QGIS Web Client 2 Demo Application
==================================

Quick Start
-----------

Clone the repository with the --recursive option to automatically clone submodules:

    git clone --recursive git@github.com:sourcepole/qwc2-demo-app.git

Install NodeJS, if needed, from [here](https://nodejs.org/en/blog/release/v0.12.7/).

Start the development application locally:

    npm install
    npm start

The application runs at `http://localhost:8081` afterwards.


Configuration
--------------

### Application

There are four main configuration files:

 * `js/appConfig.js`: This file configures which components and which map
 projections are compiled into the application bundle. Changing this file will
 require a re-deployment of the application.

 * `config.js`: This file controls the plugin configuration (whether they are
 enabled in desktop/mobile plus plugin specific configuration) and also stores
 some global properties. This file can be changed without re-deploying the application.

 * `styleConfig.js`: This file contains variables for the main styling properties
 (mainly colors). Changing this file will require a re-deployment of the application.

 * `themesConfig.json`: This file configures the themes which will be available
 in the application, see below for details.

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
        "thumbnail": "<theme.png>",                 // optional image file in assets/img/mapthumbs/, use WMS GetMap if not set
        "attribution": "<Attribution>",             // optional theme attribution
        "attributionUrl": "<attribution URL>",      // optional theme attribution URL
        "default": true,                            // optional, set this as the initial theme
        "scales": [25000, 10000, 5000, 2500],       // optional custom map scales
        "tiled": true,                              // optional, use tiled WMS (default is false)
        "backgroundLayers": [                       // optional background layers
          {
            "name": "<background layer name>",      // background layer name from list below
            "printLayer": "<WMS layer name>",       // optional equivalent WMS layer name for printing
            "visibility": true                      // optional initial visibility on topic selection
          }
        ],
        "searchProviders": ["<search provider>"],   // optional search providers
        "additionalMouseCrs": ["<epsg code>"]       // optional list of additional CRS for mouse position (map projection and WGS84 are listed by default). Make sure proj defs are loaded in js/appConfig.js.
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
        "thumbnail": "<background.png>",            // optional image file in assets/img/mapthumbs/, use default.jpg if not set
        ...                                         // layer params (excluding "group" and "visibility")
      }
    ]
  },
  "defaultScales": [50000, 25000, 10000, 5000]      // optional default map scales
}
```

`npm run themesconfig` requests the capabilities of all WMS services and
generates a runtime configuration `themes.json`. It is automatically run on
`npm start`. To update the `themes.json` of a deployed application, just run
`npm run themesconfig` in the development tree and copy the resulting
`themes.json` to the production folder.


Deployment
----------

Run

    npm run prod

The files created inside `./prod` can then be deployed to a web server.


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
