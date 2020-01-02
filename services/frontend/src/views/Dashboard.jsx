import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { home } from 'ionicons/icons'

import { withAuth } from '../lib/auth';
import ExpenseEntryModal from '../containers/ExpenseEntryModal';

const Dashboard = ({ auth }) => {
  const [ showExpenseModal, setShowExpenseModal ] = useState(true)

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink="/" routerDirection="root">
              <IonIcon icon={home} />
            </IonButton>
          </IonButtons>
          <IonTitle>{auth.user.username}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

        <IonButton expand="block" routerLink="/journal">Open Journal</IonButton>
        <IonButton expand="block" onClick={() => setShowExpenseModal(true)}>Log Expense</IonButton>
        <IonButton expand="block" fill="clear" color="danger" onClick={auth.logout}>Logout</IonButton>

        <ExpenseEntryModal
          isOpen={showExpenseModal}
          onDismiss={() => setShowExpenseModal(false)}
        />
      </IonContent>
    </IonPage>
  )
};

export default withAuth(Dashboard);
