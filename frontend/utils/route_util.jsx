import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import { Route, Redirect } from 'react-router-dom';

// renders component if logged in, otherwise redirects to the login page
const Protected = ({ component: Component, path, loggedIn, exact }) => (
    <Route path={path} exact={exact} render={(props) => (
        loggedIn ? (
            <Component {...props} />
        ) : (
            <Redirect to="/" />
        )
    )} />
);

// access the Redux state to check if the user is logged in
const mapStateToProps = state => {
    return { loggedIn: Boolean(state.session.currentUser) && Boolean(state.session.currentUser.session_token) };
}

// connect Protected to the redux state
export const ProtectedRoute = withRouter(connect(mapStateToProps)(Protected));
