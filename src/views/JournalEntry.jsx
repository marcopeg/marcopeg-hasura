import React from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
} from '@ionic/react';
import { withAuth } from '../lib/auth';
import useJournalEntry from '../state/use-journal-entry';
import JournalQuestion from '../components/JournalQuestion';

const Journal = ({ auth, match }) => {
  const { questions } = useJournalEntry(match.params.date);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Journal Entry <small>{match.params.date}</small></IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink={'/journal'}>
              Done
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
    </IonPage>
  );
};

export default withAuth(Journal);
