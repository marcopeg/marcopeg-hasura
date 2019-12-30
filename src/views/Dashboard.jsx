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
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { withAuth } from '../lib/auth';

export const LOAD_QUESTIONS = gql`
  query loadQuestions {
    journal_questions {
      id
      data
      text
      type
    }
  }
`

const Dashboard = ({ auth }) => {
  const { loading, error, data, refetch } = useQuery(LOAD_QUESTIONS, { fetchPolicy: 'no-cache' });
  console.log(loading, error ? error.message : null, data);

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
