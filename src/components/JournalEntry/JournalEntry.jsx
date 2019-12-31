import React from 'react';

import {
  IonItem,
  IonLabel,
} from '@ionic/react';

import IonAvatarDate from '../IonAvatarDate';

import TypeText from './TypeText';

const types = {
  text: TypeText,
};


const JournalEntry = ({ logDate, onDisclose, entries }) => {
  return (
    <IonItem onClick={onDisclose}>
      <IonAvatarDate date={logDate} />
      <IonLabel>
        {entries.map((entry, index) => React.createElement(types[entry.type], {
          ...entry,
          entries,
          entryIndex: index,
          key: `${logDate}--${entry.questionId}`,
        }))}
      </IonLabel>
    </IonItem>
  )
}

export default JournalEntry;
