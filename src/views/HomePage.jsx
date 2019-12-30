import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>app.marcopeg.com</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      <p>
        Welcome friend!
      </p>
      <Link to="/dashboard">Dashboard</Link>
    </IonContent>
  </IonPage>
);

export default HomePage;
