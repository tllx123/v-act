/**
 * Copyright (c) 2015-present, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PublicUrl from './PublicUrl';

describe('PUBLIC_URL', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<PublicUrl />, div);
  });
});
