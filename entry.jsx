import React from "react";
import ReactDOM from "react-dom";

import createStore from './frontend/store/store';
import Root from './frontend/components/root';

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("root");
    
    let preloadedState = {};
    if (window.currentUser) {
        preloadedState = {
            ...preloadedState,
            session: { currentUser: window.currentUser.user }
        };
    }

    const store = createStore(preloadedState);
    window.getState = store.getState;
    window.dispatch = store.dispatch;
    
    ReactDOM.render(<Root store={store} />, root);
}); 
