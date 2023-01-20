# Server-side configuration

## Cross-Origin requests

All modern browsers will block a page from requesting resources from another origin (except for images, stylesheets, scripts, iframes and videos), unless the response from the remote origin contains a matching `Access-Control-Allow-Origin` header. An origin is defined as `<scheme>://<hostname>:<port>`.

For each service QWC2 interacts with, in particular the QGIS Server, one has to ensure that this interaction isn't blocked by the browser. The following options exist:

- Ensure that the service runs on the same origin as the web server which serves the QWC2 application.
- Ensure that the service sends a `Access-Control-Allow-Origin` header with matching origin with each response.
- Use a proxy service which ensures the `Access-Control-Allow-Origin` are added. The URL to this service needs to be specified as `proxyServiceUrl` in the `config.json` file. A sample implementation of such a proxy service is available [in the qwc2-server repository](https://github.com/sourcepole/qwc2-server).

## Filenames of print and raster and DXF export

The QGIS server response for the print, raster and DXF export requests does by default not contain any `Content-Disposition` header, meaning that browsers will attempt to guess a filename, which typically is the last part of the URL, without any extension.

To ensure browser use a proper filename, the following options exist:

- Configure the web server running QGIS Server to add a suitable `Content-Disposition` header to the response. In the case of Apache, the rule for the print output might look as follows:

      SetEnvIf Request_URI "^/wms.*/(.+)$" project_name=$1
      Header always setifempty Content-Disposition "attachment; filename=%{project_name}.pdf" "expr=%{CONTENT_TYPE} = 'application/pdf'"

  This rule will use the last part of the URL as basename and add the `.pdf` extension, and will also ensure that the content-type is set to `application/pdf`. Note that this example uses the `setenvif` and `headers` apache modules.
- Use a proxy service which adds a `Content-Disposition` header if necessary. QWC2 helps in this regard by automatically adding a `filename=<filename>` query parameter if `proxyServiceUrl` is set in `config.json` for requests which are expected to return a downloadable file. See the sample proxy service [in the qwc2-server repository](https://github.com/sourcepole/qwc2-server) for details.
