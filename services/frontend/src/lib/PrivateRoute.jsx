import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import { useAuth0 } from './auth0';

const PrivateRoute = ({ component: Component, path, location, ...rest }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  // useEffect(() => {
  //   const fn = async () => {
  //     if (!isAuthenticated) {
  //       await loginWithRedirect({
  //         appState: { targetUrl: location.pathname }
  //       });
  //     }
  //   };
  //   fn();
  // }, [isAuthenticated, loginWithRedirect, path, location]);

  const render = props =>
      isAuthenticated === true ? <Component {...props} /> : (
        <div onClick={loginWithRedirect}>login!</div>
      );

  return <Route path={path} render={render} {...rest} />;
  // return isAuthenticated ? 'logged' : 'noooo';
};

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  location: PropTypes.shape({
    pathName: PropTypes.string.isRequired,
  }).isRequired,
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};

export default withRouter(PrivateRoute);
