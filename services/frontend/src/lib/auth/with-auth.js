import React, { useEffect } from 'react';
import { useAuth } from './auth0';

export const withAuth = (component, {
  returnTo = null,
  renderLoading = () => 'loading...',
  renderShield = () => null,
} = {}) => (props) => {
  const auth = useAuth();
  const { isAuthenticated, isReady, isLoading, login } = auth;

  useEffect(() => {
    if (isReady && !isAuthenticated && !isLoading) {
      login({ appState: {
        returnTo: returnTo || window.location.pathname,
      }})
    }
  }, [isReady, isAuthenticated, isLoading, login]);

  if (!isReady || isLoading) {
    return renderLoading ? renderLoading() : null
  }

  if (!isAuthenticated) {
    return renderShield ? renderShield() : null
  }

  return React.createElement(component, { ...props, auth })
};
