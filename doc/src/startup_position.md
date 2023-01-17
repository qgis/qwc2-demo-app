# Startup position

By default, the viewer opens zooming on the respective theme extent, as defined in `themes.json` (and overrideable in `themesConfig.json`).

Alternatively, the following three options exist to influence the startup position:

- Pass appropriate `c`, `s` or `e` URL parameters, as documented in [URL parameters](url_parameters.md).
- Pass a search text which results in a unique result (i.e. a coordinate string) as URL parameter, as documented in [URL parameters](url_parameters.md).
- Set `startupMode` in the `LocateSupport` options of the `Map` configuration in `config.json`. Possible values are `DISABLED`, `ENABLED` or `FOLLOWING`. If a search text is passed via `st` URL parameter, the `startupMode` is ignored.
