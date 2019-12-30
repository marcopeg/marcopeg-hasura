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
import useJournalEntry from '../state/use-journal-entry';
import JournalQuestion from '../components/JournalQuestion';

const JournalEntry = ({ logDate, onDismiss, ...modalProps }) => {
  const { loading, questions } = useJournalEntry(logDate);

  const content = loading
    ? 'loading...'
    : questions.map(question => (
      <JournalQuestion
        {...question}
        key={question.id}
      />
    ))

  return (
    <IonModal {...modalProps} onDidDismiss={onDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{logDate}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDismiss}>
              Done
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {content}
      </IonContent>
    </IonModal>
  );
};

export default JournalEntry;
