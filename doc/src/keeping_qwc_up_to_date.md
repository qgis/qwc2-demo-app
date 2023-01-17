# Keeping the QWC2 application up to date

As mentioned in the [quick start](quick_start.md) chapter, QWC2 is split into a common components repository and an application specific repository. The goal of this approach is to cleanly separate user-specific configuration and components which common components which serve as a basis for all QWC2 applications, and to make it as easy as possible to rebase the application onto the latest common QWC2 components.

The recommended workflow is to keep the `qwc2` folder a submodule referencing the [upstream qwc2 repository](https://github.com/qgis/qwc2). To update it, just checkout the desired tag, i.e.:

    cd qwc2
    git fetch
    git checkout <tag>

or update to the latest `master`, i.e.:

    cd qwc2
    git checkout master
    git pull

The [ChangeLog in the demo application repository](https://github.com/qgis/qwc2-demo-app/blob/master/ChangeLog.md) documents major changes, and in particular all incompatible changes between releases which require changes to the application specific code and/or configuration.
