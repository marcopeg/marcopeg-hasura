import React from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/react';
import { add, arrowBack } from 'ionicons/icons'
import { withAuth } from '../lib/auth';

const formatDate = (date) => {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2)
      month = '0' + month;
  if (day.length < 2)
      day = '0' + day;

  return [year, month, day].join('-');
}

const Journal = () => {
  const today = formatDate(new Date());

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Journal</IonTitle>
          <IonButtons slot="start">
            <IonButton routerLink={'/dashboard'}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        --
      </IonContent>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton routerLink={`/journal/write/${today}`}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
    </IonPage>
  );
};

export default withAuth(Journal);
