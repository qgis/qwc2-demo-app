/**
 * Copyright 2016, Sourcepole AG.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
Search provider interface:
--------------------------

  onSearch: function(text, requestId, searchOptions, dispatch) {
      let results = [ ... ]; // See below
      return addSearchResults({data: results, provider: providerId, reqId: requestId}, true);
      // or
      return dispatch( (...) => {
        return addSearchResults({data: results, provider: providerId, reqId: requestId}, true);
    });
  }

  getResultGeometry: function(resultItem, callback) {
    // ...
    callback(resultItem, geometryWktString);
  }

  getMoreResults: function(moreItem, text, requestId, dispatch) {
    // Same return object as onSearch
  }


Format of search results:
-------------------------

  results = [
    {
        id: categoryid,                     // Unique category ID
        title: display_title,               // Text to display as group title in the search results
        priority: priority_nr,              // Optional search result group priority. Groups with higher priority are displayed first in the list.
        items: [
            {                                 // Location search result:
                type: SearchResultType.PLACE,   // Specifies that this is a location search result
                id: itemid,                     // Unique item ID
                text: display_text,             // Text to display as search result
                label: map_label_text,          // Optional, text to show next to the position marker on the map instead of <text>
                x: x,                           // X coordinate of result
                y: y,                           // Y coordinate of result
                crs: crs,                       // CRS of result coordinates and bbox
                bbox: [xmin, ymin, xmax, ymax], // Bounding box of result (if non-empty, map will zoom to this extent when selecting result)
                provider: providerid            // The ID of the provider which generated this result. Required if `getResultGeometry` is to be called.
            },
            {                                   // Theme layer search result (advanced):
                type: SearchResultType.THEMELAYER, // Specifies that this is a theme layer search result
                id: itemid,                        // Unique item ID
                text: display_text,                // Text to display as search result
                layer: {<Layer definition>}        // Layer definition, in the same format as a "sublayers" entry in themes.json.
            },
            {                        // Optional entry to request more results:
                id: itemid,            // Unique item ID
                more: true,            // Specifies that this entry is a "More..." entry
                provider: providerid   // The ID of the provider which generated this result.
            }
        ]
    },
    {
        ...
    }
  ]

*/

const axios = require('axios');
const {addSearchResults, SearchResultType} = require("qwc2/actions/search");
const CoordinatesUtils = require('qwc2/utils/CoordinatesUtils');
const ProxyUtils = require('qwc2/utils/ProxyUtils');

function coordinatesSearch(text, requestId, searchOptions, dispatch) {
    let displaycrs = searchOptions.displaycrs || "EPSG:4326";
    let matches = text.match(/^\s*([+-]?\d+\.?\d*)[,\s]\s*([+-]?\d+\.?\d*)\s*$/);
    let items = [];
    if(matches && matches.length >= 3) {
        let x = parseFloat(matches[1]);
        let y = parseFloat(matches[2]);
        if(displaycrs !== "EPSG:4326") {
            items.push({
                id: "coord0",
                text: x + ", " + y + " (" + displaycrs + ")",
                x: x,
                y: y,
                crs: displaycrs,
                bbox: [x, y, x, y]
            });
        }
        if(x >= -180 && x <= 180 && y >= -90 && y <= 90) {
            let title = Math.abs(x) + (x >= 0 ? "°E" : "°W") + ", "
                      + Math.abs(y) + (y >= 0 ? "°N" : "°S");
            items.push({
                id: "coord" + items.length,
                text: title,
                x: x,
                y: y,
                crs: "EPSG:4326",
                bbox: [x, y, x, y]
            });
        }
        if(x >= -90 && x <= 90 && y >= -180 && y <= 180 && x != y) {
            let title = Math.abs(y) + (y >= 0 ? "°E" : "°W") + ", "
                      + Math.abs(x) + (x >= 0 ? "°N" : "°S");
            items.push({
                id: "coord" + items.length,
                text: title,
                x: y,
                y: x,
                crs: "EPSG:4326",
                bbox: [y, x, y, x]
            });
        }
    }
    let results = [];
    if(items.length > 0) {
        results.push(
            {
                id: "coords",
                titlemsgid: "search.coordinates",
                items: items
            }
        );
    }
    dispatch(addSearchResults({data: results, provider: "coordinates", reqId: requestId}, true));
}

////////////////////////////////////////////////////////////////////////////////

function geoAdminLocationSearch(text, requestId, searchOptions, dispatch) {
    axios.get("http://api3.geo.admin.ch/rest/services/api/SearchServer?searchText="+ encodeURIComponent(text) + "&type=locations&limit=20")
    .then(response => dispatch(geoAdminLocationSearchResults(response.data, requestId)));
}

