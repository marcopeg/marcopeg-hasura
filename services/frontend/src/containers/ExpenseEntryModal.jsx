import React from 'react';
import {
  IonModal,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonInput,
  IonDatetime,
  IonTextarea,
  IonIcon,
  IonList,
} from '@ionic/react';
import { close } from 'ionicons/icons'
import useExpenseEntry from '../state/use-expense-entry';

const ExpensesEntryModal = ({ onDismiss, ...modalProps }) => {
  const {
    project,
    category,
    amount,
    date,
    notes,
    options,
    submit,
  } = useExpenseEntry();

  return (
    <IonModal
      {...modalProps}
      onDidDismiss={onDismiss}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onDismiss}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle>Expenses</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={async () => {
              try {
                await submit();
                onDismiss();
              } catch (err) {
                alert(err.message);
              }
            }}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="fixed">Amount:</IonLabel>
          <IonInput
            type="number"
            inputmode="decimal"
            style={{ textAlign: 'right' }}
            value={amount.value}
            onIonChange={(e) => amount.setValue(e.target.value)}
          />
        </IonItem>
        {options.projects.length > 1 ? (
          <IonItem>
            <IonLabel>Project:</IonLabel>
            <IonSelect
              interface="action-sheet"
              placeholder="Select a project:"
              value={project.value}
              onIonChange={(e) => project.setValue(e.target.value)}
            >
              {options.projects.map(({ value, label }) => (
                <IonSelectOption key={value} value={value}>{label}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        ) : null}
        <IonItem>
          <IonLabel>Category:</IonLabel>
          <IonSelect
            interface="action-sheet"
            placeholder="Select a category:"
            value={category.value}
            onIonChange={(e) => category.setValue(e.target.value)}
          >
            {options.categories.map(({ value, label }) => (
              <IonSelectOption key={value} value={value}>{label}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel>When:</IonLabel>
          <IonDatetime
            displayFormat="MMM DD, YYYY"
            placeholder="Today"
            value={date.value.toString()}
            onIonChange={(e) => date.setValue(new Date(e.target.value))}
          />
        </IonItem>
        {/* <IonItem>
          <IonLabel position="floating">
            <IonLabel>Note:</IonLabel>
            <IonTextarea
              rows={4}
              placeholder="Enter any notes here..."
              value={notes.value}
              onIonChange={(e) => notes.setValue(e.target.value)}
            />

          </IonLabel>
        </IonItem> */}
        <IonItem>
          <IonLabel style={{ width: '100%' }}>
            <h4>Notes:</h4>
            <textarea
              rows={6}
              value={notes.value}
              onChange={(e) => notes.setValue(e.target.value)}
              style={{
                width: '100%',
                outline: 0,
              }}
            />
          </IonLabel>
        </IonItem>
      </IonContent>
    </IonModal>
  );
};

export default ExpensesEntryModal;
