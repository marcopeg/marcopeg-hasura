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
  IonList,
  IonRefresher,
  IonRefresherContent,
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
  const { today, entries, loadMore, reload } = useJournalHistory();

  const reloadList = (evt) =>
    reload().finally(() => evt.detail.complete());

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Journal</IonTitle>
          <IonButtons slot="start">
            <IonButton routerLink={'/dashboard'} routerDirection={'root'}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={reloadList}>
          <IonRefresherContent
            pullingIcon="arrow-dropdown"
            pullingText="Pull to refresh"
            refreshingSpinner="circles"
            refreshingText="Refreshing...">
          </IonRefresherContent>
        </IonRefresher>
        <IonList lines={'full'}>
          {entries.map((entry) => (
            <JournalEntry
              {...entry}
              key={entry.logDate}
              onDisclose={() => {
                setLogDate(entry.logDate);
                setShowModal(true);
              }}
            />
          ))}
        </IonList>
        <IonButton
          onClick={loadMore}
          expand={'full'}
          fill={'clear'}
          size={'small'}
        >
          <IonIcon icon={add} /> load more
        </IonButton>
      </IonContent>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => {
          setLogDate(today);
          setShowModal(true);
        }}>
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
