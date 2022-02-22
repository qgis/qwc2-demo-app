/**
 * Copyright 2016-2021 Sourcepole AG
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
Search provider interface:
--------------------------

  onSearch: function(text, requestId, searchOptions, dispatch, state) {
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

import axios from 'axios';
import {addSearchResults, SearchResultType} from "qwc2/actions/search";
import CoordinatesUtils from 'qwc2/utils/CoordinatesUtils';
import LocaleUtils from 'qwc2/utils/LocaleUtils';

function coordinatesSearch(text, requestId, searchOptions, dispatch) {
    const displaycrs = searchOptions.displaycrs || "EPSG:4326";
    const matches = text.match(/^\s*([+-]?\d+\.?\d*)[,\s]\s*([+-]?\d+\.?\d*)\s*$/);
    const items = [];
    if (matches && matches.length >= 3) {
        const x = parseFloat(matches[1]);
        const y = parseFloat(matches[2]);
        if (displaycrs !== "EPSG:4326") {
            items.push({
                id: "coord0",
                text: x + ", " + y + " (" + displaycrs + ")",
                x: x,
                y: y,
                crs: displaycrs,
                bbox: [x, y, x, y]
            });
        }
        if (x >= -180 && x <= 180 && y >= -90 && y <= 90) {
            const title = Math.abs(x) + (x >= 0 ? "°E" : "°W") + ", "
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
        if (x >= -90 && x <= 90 && y >= -180 && y <= 180 && x !== y) {
            const title = Math.abs(y) + (y >= 0 ? "°E" : "°W") + ", "
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
    const results = [];
    if (items.length > 0) {
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

/** ************************************************************************ **/

function geoAdminLocationSearch(text, requestId, searchOptions, dispatch) {
    axios.get("http://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=" + encodeURIComponent(text) + "&type=locations&limit=20")
        .then(response => dispatch(geoAdminLocationSearchResults(response.data, requestId)));
}

function parseItemBBox(bboxstr) {
    if (bboxstr === undefined) {
        return null;
    }
    const matches = bboxstr.match(/^BOX\s*\(\s*(\d+\.?\d*)\s*(\d+\.?\d*)\s*,\s*(\d+\.?\d*)\s*(\d+\.?\d*)\s*\)$/);
    if (matches && matches.length < 5) {
        return null;
    }
    const xmin = parseFloat(matches[1]);
    const ymin = parseFloat(matches[2]);
    const xmax = parseFloat(matches[3]);
    const ymax = parseFloat(matches[4]);
    return CoordinatesUtils.reprojectBbox([xmin, ymin, xmax, ymax], "EPSG:21781", "EPSG:4326");
}

