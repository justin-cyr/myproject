import React from 'react';
import { Route } from 'react-router-dom';

import SignupContainer from './session/signup_container';
import LoginContainer from './session/login_container';
import LogoutContainer from './session/logout_container';

export default () => (
    <div>
        <Route path="/signup" component={SignupContainer} />
        <Route path="/login" component={LoginContainer} />
        <Route path="/logout" component={LogoutContainer} />
    </div>
);
