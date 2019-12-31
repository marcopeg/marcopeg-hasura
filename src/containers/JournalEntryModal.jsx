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

const JournalEntryModal = ({ logDate, onDismiss, ...modalProps }) => {
  const { questions, hasChanges } = useJournalEntry(logDate);

  return (
    <IonModal
      {...modalProps}
      onDidDismiss={onDismiss}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>{logDate}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDismiss}>
              {hasChanges ? '* Done' : 'Done'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {questions.map(question => (
          <JournalQuestion
            {...question}
            key={question.id}
          />
        ))}
      </IonContent>
    </IonModal>
  );
};

export default JournalEntryModal;
