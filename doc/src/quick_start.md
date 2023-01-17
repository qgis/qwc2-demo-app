# Quick start

QWC2 is divided into two repositories:

- The QWC2 components, hosted at [https://github.com/qgis/qwc2/](https://github.com/qgis/qwc2/). This repository contains the core building blocks common to all QWC2 applications.
- The QWC2 application, an example is hosted at [https://github.com/qgis/qwc2-demo-app](https://github.com/qgis/qwc2-demo-app). This repository contains the user-specific configuration of the core components and can also include any other custom components.

Additionally, some QWC2 components (such as permalink generation, elevation queries, etc) require external services. Example implementations of such services are hosted at [https://github.com/sourcepole/qwc2-server](https://github.com/sourcepole/qwc2-server).

To work with QWC2, you will need a minimal development environment consisting of [git](https://git-scm.com/), [node](https://nodejs.org/) and [yarn](https://yarnpkg.com).

The fastest way to get started is by recursively cloning the demo application repository:

    $ git clone --recursive https://github.com/qgis/qwc2-demo-app.git

Next, install all required dependencies:

    $ cd qwc2-demo-app
    $ yarn install

Then, start a local development application:

    $ yarn start

The development application will run by default on `http://localhost:8081`. Note: if you are behind a proxy server, you'll need to [specify the proxy settings](qwc_configuration.md#generating-themesjson).

At this point, you can customize and configure the application according to your needs, as described in detail in the following chapters.

The final step is to compile a deployable application bundle for production:

    $ yarn run prod

You can then deploy the contents of the `prod` folder to your web server root. If you opt to deploy the application to a subfolder of the web server root, you will need to adjust the `assetsPath` and `translationsPath` settings in `config.json` accordingly.
