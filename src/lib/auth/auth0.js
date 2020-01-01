import React, { useState, useEffect, useContext } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import history from '../history';

const REACT_APP_DEV_TOKEN = process.env.REACT_APP_DEV_TOKEN;

export const Auth0Context = React.createContext();
export const useAuth = () => useContext(Auth0Context);

/**
 * AuthProvider -- DEVELOPMENT
 * returns a static user info and completely skips Auth0
 */
const AuthProviderDev = ({ children }) => {
  const [ user, secret ] = REACT_APP_DEV_TOKEN.split('@');
  const [ userId, userRole ] = user.split(':');

  // try to get dev user info from environment variables
  let userData = null;
  try {
    userData = JSON.parse(process.env.REACT_APP_DEV_USER);
  } catch (err) {} // eslint-disable-line

  return (
    <Auth0Context.Provider
      value={{
        // states
        isReady: true,
        isLoading: false,
        isAuthenticated: true,

        // data
        user: userData || {
          username: 'John Doe',
          email: 'jdoe@foobar.com',
        },
        token: {
          'x-hasura-admin-secret': secret,
          'x-hasura-role': userRole,
          'x-hasura-user-id': userId,
        },

        // api
        login: () => {},
        logout: () => {},
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};

/**
 * AuthProvider -- PRODUCTION
 * Runs through the normal Auth0 flow
 */
const AuthProviderProd = ({
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

export const AuthProvider = REACT_APP_DEV_TOKEN
  ? AuthProviderDev
  : AuthProviderProd;