function parseItemBBox(bboxstr) {
    if(bboxstr === undefined) {
        return null;
    }
    let matches = bboxstr.match(/^BOX\s*\(\s*(\d+\.?\d*)\s*(\d+\.?\d*)\s*,\s*(\d+\.?\d*)\s*(\d+\.?\d*)\s*\)$/);
    if(matches && matches.length < 5) {
        return null;
    }
    let xmin = parseFloat(matches[1]);
    let ymin = parseFloat(matches[2]);
    let xmax = parseFloat(matches[3]);
    let ymax = parseFloat(matches[4]);
    return CoordinatesUtils.reprojectBbox([xmin, ymin, xmax, ymax], "EPSG:21781", "EPSG:4326");
}

function geoAdminLocationSearchResults(obj, requestId)
{
    let categoryMap = {
        gg25: "Municipalities",
        kantone: "Cantons",
        district: "Districts",
        sn25: "Places",
        zipcode: "Zip Codes",
        address: "Address",
        gazetteer: "General place name directory"
    };
    let resultGroups = {};
    (obj.results || []).map(entry => {
        if(resultGroups[entry.attrs.origin] == undefined) {
            resultGroups[entry.attrs.origin] = {
                id: entry.attrs.origin,
                title: categoryMap[entry.attrs.origin] || entry.attrs.origin,
                items: []
            }
        }
        let x = entry.attrs.lon;
        let y = entry.attrs.lat;
        resultGroups[entry.attrs.origin].items.push({
            id: entry.id,
            text: entry.attrs.label,
            x: x,
            y: y,
            crs: "EPSG:4326",
            bbox: parseItemBBox(entry.attrs.geom_st_box2d) || [x, y, x, y],
            provider: "geoadmin"
        });
    });
    let results = [];
    for(let key in resultGroups) {
        results.push(resultGroups[key]);
    }
    return addSearchResults({data: results, provider: "geoadmin", reqId: requestId}, true);
}

////////////////////////////////////////////////////////////////////////////////

function usterSearch(text, requestId, searchOptions, dispatch) {
    axios.get(ProxyUtils.addProxyIfNeeded("https://webgis.uster.ch/wsgi/search.wsgi?&searchtables=&query="+ encodeURIComponent(text)))
    .then(response => dispatch(usterSearchResults(response.data, requestId)));
}

function usterSearchResults(obj, requestId) {
    let results = [];
    let currentgroup = null;
    let groupcounter = 0;
    let counter = 0;
    (obj.results || []).map(entry => {
        if(!entry.bbox) {
            // Is group
            currentgroup = {
                id: "ustergroup" + (groupcounter++),
                title: entry.displaytext,
                items: []
            };
            results.push(currentgroup);
        } else if(currentgroup) {
            currentgroup.items.push({
                id: "usterresult" + (counter++),
                text: entry.displaytext,
                searchtable: entry.searchtable,
                bbox: entry.bbox.slice(0),
                x: 0.5 * (entry.bbox[0] + entry.bbox[2]),
                y: 0.5 * (entry.bbox[1] + entry.bbox[3]),
                crs: "EPSG:21781",
                provider: "uster"
            });
        }
    });
    return addSearchResults({data: results, provider: "uster", reqId: requestId}, true);
}

function usterResultGeometry(resultItem, callback)
{
    axios.get(ProxyUtils.addProxyIfNeeded("https://webgis.uster.ch/wsgi/getSearchGeom.wsgi?searchtable="+ encodeURIComponent(resultItem.searchtable) + "&displaytext=" + encodeURIComponent(resultItem.text)))
    .then(response => callback(resultItem, response.data, "EPSG:21781"));
}

////////////////////////////////////////////////////////////////////////////////

function wolfsburgSearch(text, requestId, searchOptions, dispatch) {
    axios.get("https://geoportal.stadt.wolfsburg.de/wsgi/search.wsgi", {params: {
        query: text,
        searchTables: '["Infrastruktur", "Stadt- und Ortsteile"]',
        searchFilters: '["Abfallwirtschaft,Haltestellen,Hilfsorganisationen", ""]',
        searchArea: "Wolfsburg",
        searchCenter: "",
        searchRadius: "",
        topic: "stadtplan",
        resultLimit: 100,
        resultLimitCategory: 100
    }}).then(response => dispatch(wolfsburgSearchResults(response.data, requestId)));
}

function wolfsburgSearchResults(obj, requestId) {
    let results = [];
    let currentgroup = null;
    let groupcounter = 0;
    let counter = 0;
    (obj.results || []).map(entry => {
        if (!entry.bbox) {
            // Is group
            currentgroup = {
                id: "wolfsburggroup" + (groupcounter++),
                title: entry.displaytext,
                items: []
            };
            results.push(currentgroup);
        } else if (currentgroup) {
            currentgroup.items.push({
                id: "wolfsburgresult" + (counter++),
                text: entry.displaytext,
                searchtable: entry.searchtable,
                oid: entry.id,
                bbox: entry.bbox.slice(0),
                x: 0.5 * (entry.bbox[0] + entry.bbox[2]),
                y: 0.5 * (entry.bbox[1] + entry.bbox[3]),
                crs: "EPSG:25832",
                provider: "wolfsburg"
            });
        }
    });
    return addSearchResults({data: results, provider: "wolfsburg", reqId: requestId}, true);
}

