/**
 * Copyright 2016, Sourcepole AG.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
  onSearch: function(text, searchOptions, dispatch) {
      let results = [ ... ]; // See below
      return searchResultLoaded({data: results}, true);
      // or
      return dispatch( (..) => {
        return searchResultLoaded({data: results}, true);
    });
  }

  getResultGeometry: function(resultItem, callback) {
    // ...
    callback(resultItem, geometryWktString);
  }

  getMoreResults: function(moreItem, text, dispatch) {
    // Same return object as onSearch
  }
}

  results = [
    {
        id: categoryid,
        title: display_title,
        items: [
            {
                id: itemid,
                text: display_text,
                x: x,
                y: y,
                crs: crs,
                bbox: [xmin, ymin, xmax, ymax],
                provider: providerid
            },
            {
                id: itemid,
                more: true,
                provider: providerid
            },
            {
                ...
            }
        ]
    },
    {
        ...
    }
  ]
*/

const axios = require('axios');
const {searchResultLoaded} = require("../qwc2/MapStore2/web/client/actions/search");

function geoAdminLocationSearch(text, searchOptions, dispatch) {
    axios.get("http://api3.geo.admin.ch/rest/services/api/SearchServer?searchText="+ encodeURIComponent(text) + "&type=locations&limit=20")
    .then(response => dispatch(geoAdminLocationSearchResults(response.data)));
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

function geoAdminLocationSearchResults(obj)
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
        resultGroups[entry.attrs.origin].items.push({
            id: entry.id,
            text: entry.attrs.label,
            x: entry.attrs.lon,
            y: entry.attrs.lat,
            crs: "EPSG:4326",
            bbox: parseItemBBox(entry.attrs.geom_st_box2d),
            provider: "geoadmin"
        });
    });
    let results = [];
    for(let key in resultGroups) {
        results.push(resultGroups[key]);
    }
    return searchResultLoaded({data: results}, true);
}

////////////////////////////////////////////////////////////////////////////////

function usterSearch(text, searchOptions, dispatch) {
    axios.get("https://webgis.uster.ch/wsgi/search.wsgi?&searchtables=&query="+ encodeURIComponent(text))
    .then(response => dispatch(usterSearchResults(response.data)));
}

function usterSearchResults(obj) {
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
    return searchResultLoaded({data: results}, true);
}

function usterResultGeometry(resultItem, callback)
{
    axios.get("https://webgis.uster.ch/wsgi/getSearchGeom.wsgi?searchtable="+ encodeURIComponent(resultItem.searchtable) + "&displaytext=" + encodeURIComponent(resultItem.text))
    .then(response => callback(resultItem, response.data, "EPSG:21781"));
}

////////////////////////////////////////////////////////////////////////////////

function wolfsburgSearch(text, searchOptions, dispatch) {
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
    }}).then(response => dispatch(wolfsburgSearchResults(response.data)));
}

function wolfsburgSearchResults(obj) {
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
    return searchResultLoaded({data: results}, true);
}

function wolfsburgResultGeometry(resultItem, callback) {
    axios.get("https://geoportal.stadt.wolfsburg.de/wsgi/getSearchGeom.wsgi", {params: {
        searchtable: resultItem.searchtable,
        id: resultItem.oid
    }}).then(response => callback(resultItem, response.data, "EPSG:25832"));
}

////////////////////////////////////////////////////////////////////////////////

function glarusSearch(text, searchOptions, dispatch) {
    let limit = 9;
    axios.get("https://map.geo.gl.ch/search/all?limit=" + limit + "&query="+ encodeURIComponent(text))
    .then(response => dispatch(glarusSearchResults(response.data, limit)));
}

function glarusMoreResults(moreItem, text, dispatch) {
    axios.get("https://map.geo.gl.ch/search/" + moreItem.category + "?query="+ encodeURIComponent(text))
    .then(response => dispatch(glarusSearchResults(response.data)));
}

function glarusSearchResults(obj, limit = -1) {
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
    return searchResultLoaded({data: results}, true);
}

function glarusResultGeometry(resultItem, callback) {
    axios.get("https://map.geo.gl.ch/search/" + resultItem.category + "/geometry?id=" + resultItem.id)
    .then(response => callback(resultItem, response.data, "EPSG:2056"));
}

module.exports = {
    /*"geoadmin": {
        onSearch: geoAdminLocationSearch,
    },*/
    /*"uster": {
        onSearch: usterSearch,
        getResultGeometry: usterResultGeometry
    },*/
    /*"wolfsburg": {
        onSearch: wolfsburgSearch,
        getResultGeometry: wolfsburgResultGeometry
    },*/
    "glarus": {
        onSearch: glarusSearch,
        getResultGeometry: glarusResultGeometry,
        getMoreResults: glarusMoreResults

    }
};
