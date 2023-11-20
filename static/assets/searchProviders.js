function usterSearch(text, searchParams, callback, axios) {
    const url = "https://webgis.uster.ch/wsgi/search.wsgi?&searchtables=&query=" + encodeURIComponent(text);
    axios.get(url).then(response => {
        const results = [];
        let currentgroup = null;
        let groupcounter = 0;
        let counter = 0;
        (response.data.results || []).map(entry => {
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
                    crs: "EPSG:21781"
                });
            }
        });
        callback({results: results});
    });
}


function usterResultGeometry(resultItem, callback, axios) {
    const url = "https://webgis.uster.ch/wsgi/getSearchGeom.wsgi?searchtable=" + encodeURIComponent(resultItem.searchtable) + "&displaytext=" + encodeURIComponent(resultItem.text);
    axios.get(url).then(response => {
        callback({geometry: response.data, crs: "EPSG:21781", hidemarker: false});
    });
}

/** ************************************************************************ **/

function geoAdminLocationSearch(text, searchParams, callback, axios) {
    const viewboxParams = {};
    if (searchParams.filterBBox) {
        viewboxParams.bbox = window.qwc2.CoordinatesUtils.reprojectBbox(searchParams.filterBBox, searchParams.mapcrs, "EPSG:2056").map(x => Math.round(x)).join(",");
    }
    const params = {
        searchText: text,
        type: "locations",
        limit: 20,
        sr: 2056,
        ...viewboxParams,
        ...(searchParams.cfgParams || {})
    };
    const url = "https://api3.geo.admin.ch/rest/services/api/SearchServer";
    axios.get(url, {params}).then(response => {
        const categoryMap = {
            gg25: "Municipalities",
            kantone: "Cantons",
            district: "Districts",
            sn25: "Places",
            zipcode: "Zip Codes",
            address: "Address",
            gazetteer: "General place name directory"
        };
        const parseItemBBox = (bboxstr) => {
            try {
                const matches = bboxstr.match(/^BOX\s*\(\s*(\d+\.?\d*)\s*(\d+\.?\d*)\s*,\s*(\d+\.?\d*)\s*(\d+\.?\d*)\s*\)$/);
                return matches.slice(1, 5).map(x => parseFloat(x));
            } catch (e) {
                return null;
            }
        };
        const resultGroups = {};
        (response.data.results || []).map(entry => {
            if (resultGroups[entry.attrs.origin] === undefined) {
                resultGroups[entry.attrs.origin] = {
                    id: entry.attrs.origin,
                    title: categoryMap[entry.attrs.origin] || entry.attrs.origin,
                    items: []
                };
            }
            const x = entry.attrs.y;
            const y = entry.attrs.x;
            resultGroups[entry.attrs.origin].items.push({
                id: entry.id,
                text: entry.attrs.label,
                x: x,
                y: y,
                crs: "EPSG:2056",
                bbox: parseItemBBox(entry.attrs.geom_st_box2d) || [x, y, x, y]
            });
        });
        const results = Object.values(resultGroups);
        callback({results: results});
    });
}

/** ************************************************************************ **/

window.QWC2SearchProviders = {
    geoadmin: {
        label: "Swisstopo",
        onSearch: geoAdminLocationSearch
    },
    uster: {
        label: "Uster",
        onSearch: usterSearch,
        getResultGeometry: usterResultGeometry
    }
};
