import React from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonNote,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons'
import { withAuth } from '../lib/auth';
import useExpenseProjects from '../state/use-expense-projects';

const ExpenseHistory = () => {
  const { projects, transactions, reload } = useExpenseProjects();

  const reloadList = (evt) =>
    reload().finally(() => evt.detail.complete());

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Expenses</IonTitle>
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
        <IonItem>
          <IonLabel>Project:</IonLabel>
          <IonSelect
            interface="action-sheet"
            placeholder="Select a project:"
            value={projects.value}
            onIonChange={(e) => projects.setValue(e.target.value)}
          >
            {projects.options.map(({ value, label }) => (
              <IonSelectOption key={value} value={value}>{label}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <hr />
        <IonList>
          {transactions.map((transaction) => (
            <IonItem key={transaction.id}>
              <IonLabel>
                <p><small>{transaction.showCreatedAt}</small></p>
                <h3>{transaction.showCategory}, by {transaction.showReporter}</h3>
                {transaction.notes ? (
                  <p>{transaction.notes}</p>
                ) : null}
              </IonLabel>
              <IonNote>
                {transaction.showAmount}
              </IonNote>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default withAuth(ExpenseHistory);