function wolfsburgResultGeometry(resultItem, callback) {
    axios.get("https://geoportal.stadt.wolfsburg.de/wsgi/getSearchGeom.wsgi", {params: {
        searchtable: resultItem.searchtable,
        id: resultItem.oid
    }}).then(response => callback(resultItem, response.data, "EPSG:25832"));
}

////////////////////////////////////////////////////////////////////////////////

function glarusSearch(text, requestId, searchOptions, dispatch) {
    let limit = 9;
    axios.get("https://map.geo.gl.ch/search/all?limit=" + limit + "&query="+ encodeURIComponent(text))
    .then(response => dispatch(glarusSearchResults(response.data, requestId, limit)))
    .catch(error => dispatch(glarusSearchResults({}, requestId, limit)));
}

function glarusMoreResults(moreItem, text, requestId, dispatch) {
    axios.get("https://map.geo.gl.ch/search/" + moreItem.category + "?query="+ encodeURIComponent(text))
    .then(response => dispatch(glarusSearchResults(response.data, requestId)))
    .catch(error => dispatch(glarusSearchResults({}, requestId)));
}

function glarusSearchResults(obj, requestId, limit = -1) {
    let results = [];
    let idcounter = 0;
    (obj.results || []).map(group => {
        let groupResult = {
            id: group.category,
            title: group.name,
            items: group.features.map(item => { return {
                id: item.id,
                text: item.name,
                bbox: item.bbox.slice(0),
                x: 0.5 * (item.bbox[0] + item.bbox[2]),
                y: 0.5 * (item.bbox[1] + item.bbox[3]),
                crs: "EPSG:2056",
                provider: "glarus",
                category: group.category
            }})
        };
        if(limit >= 0 && group.features.length > limit) {
            groupResult.items.push({
                id: "glarusmore" + (idcounter++),
                more: true,
                provider: "glarus",
                category: group.category
            });
        }
        results.push(groupResult);
    });
    return addSearchResults({data: results, provider: "glarus", reqId: requestId}, true);
}

function glarusResultGeometry(resultItem, callback) {
    axios.get("https://map.geo.gl.ch/search/" + resultItem.category + "/geometry?id=" + resultItem.id)
    .then(response => callback(resultItem, response.data, "EPSG:2056"));
}

///////////////////////////////////////////////////////////////////////////////

function parametrizedSearch(cfg, text, requestId, searchOptions, dispatch)
{
    let SEARCH_URL = ""; // ...
    axios.get(SEARCH_URL + "?param=" + cfg.param + "&searchtext=" + encodeURIComponent(text))
        .then(response => dispatch(addSearchResults({data: response.data, provider: cfg.key, reqId: requestId})))
        .catch(error => dispatch(addSearchResults({data: [], provider: cfg.key, reqId: requestId})));
}

///////////////////////////////////////////////////////////////////////////////

function layerSearch(text, requestId, searchOptions, dispatch) {
    let results = [];
    if(text === "bahnhof") {
        let layer = {
            sublayers: [
                {
                    name: "a",
                    title: "a",
                    visibility: true,
                    queryable: true,
                    displayField: "maptip",
                    opacity: 255,
                    bbox: {
                        crs: "EPSG:4326",
                        bounds: [
                            8.53289,
                            47.3768,
                            8.54141,
                            47.3803
                        ]
                    }
                }
            ]
        };
        results.push({
            id: "layers",
            title: "Layers",
            items: [{
                type: SearchResultType.THEMELAYER,
                id: "bahnhof",
                text: "Bahnhof",
                layer: layer
            }]
        });
    }
    dispatch(addSearchResults({data: results, provider: "layers", reqId: requestId}, true));
}

////////////////////////////////////////////////////////////////////////////////

module.exports = {
    SearchProviders: {
        "coordinates": {
            label: "Coordinates",
            onSearch: coordinatesSearch
        },
        "geoadmin": {
            label: "Swisstopo",
            onSearch: geoAdminLocationSearch,
            requiresLayer: "a" // Make provider availability depend on the presence of a theme WMS layer
        },
        "uster": {
            label: "Uster",
            onSearch: usterSearch,
            getResultGeometry: usterResultGeometry
        },
        "wolfsburg": {
            label: "Wolfsburg",
            onSearch: wolfsburgSearch,
            getResultGeometry: wolfsburgResultGeometry
        },
        "glarus": {
            label: "Glarus",
            onSearch: glarusSearch,
            getResultGeometry: glarusResultGeometry,
            getMoreResults: glarusMoreResults
        },
        "layers": {
            label: "Layers",
            onSearch: layerSearch
        }
    },
    searchProviderFactory: (cfg) => {
        // Note: cfg corresponds to an entry of the theme searchProviders array in themesConfig.json, in this case
        //   { key: <providerKey>, label: <label>, param: <param>, ...}
        // The entry must have at least a `key`.
        return {
            label: cfg.label,
            onSearch: (text, requestId, searchOptions, dispatch) => parametrizedSearch(cfg, text, requestId, searchOptions, dispatch),
            requiresLayer: cfg.layerName
        };
    }
};
