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
  const { questions, hasChanges } = useJournalEntry(logDate);

  const content = questions.length
    ? questions.map(question => (
        <JournalQuestion
          {...question}
          key={question.id}
        />
      ))
    : null;

  const doneLbl = hasChanges
      ? '* Done'
      : 'Done';

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
              {doneLbl}
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
