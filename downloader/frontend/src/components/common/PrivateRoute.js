import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './auth.js'

function PrivateRoute({ comp: Component, exact, path }) {

  const { authTokens } = useAuth();

  return (
    <Route exact={exact} path={path} render={(props) => (
        (authTokens && authTokens!=='undefined')
        ? <Component />
        : <Redirect to="/Login"/>
        )}
      />
  )
}

export default PrivateRoute;
