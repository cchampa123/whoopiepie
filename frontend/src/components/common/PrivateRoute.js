import React, {useContext} from 'react';
import { Route, Redirect } from 'react-router-dom';
import {AuthContext} from './auth'

function PrivateRoute({ comp: Component, exact, path }) {

  const {user, setUser}  = useContext(AuthContext);

  if (user) {
    return (<Route exact={exact} path={path} render={(props) => <Component />}/>)
  } else {
    return(<Redirect to="/Login"/>)
  }
}

export default PrivateRoute;
