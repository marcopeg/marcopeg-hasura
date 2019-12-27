/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import history from './history';

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);

export const Auth0Provider = ({
  children,
  rootURL = window.location.origin,
  rootURI = window.location.pathname,
  ...initOptions
}) => {
  const [ isReady, setIsReady ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isAuthenticated, setIsAuthenticated ] = useState(false);
  const [ client, setClient ] = useState(null);
  const [ user, setUser ] = useState(null);
  const [ token, setToken ] = useState(null);

  // Init Auth0 Client
  useEffect(() => {
    const initAuth0 = async () => {
      try {
        const client = await createAuth0Client(initOptions);
        const isAuthenticated = await client.isAuthenticated(false);

        if (window.location.search.includes("code=")) {
          try {
            const { appState } = await client.handleRedirectCallback();
            if (appState && appState.returnTo) {
              history.replace(appState.returnTo);
            } else {
              history.replace(rootURI);
            }
          } catch (err) {
            console.log('Error handling callbaclk', err.message)
          }
        }

        // Try to retrieve login info
        if (isAuthenticated) {
          const [user, token] = await Promise.all([
            client.getUser(),
            client.getTokenSilently(),
          ]);
          setUser(user);
          setToken(token);
          setIsAuthenticated(true);
        }

        setClient(client);
      } catch (err) {
        console.log('!!!!!!!!!!!!')
        console.error(err);
      } finally {
        setIsLoading(false);
        setIsReady(true);
      }
    }
    initAuth0();
  }, []); // eslint-disable-line

  const login = (payload) => {
    setIsLoading(true);
    client.loginWithRedirect(payload);
  }

  const logout = () => {
    setIsLoading(true);
    client.logout({ returnTo: rootURL });
  }


  return (
    <Auth0Context.Provider
      value={{
        // states
        isReady,
        isLoading,
        isAuthenticated,

        // data
        user,
        token,

        // api
        login,
        logout,
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};

export const withAuth = (component, {
  returnTo = null,
  renderLoading = () => 'loading...',
  renderShield = () => null,
} = {}) => (props) => {
  const auth = useAuth0();
  const { isAuthenticated, isReady, isLoading, login } = auth;

  useEffect(() => {
    if (isReady && !isAuthenticated && !isLoading) {
      login({ appState: {
        returnTo: returnTo || window.location.pathname,
      }})
    }
  }, [isReady, isAuthenticated, isLoading])

  if (!isReady || isLoading) {
    return renderLoading ? renderLoading() : null
  }

  if (!isAuthenticated) {
    return renderShield ? renderShield() : null
  }

  return React.createElement(component, { ...props, auth })
};
