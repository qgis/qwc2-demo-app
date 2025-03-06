QGIS Web Client 2 Demo Application
==================================

QGIS Web Client 2 (QWC2) is a modular next generation responsive web client for QGIS Server, built with ReactJS and OpenLayers.

**This repository contains an example skeleton for building a custom QWC2 application based on the [QWC2 stock application](https://github.com/qgis/qwc2).**

Consult the [QWC2 README](https://github.com/qgis/qwc2/blob/master/README.md) for information about QWC2, and further links to documentation, sample viewers, etc.

# Quick start

To build a custom application based on the QWC2 stock application, follow these steps:

1. Clone this repository

       git clone --recursive https://github.com/qgis/qwc2-demo-app

2. Make sure the submodule is up to date

       cd qwc2
       git pull

3. Install dependencies

       yarn install

5. Run the development server

       yarn start

6. Edit `js/appConfig.js` to include your custom components

See [Building a custom viewer](https://qwc-services.github.io/master/configuration/ViewerConfiguration/#building-a-custom-viewer) for further information.

# Issues

Please report QWC2 issues at [issues](https://github.com/qgis/qwc2/issues).

# License

QWC2 is released under the terms of the [BSD license](https://github.com/qgis/qwc2-demo-app/blob/master/LICENSE).
