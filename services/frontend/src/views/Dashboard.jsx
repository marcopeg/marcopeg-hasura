import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonFooter,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { basket, paper } from 'ionicons/icons'

import { withAuth } from '../lib/auth';
import ExpenseEntryModal from '../containers/ExpenseEntryModal';

const Dashboard = ({ auth }) => {
  const [ showExpenseModal, setShowExpenseModal ] = useState(false)

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
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
          routerLink="/expense"
          routerDirection="root"
        >
          <IonLabel>Expense History</IonLabel>
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
        <IonItem
          button
          lines="none"
          routerLink="/journal/notes"
          routerDirection="root"
        >
          <IonLabel>Open your Journal Notes</IonLabel>
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
