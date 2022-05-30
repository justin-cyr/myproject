import React from 'react';
import { Route } from 'react-router-dom';

import LoggedOutNavBar from './nav_bar/logged_out_nav_bar_container';
import SignupContainer from './session/signup_container';
import LoginContainer from './session/login_container';
import LogoutContainer from './session/logout_container';

export default () => (
    <div>
        <Route exact path="/" component={LoggedOutNavBar} />
        <Route path="/signup" component={SignupContainer} />
        <Route path="/login" component={LoginContainer} />
        <Route path="/logout" component={LogoutContainer} />
    </div>
);
