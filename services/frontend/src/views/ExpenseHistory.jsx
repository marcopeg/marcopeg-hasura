import React, { useState } from 'react';
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
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonNote,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
} from '@ionic/react';
import { arrowBack, trash, add } from 'ionicons/icons'
import ReactMarkdown from "react-markdown";
import { withAuth } from '../lib/auth';
import useExpenseProjects from '../state/use-expense/projects';
import ExpenseEntryModal from '../containers/ExpenseEntryModal';

const ExpenseHistory = () => {
  const { projects, transactions, reload, loadMore, remove } = useExpenseProjects();
  const [ showExpenseModal, setShowExpenseModal ] = useState(false);

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
        <IonRefresher slot="fixed" onIonRefresh={reload}>
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
            <IonItemSliding key={transaction.id}>
              <IonItem>
                <IonLabel>
                  <p><small>{transaction.showCreatedAt}</small></p>
                  <h3>{transaction.showCategory}, by {transaction.showReporter}</h3>
                  {transaction.notes ? (
                    <ReactMarkdown className="markdown-text1" source={transaction.notes} />
                  ) : null}
                </IonLabel>
                <IonNote>
                  {transaction.showAmount}
                </IonNote>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption color="danger" onClick={() => remove(transaction.id)}>
                  <IonIcon icon={trash} size="large" />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
        <IonButton
          fill="clear"
          expand="full"
          onClick={loadMore}
        >
          Load More
        </IonButton>
      </IonContent>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => setShowExpenseModal(true)}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
      <ExpenseEntryModal
        isOpen={showExpenseModal}
        onDismiss={() => setShowExpenseModal(false)}
      />
    </IonPage>
  );
};

export default withAuth(ExpenseHistory);
