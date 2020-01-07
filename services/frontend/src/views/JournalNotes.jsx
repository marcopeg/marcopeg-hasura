/* eslint-disable */

import React, { useState } from 'react';
import {
  IonPage,
  IonModal,
  IonContent,
  IonHeader,
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
import { add, trash, arrowBack } from 'ionicons/icons'
import { withAuth } from '../lib/auth';
import useJournalNotesEntries from '../state/use-journal-notes/entries';
import useJournalNotesUpsert, { NEW_ITEM_ID } from '../state/use-journal-notes/upsert';

const ModalUI = ({ title, values, hasChanges, onDismiss, ...modalProps }) => {
  return (
    <IonModal {...modalProps} onDidDismiss={onDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end" onClick={onDismiss}>
            <IonButton>
              {hasChanges ? <small>Saving...</small> : 'Done'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem lines="none">
          <IonLabel position="floating">What's up?</IonLabel>
          <IonTextarea
            {...values.text.options || {}}
            rows={25}
            value={values.text.value}
            onIonChange={(e) => values.text.update(e.target.value)}
          />
        </IonItem>
      </IonContent>
    </IonModal>
  );
};

const NoteModal = ({ noteId, ...modalProps }) => {
  return (
    <ModalUI
      {...modalProps}
      {...useJournalNotesUpsert(noteId)}
    />
  );
};

const JournalNotes = () => {
  const { entries, remove, reload, loadMore } = useJournalNotesEntries();
  const [ modal, setModal ] = useState({
    noteId: NEW_ITEM_ID,
    isOpen: false,
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
        <IonButton fill="clear" expand="block" onClick={loadMore}>Load More</IonButton>
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
