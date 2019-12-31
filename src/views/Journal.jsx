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
} from '@ionic/react';
import { add, arrowBack } from 'ionicons/icons'
import { withAuth } from '../lib/auth';
import JournalEntryModal from '../containers/JournalEntryModal';
import useJournalHistory from '../state/use-journal-history';
import JournalEntry from '../components/JournalEntry';

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
  const { entries, loadMore } = useJournalHistory();

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
        {entries.map((entry, i) => (
          <JournalEntry
            {...entry}
            key={entry.logDate}
            onDisclose={() => {
              setLogDate(entry.logDate);
              setShowModal(true);
            }}
          />
        ))}
        <hr />
        <button onClick={loadMore}>load more</button>
      </IonContent>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => setShowModal(true)}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
      <JournalEntryModal
        isOpen={showModal}
        logDate={logDate}
        onDismiss={() => setShowModal(false)}
      />
    </IonPage>
  );
};

export default withAuth(Journal);
