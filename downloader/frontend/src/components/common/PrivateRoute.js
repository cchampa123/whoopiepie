import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ comp: Component, isAuthenticated, exact, path, token }) => (
        <Route exact={exact} path={path} render={(props) => (
            isAuthenticated
            ? <Component token = {token} />
            : <Redirect to="/Login"/>
        )} />
);

export default PrivateRoute;
