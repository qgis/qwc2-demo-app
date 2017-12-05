/**
 * Copyright 2016, Sourcepole AG.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const ReactDOM = require('react-dom');

const appConfig = require('./appConfig');

const LocaleUtils = require('../qwc2/MapStore2Components/utils/LocaleUtils');
LocaleUtils.setSupportedLocales(appConfig.supportedLocales);

const StandardApp = require('../qwc2/QWC2Components/components/StandardApp');

ReactDOM.render(
    <StandardApp appConfig={appConfig}/>,
    document.getElementById('container')
);
