/**
 * Copyright 2016-2021 Sourcepole AG
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import StandardApp from 'qwc2/components/StandardApp';
import appConfig from './appConfig';
import '../icons/build/qwc2-icons.css';

ReactDOM.render(
    <StandardApp appConfig={appConfig}/>,
    document.getElementById('container')
);
