import React from 'react';
import {
  IonModal,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
} from '@ionic/react';
// import useJournalEntry from '../state/use-journal-entry';
// import JournalQuestion from '../components/JournalQuestion';

const ExpensesEntryModal = ({ onDismiss, ...modalProps }) => {
  // const { questions, hasChanges } = useJournalEntry(logDate);

  return (
    <IonModal
      {...modalProps}
      onDidDismiss={onDismiss}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onDismiss}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Expenses</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDismiss}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        expenses...
      </IonContent>
    </IonModal>
  );
};

export default ExpensesEntryModal;
