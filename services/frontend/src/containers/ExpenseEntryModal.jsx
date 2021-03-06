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
  IonNote,
} from '@ionic/react';
import { close } from 'ionicons/icons'
import { useExpenseEntry  } from "../state/use-expense/use-expense-entry";

const ExpensesEntryModal = ({ onDismiss, ...modalProps }) => {
  const {
    title,
    project,
    category,
    reporter,
    amount,
    date,
    notes,
    options,
    submit,
  } = useExpenseEntry();

  return (
    <IonModal {...modalProps} onDidDismiss={onDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onDismiss}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={async () => {
                try {
                  await submit();
                  onDismiss();
                } catch (err) {
                  alert(err.message);
                  console.log(err);
                }
              }}
            >
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
            placeholder={project.placeholder}
            style={{ textAlign: "right" }}
            value={amount.value}
            onIonChange={e => amount.setValue(e.target.value)}
          />
          {project.currency ? (
            <IonNote slot="end">{project.currency}</IonNote>
          ) : null}
        </IonItem>
        {options.projects.length > 1 ? (
          <IonItem>
            <IonLabel>Project:</IonLabel>
            <IonSelect
              interface="popover"
              placeholder="Select a project:"
              value={project.value}
              onIonChange={e => project.setValue(e.target.value)}
            >
              {options.projects.map(({ value, label }) => (
                <IonSelectOption key={value} value={value}>
                  {label}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        ) : null}
        {options.categories.length > 1 ? (
          false // Switch between list of button and select
            ? (
              <IonItem>
                <div
                  style={{
                    width: "100%",
                    marginTop: 8,
                    display: "flex",
                    justifyContent: "space-between"
                  }}
                >
                  <IonLabel>Category:</IonLabel>
                  <div style={{ flex: "1", marginLeft: "15%" }}>
                    {options.categories.map(({ value, label }) => (
                      <IonButton
                        key={value}
                        size="small"
                        expand="block"
                        color={value === category.value ? "dark" : "medium"}
                        fill={value === category.value ? "clear" : "clear"}
                        onClick={() => category.setValue(value)}
                      >
                        <div style={{ width: "100%", textAlign: "right" }}>
                          {label}
                        </div>
                      </IonButton>
                    ))}
                  </div>
                </div>
              </IonItem>
            )
            : (
              <IonItem>
                <IonLabel>Category:</IonLabel>
                <IonSelect
                  interface="popover"
                  placeholder="Select a category:"
                  value={category.value}
                  onIonChange={e => category.setValue(e.target.value)}
                >
                  {options.categories.map(({ value, label }) => (
                    <IonSelectOption key={value} value={value}>
                      {label}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            )
        ) : null}
        {options.reporters.length > 1 ? (
          <IonItem>
            <IonLabel>Reported by:</IonLabel>
            <IonSelect
              interface="popover"
              placeholder="Select a reporter:"
              value={reporter.value}
              onIonChange={e => reporter.setValue(e.target.value)}
            >
              {options.reporters.map(({ value, label }) => (
                <IonSelectOption key={value} value={value}>
                  {label}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        ) : null}
        <IonItem>
          <IonLabel>When:</IonLabel>
          <IonDatetime
            displayFormat="MMM DD, YYYY"
            placeholder="Today"
            value={date.value.toString()}
            onIonChange={e => date.setValue(new Date(e.target.value))}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Note:</IonLabel>
          <IonTextarea
            rows={4}
            autocapitalize={true}
            placeholder="Enter any notes here..."
            value={notes.value}
            onIonChange={e => notes.setValue(e.target.value)}
          />
        </IonItem>
      </IonContent>
    </IonModal>
  );
};

export default ExpensesEntryModal;
