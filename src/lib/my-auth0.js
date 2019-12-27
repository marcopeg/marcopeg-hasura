/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);

export const Auth0Provider = ({
  children,
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
            console.log(appState)
            // onRedirectCallback(appState);
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
        console.log('!!!!!!!!!!!!')
      } finally {
        setIsLoading(false);
        setIsReady(true);
      }
    }
    initAuth0();
  }, []); // eslint-disable-line

  const login = () => {
    console.log('login')
    setIsLoading(true);
    client.loginWithRedirect();
  }

  const logout = () => {
    console.log('logout!')
    setIsLoading(true);
    client.logout();
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

export const withAuth = (component) => (props) => {
  const auth = useAuth0();
  const { isAuthenticated, isReady, isLoading, login } = auth;

  useEffect(() => {
    if (isReady && !isAuthenticated && !isLoading) login()
  }, [isReady, isAuthenticated])

  if (!isReady || isLoading) {
    return 'loading....'
  }

  if (!isAuthenticated) {
    return 'need login'
  }

  return React.createElement(component, { ...props, auth })
};