function geoAdminLocationSearchResults(obj, requestId) {
    const categoryMap = {
        gg25: "Municipalities",
        kantone: "Cantons",
        district: "Districts",
        sn25: "Places",
        zipcode: "Zip Codes",
        address: "Address",
        gazetteer: "General place name directory"
    };
    const resultGroups = {};
    (obj.results || []).map(entry => {
        if (resultGroups[entry.attrs.origin] === undefined) {
            resultGroups[entry.attrs.origin] = {
                id: entry.attrs.origin,
                title: categoryMap[entry.attrs.origin] || entry.attrs.origin,
                items: []
            };
        }
        const x = entry.attrs.lon;
        const y = entry.attrs.lat;
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
    const results = Object.values(resultGroups);
    return addSearchResults({data: results, provider: "geoadmin", reqId: requestId}, true);
}

/** ************************************************************************ **/

function usterSearch(text, requestId, searchOptions, dispatch) {
    axios.get("https://webgis.uster.ch/wsgi/search.wsgi?&searchtables=&query=" + encodeURIComponent(text))
        .then(response => dispatch(usterSearchResults(response.data, requestId)));
}

function usterSearchResults(obj, requestId) {
    const results = [];
    let currentgroup = null;
    let groupcounter = 0;
    let counter = 0;
    (obj.results || []).map(entry => {
        if (!entry.bbox) {
            // Is group
            currentgroup = {
                id: "ustergroup" + (groupcounter++),
                title: entry.displaytext,
                items: []
            };
            results.push(currentgroup);
        } else if (currentgroup) {
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

function usterResultGeometry(resultItem, callback) {
    axios.get("https://webgis.uster.ch/wsgi/getSearchGeom.wsgi?searchtable=" + encodeURIComponent(resultItem.searchtable) + "&displaytext=" + encodeURIComponent(resultItem.text))
        .then(response => callback(resultItem, response.data, "EPSG:21781"));
}

/** ************************************************************************ **/

function nominatimSearchResults(obj, requestId) {
    const results = [];
    const groups = {};
    let groupcounter = 0;

    (obj || []).map(entry => {
        if (!(entry.class in groups)) {
            groups[entry.class] = {
                id: "nominatimgroup" + (groupcounter++),
                // capitalize class
                title: LocaleUtils.trWithFallback("search.nominatim." + entry.class, entry.class.charAt(0).toUpperCase() + entry.class.slice(1)),
                items: []
            };
            results.push(groups[entry.class]);
        }

        // shorten display_name
        let text = entry.display_name.split(', ').slice(0, 3).join(', ');
        // map label
        const label = text;

        // collect address fields
        const address = [];
        if (entry.address.town) {
            address.push(entry.address.town);
        }
        if (entry.address.city) {
            address.push(entry.address.city);
        }
        if (entry.address.state) {
            address.push(entry.address.state);
        }
        if (entry.address.country) {
            address.push(entry.address.country);
        }
        if (address.length > 0) {
            text += "<br/><i>" + address.join(', ') + "</i>";
        }

        // reorder coords from [miny, maxy, minx, maxx] to [minx, miny, maxx, maxy]
        const b = entry.boundingbox.map(coord => parseFloat(coord));
        const bbox = [b[2], b[0], b[3], b[1]];

        groups[entry.class].items.push({
            id: entry.place_id,
            // shorten display_name
            text: text,
            label: label,
            bbox: bbox,
            geometry: entry.geojson,
            x: 0.5 * (bbox[0] + bbox[2]),
            y: 0.5 * (bbox[1] + bbox[3]),
            crs: "EPSG:4326",
            provider: "nominatim"
        });
    });
    return addSearchResults({data: results, provider: "nominatim", reqId: requestId}, true);
}

function nominatimSearch(text, requestId, searchOptions, dispatch, cfg = {}) {
    axios.get("//nominatim.openstreetmap.org/search", {params: {
        'q': text,
        'addressdetails': 1,
        'polygon_geojson': 1,
        'limit': 20,
        'format': 'json',
        'accept-language': LocaleUtils.lang(),
        ...(cfg.params || {})
    }}).then(response => dispatch(nominatimSearchResults(response.data, requestId)));
}

/** ************************************************************************ **/

function parametrizedSearch(text, requestId, searchOptions, dispatch, cfg) {
    const SEARCH_URL = ""; // ...
    axios.get(SEARCH_URL + "?param=" + cfg.param + "&searchtext=" + encodeURIComponent(text))
        .then(response => dispatch(addSearchResults({data: response.data, provider: cfg.key, reqId: requestId})))
        .catch(() => dispatch(addSearchResults({data: [], provider: cfg.key, reqId: requestId})));
}

/** ************************************************************************ **/

function layerSearch(text, requestId, searchOptions, dispatch) {
    const results = [];
    if (text === "bahnhof") {
        const layer = {
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

/** ************************************************************************ **/

export const SearchProviders = {
    coordinates: {
        labelmsgid: "search.coordinates",
        onSearch: coordinatesSearch
    },
    geoadmin: {
        label: "Swisstopo",
        onSearch: geoAdminLocationSearch,
        requiresLayer: "a" // Make provider availability depend on the presence of a theme WMS layer
    },
    uster: {
        label: "Uster",
        onSearch: usterSearch,
        getResultGeometry: usterResultGeometry
    },
    nominatim: {
        label: "OpenStreetMap",
        onSearch: nominatimSearch
    },
    layers: {
        label: "Layers",
        onSearch: layerSearch
    }
};

export function searchProviderFactory(cfg) {
    // Note: cfg corresponds to an entry of the theme searchProviders array in themesConfig.json, in this case
    //   { key: <providerKey>, label: <label>, param: <param>, ...}
    // The entry must have at least a `key`
    if (!cfg.key) {
        return null;
    }
    if (cfg.key in SearchProviders) {
        return {
            label: cfg.label || cfg.key,
            onSearch: (text, requestId, searchOptions, dispatch) => SearchProviders[cfg.key].onSearch(text, requestId, searchOptions, dispatch, cfg),
            requiresLayer: cfg.layerName || SearchProviders[cfg.key].requiresLayer
        };
    }
    return {
        label: cfg.label || cfg.key,
        onSearch: (text, requestId, searchOptions, dispatch) => parametrizedSearch(text, requestId, searchOptions, dispatch, cfg),
        requiresLayer: cfg.layerName
    };
}
