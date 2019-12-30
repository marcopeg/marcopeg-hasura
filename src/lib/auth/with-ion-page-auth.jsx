import React, { useEffect } from 'react';
import { IonPage } from '@ionic/react';
import { useAuth } from './auth0';

export const withIonPageAuth = (component, {
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

  let content = null;
  if (!isReady || isLoading) {
    content = renderLoading ? renderLoading() : null;
  } else if (!isAuthenticated) {
    content = renderShield ? renderShield() : null;
  } else {
    content = React.createElement(component, { ...props, auth });
  }

  return (
    <IonPage>
      {content}
    </IonPage>
  );
};


/*
export const withIonPageAuth = (Component) => {
  const auth = useAuth();
  const { isAuthenticated, isReady, isLoading, login } = auth;

  useEffect(() => {
    if (isReady && !isAuthenticated && !isLoading) {
      login({ appState: {
        returnTo: window.location.pathname,
      }})
    }
  }, [isReady, isAuthenticated, isLoading, login]);

  return (
    <IonPage>
      {isAuthenticated === true ? <Component {...props} auth={auth} /> : null}
    </IonPage>
  );
};
*/
