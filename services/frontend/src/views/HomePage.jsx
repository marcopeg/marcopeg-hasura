import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from '@ionic/react';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>app.marcopeg.com</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>
          Welcome friend,
        </p>
        <p>
          This is a personal development project and it is not yet open to the public.
        </p>
        <p>
          If you are interested in joining in and try it out, you should be able to
          reach and ask to setup an account.
        </p>
        <IonButton
          expand="full"
          routerLink="/dashboard"
          routerDirection="none"
        >
          Login
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
