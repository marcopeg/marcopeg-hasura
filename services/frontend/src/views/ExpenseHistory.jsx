import React, { useState, useEffect } from 'react';
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
import { useExpenseHistory } from "../state/use-expense/use-expense-history";
import ExpenseEntryModal from '../containers/ExpenseEntryModal';

const ExpenseHistory = props => {
  const {
    projects,
    transactions,
    reload,
    loadMore,
    remove
  } = useExpenseHistory();
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Workaround the select that doesn't seems to update
  // when the selected value change...
  const [projectId, setProjectId] = useState(null)
  const changeProjectId = e => {
    if (!projectId) return;
    if (e.target.value === projectId) return;
    if (projects.value === e.target.value) return;
    projects.setValue(e.target.value);
  };
  useEffect(() => {
    if (!projects.value || !projects.options.length) return () => {};
    setTimeout(() => setProjectId(projects.value));
  }, [projects.value, projects.options]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Expenses</IonTitle>
          <IonButtons slot="start">
            <IonButton routerLink={"/dashboard"} routerDirection={"root"}>
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
            refreshingText="Refreshing..."
          ></IonRefresherContent>
        </IonRefresher>
        <IonItem>
          <IonLabel>Project:</IonLabel>
          <IonSelect
            interface="action-sheet"
            placeholder="Select a project:"
            value={projectId}
            onIonChange={changeProjectId}
          >
            {projects.options.map(({ value, label }) => (
              <IonSelectOption key={value} value={value}>
                {label}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <hr />
        <IonList>
          {transactions.map(transaction => (
            <IonItemSliding key={transaction.id}>
              <IonItem>
                <IonLabel>
                  <p>
                    <small>{transaction.showCreatedAt}</small>
                  </p>
                  <h3>
                    {transaction.showCategory}, by {transaction.showReporter}
                  </h3>
                  {transaction.notes ? (
                    <ReactMarkdown
                      className="markdown-text1"
                      source={transaction.notes}
                    />
                  ) : null}
                </IonLabel>
                <IonNote>{transaction.showAmount}</IonNote>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption
                  color="danger"
                  onClick={() => remove(transaction.id)}
                >
                  <IonIcon icon={trash} size="large" />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
        <IonButton fill="clear" expand="full" onClick={loadMore}>
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
