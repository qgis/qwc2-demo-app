/**
 * Copyright 2017, Sourcepole AG.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * NOTE: This sample editing interface is designed to work with the counterpart at
 *       https://github.com/qwc-services/qwc-data-service
 *
 * You can use any other editing backend by implementing the getFeature, addFeature,
 * editFeature and deleteFeature methods as necessary.
 */
const axios = require('axios');
const assign = require('object-assign');
const {isEmpty} = require('lodash');
const CoordinatesUtils = require('qwc2/utils/CoordinatesUtils');
const ConfigUtils = require('qwc2/utils/ConfigUtils');
const ProxyUtils = require('qwc2/utils/ProxyUtils');


function buildErrMsg(err) {
    let message = "Commit failed";
    if(err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
        if(err.response.data.geometry_errors) {
            message += ":\n";
            message += err.response.data.geometry_errors.map(entry => " - " + entry.reason + " at " + entry.location);
        }
    }
    return message;
}

function getFeature(layerId, mapPos, mapCrs, mapScale, dpi, callback) {
    const SERVICE_URL = ConfigUtils.getConfigProp("editServiceUrl");

    // 5px tolerance
    let tol = (5.0 / dpi) * 0.0254 * mapScale;
    let bbox = (mapPos[0] - tol) + "," + (mapPos[1] - tol) + "," + (mapPos[0] + tol) + "," + (mapPos[1] + tol);

    let req = SERVICE_URL + layerId + '?bbox=' + bbox + '&crs=' + mapCrs;
    axios.get(ProxyUtils.addProxyIfNeeded(req)).then(response => {
        if(response.data && !isEmpty(response.data.features)) {
            let feature = response.data;
            callback(feature);
        } else {
            callback(null);
        }
    }).catch(err => callback(null));
}

function addFeature(layerId, feature, mapCrs, callback) {
    const SERVICE_URL = ConfigUtils.getConfigProp("editServiceUrl");
    let req = SERVICE_URL + layerId + '/';
    // Add CRS
    let epsgCode = mapCrs.split(':')[1];
    feature = assign({}, feature, {crs: {
        type: "name",
        properties: {name: "urn:ogc:def:crs:EPSG::" + epsgCode}
    }});

    axios.post(ProxyUtils.addProxyIfNeeded(req), feature).then(response => {
        callback(true);
    }).catch(err => callback(false, buildErrMsg(err)));
}

function editFeature(layerId, feature, mapCrs, callback) {
    const SERVICE_URL = ConfigUtils.getConfigProp("editServiceUrl");
    let req = SERVICE_URL + layerId + '/' + feature.id;
    // Add CRS
    let epsgCode = mapCrs.split(':')[1];
    feature = assign({}, feature, {crs: {
        type: "name",
        properties: {name: "urn:ogc:def:crs:EPSG::" + epsgCode}
    }});

    axios.put(ProxyUtils.addProxyIfNeeded(req), feature).then(response => {
        callback(true);
    }).catch(err => callback(false, buildErrMsg(err)));
}

function deleteFeature(layerId, featureId, callback) {
    const SERVICE_URL = ConfigUtils.getConfigProp("editServiceUrl");
    let req = SERVICE_URL + layerId + '/' + featureId;

    axios.delete(ProxyUtils.addProxyIfNeeded(req)).then(response => {
        callback(true);
    }).catch(err => callback(false, buildErrMsg(err)));
}

module.exports = {
    getFeature,
    addFeature,
    editFeature,
    deleteFeature
};
