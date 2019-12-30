import React, { useState } from 'react';
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
  IonModal,
} from '@ionic/react';
import { add, arrowBack } from 'ionicons/icons'
import { withAuth } from '../lib/auth';
import JournalEntry from './JournalEntry';

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
  const [ logDate, setLogDate ] = useState(formatDate(new Date()));
  const [ showModal, setShowModal ] = useState(false)

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Journal</IonTitle>
          <IonButtons slot="start">
            <IonButton routerLink={'/dashboard'} routerDirection={'back'}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton onClick={() => {
          setLogDate('2019-12-29')
          setShowModal(true)
        }}>2019-12-29</IonButton>
        <IonButton onClick={() => {
          setLogDate('2019-12-30')
          setShowModal(true)
        }}>2019-12-30</IonButton>
        <IonButton onClick={() => {
          setLogDate('2019-12-31')
          setShowModal(true)
        }}>2019-12-31</IonButton>
      </IonContent>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => setShowModal(true)}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
      <JournalEntry
        isOpen={showModal}
        logDate={logDate}
        onDismiss={() => setShowModal(false)}
      />
    </IonPage>
  );
};

export default withAuth(Journal);
