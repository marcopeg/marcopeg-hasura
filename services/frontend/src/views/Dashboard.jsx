import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonFooter,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel
} from '@ionic/react';
import { home, basket, paper } from 'ionicons/icons'

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
          <IonTitle>{auth.user.username || auth.user.email}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem
          button
          lines="none"
          onClick={() => setShowExpenseModal(true)}
        >
          <IonLabel>Log a new Expense</IonLabel>
          <IonIcon icon={basket} slot="start" />
        </IonItem>
        <IonItem
          button
          lines="none"
          routerLink="/journal"
          routerDirection="root"
        >
          <IonLabel>Open your Journal</IonLabel>
          <IonIcon icon={paper} slot="start" />
        </IonItem>
      </IonContent>
      <IonFooter>
        <IonButton expand="block" fill="clear" color="danger" onClick={auth.logout}>Logout</IonButton>
      </IonFooter>
      <ExpenseEntryModal
        isOpen={showExpenseModal}
        onDismiss={() => setShowExpenseModal(false)}
      />
    </IonPage>
  )
};

export default withAuth(Dashboard);
