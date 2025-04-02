QGIS Web Client Demo Application
================================

QGIS Web Client (QWC) is a modular next generation responsive web client for QGIS Server, built with ReactJS and OpenLayers.

**This repository contains an example skeleton for building a custom QWC application based on the [QWC stock application](https://github.com/qgis/qwc2).**

Consult the [QWC2 README](https://github.com/qgis/qwc2/blob/master/README.md) for information about QWC, and further links to documentation, sample viewers, etc.

# Quick start

To build a custom application based on the QWC stock application, follow these steps:

1. Clone this repository

       git clone https://github.com/qgis/qwc2-demo-app

2. Install dependencies

       yarn install

3. Run the development server

       yarn start

4. Edit `js/appConfig.js` to include your custom components

See [Building a custom viewer](https://qwc-services.github.io/master/configuration/ViewerConfiguration/#building-a-custom-viewer) for further information.

# Issues

Please report QWC issues at [issues](https://github.com/qgis/qwc2/issues).

# License

QWC is released under the terms of the [BSD license](https://github.com/qgis/qwc2-demo-app/blob/master/LICENSE).
