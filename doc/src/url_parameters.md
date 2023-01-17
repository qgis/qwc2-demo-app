# URL parameters

The following parameters can appear in the URL of the QWC2 application:

- `t`: The active theme
- `l`: The layers in the map, see below.
- `bl`: The visible background layer
- `st`: The search text
- `e`: The visible extent
- `c`: The center of the visible extent
- `s`: The current scale
- `crs`: The CRS of extent/center coordinates
- `hc`: If `c` is specified and `hc` is `true` or `1`, a marker is set at `c` when starting the application. Note: requires the `StartupMarkerPlugin` plugin to be active.

The `l` parameter lists all layers in the map (redlining and background layers) as a comma separated list of entries of the form

    <layername>[<transparency>]!

where
- `layername` is the WMS name of a theme layer or group, or a string of the format

      <wms|wfs>:<service_url>#<layername>
   for external layers, i.e. `wms:https://wms.geo.admin.ch/?#ch.are.bauzonen`.
- `<transparency>` denotes the layer transparency, betwen 0 and 100. If the `[<transparency>]` portion is omitted, the layer is fully opaque.
- `!` denotes that the layer is invisible. If omitted, the layer is visible.

*Note*: If group name is specified instead of the layer name, QWC2 will automatically resolve this to all layer names contained in that group, and will apply transparency and visibility settings as specified for the group.

The `urlPositionFormat` parameter in `config.json` determines whether the extent or the center and scale appears in the URL.

The `urlPositionCrs` parameter in `config.json` determines the projection to use for the extent resp. center coordinates in the URL. By default the map projection of the current theme is used. If `urlPositionCrs` is equal to the map projection, the `crs` parameter is omitted in the URL.

If the search text passed via `st` results in a unique result, the viewer automatically zooms to this result on startup. If the search result does not provide a bounding box, the `minScale` defined in the `searchOptions` of the `TopBar` configuration in `config.json` is used.
