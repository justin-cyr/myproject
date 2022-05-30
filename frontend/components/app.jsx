import React from 'react';
import { Route } from 'react-router-dom';

import LoggedOutNavBar from './nav_bar/logged_out_nav_bar_container';
import LoggedInNavBar from './nav_bar/logged_in_nav_bar_container';
import SignupContainer from './session/signup_container';
import LoginContainer from './session/login_container';
import LogoutContainer from './session/logout_container';
import HomepageContainer from './homepage/homepage_container'

import { ProtectedRoute } from '../utils/route_util';

export default () => (
    <div>
        <Route exact path="/" component={LoggedOutNavBar} />
        <ProtectedRoute path="/" component={LoggedInNavBar}/>
        <Route path="/signup" component={SignupContainer} />
        <Route path="/login" component={LoginContainer} />
        <ProtectedRoute exact path="/homepage" component={HomepageContainer} />
        <Route path="/logout" component={LogoutContainer} />
    </div>
);
