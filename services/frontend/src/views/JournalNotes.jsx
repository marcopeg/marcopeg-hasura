/* eslint-disable */

import React, { useState } from 'react';
import {
  IonPage,
  IonModal,
  IonContent,
  IonHeader,
  IonFooter,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonTextarea,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import { add, close, trash, checkmark, arrowBack } from 'ionicons/icons'
import { withAuth } from '../lib/auth';
import useJournalNotesEntries from '../state/use-journal-notes/entries';
import useJournalNotesForm from '../state/use-journal-notes/form';

const NEW_ITEM_ID = '$new';

const ModalUI = ({ title, values, submit, onDismiss, ...modalProps }) => {
  const handleSubmit = async () => {
    await submit();
    onDismiss();
  }
  return (
    <IonModal {...modalProps} onDidDismiss={onDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start" onClick={onDismiss}>
            <IonButton>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end" onClick={handleSubmit}>
            <IonButton>
              <IonIcon icon={checkmark} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem lines="none">
          <IonLabel position="floating">What's up?</IonLabel>
          <IonTextarea
            rows={25}
            value={values.text.value}
            onIonChange={(e) => values.text.update(e.target.value)}
          />
        </IonItem>
      </IonContent>
      <IonFooter>
        <IonButton expand="full" onClick={handleSubmit}>Save</IonButton>
      </IonFooter>
    </IonModal>
  );
};

const ModalNew = ({ ...modalProps }) => (
  <ModalUI
    {...modalProps}
    {...useJournalNotesForm()}
    title="New Note"
  />
);

const ModalEdit = ({ noteId, ...modalProps }) => {
  const formProps = useJournalNotesForm(noteId)
  return (
    <ModalUI
      {...modalProps}
      {...formProps}
      title={`Edit ${noteId}`}
    />
  );
};

const NoteModal = ({ noteId, ...modalProps }) => {
  const component = noteId === NEW_ITEM_ID ? ModalNew : ModalEdit;
  return React.createElement(component, {
    ...modalProps,
    noteId,
  });
};

const JournalNotes = () => {
  const { entries, remove, reload } = useJournalNotesEntries();
  const [ modal, setModal ] = useState({
    // noteId: NEW_ITEM_ID,
    noteId: 55,
    isOpen: true,
  });

  const closeModal = () => setModal({ ...modal, isOpen: false });
  const openModal = noteId => () => setModal({ ...modal, isOpen: true, noteId });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Journal Notes</IonTitle>
          <IonButtons slot="start">
            <IonButton routerLink={'/dashboard'} routerDirection={'root'}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={reload}>
          <IonRefresherContent />
        </IonRefresher>
        <IonList lines="full">
          {entries.map((note) => (
            <IonItemSliding key={note.id}>
              <IonItem onClick={openModal(note.id)}>
                <IonLabel class="ion-text-wrap">
                  <p>{note.created_at}</p>
                  <h4>{note.text}</h4>
                </IonLabel>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption color="danger" onClick={() => remove(note.id)}>
                  <IonIcon icon={trash} size="large" />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
      </IonContent>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={openModal(NEW_ITEM_ID)}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
      <NoteModal {...modal} onDismiss={closeModal} />
    </IonPage>
  );
};

export default withAuth(JournalNotes);
