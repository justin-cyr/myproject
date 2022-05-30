import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

// CSS
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../styles/root.css';

import App from './app';

export default ({ store }) => (
    <Provider store={store}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>
)
