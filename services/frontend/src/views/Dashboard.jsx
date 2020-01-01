import React from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
} from '@ionic/react';
import { Link } from 'react-router-dom';
import { withAuth } from '../lib/auth';

const Dashboard = ({ auth }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div>
          Welcome {auth.user.email}
          <button onClick={auth.logout}>logout</button>
        </div>
        <Link to="/">home</Link>
        <br />
        <Link to="/journal">journal</Link>
        <hr />
        <IonButton routerLink="/">Go GOme</IonButton>
      </IonContent>
    </IonPage>
  )
};

export default withAuth(Dashboard);
