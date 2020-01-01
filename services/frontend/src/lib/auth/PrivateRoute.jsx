import React, { useEffect } from 'react';
import { Route, withRouter } from "react-router-dom";
import { useAuth } from './auth0';

export const PrivateRouteComponent = ({ component: Component, path, location, ...rest }) => {
  const auth = useAuth();
  const { isAuthenticated, isReady, isLoading, login } = auth;

  useEffect(() => {
    if (isReady && !isAuthenticated && !isLoading) {
      login({ appState: {
        returnTo: location.pathname,
      }})
    }
  }, [isReady, isAuthenticated, isLoading, login, location.pathname]);

  const render = props =>
      isAuthenticated === true ? <Component {...props} auth={auth} /> : null;

  return <Route path={path} render={render} {...rest} />;
};

export const PrivateRoute = withRouter(PrivateRouteComponent);
