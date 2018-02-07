/**
 * Copyright 2017, Sourcepole AG.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

function getFeature(layerId, mapPos, mapCrs, mapScale, dpi, callback) {
    console.log("Pick " + layerId + " at (" + mapPos[0] + ", " + mapPos[1] + "): " + mapCrs);
    let feature = null;
    setTimeout(() => callback(feature), 500);
}

function addFeature(layerId, feature, mapCrs, callback) {
    console.log("Add to layer " + layerId + ":");
    console.log(feature);
    let success = false;
    let errorMsg = "Commit failed";
    setTimeout(() => callback(success, errorMsg), 500);
}

function editFeature(layerId, feature, mapCrs, callback) {
    console.log("Commit to layer " + layerId + ":");
    console.log(feature);
    let success = false;
    let errorMsg = "Commit failed";
    setTimeout(() => callback(success, errorMsg), 500);
}

function deleteFeature(layerId, featureId, callback) {
    console.log("Delete feature from layer " + layerId + ":" + featureId);
    let success = false;
    let errorMsg = "Commit failed";
    setTimeout(() => callback(success, errorMsg), 500);
}

module.exports = {
    getFeature,
    addFeature,
    editFeature,
    deleteFeature
}
