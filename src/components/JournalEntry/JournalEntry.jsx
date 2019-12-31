import React from 'react';

import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';

import TypeText from './TypeText';

const types = {
  text: TypeText,
};


const JournalEntry = ({ logDate, onDisclose, entries }) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle onClick={onDisclose}>{logDate}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {entries.map(entry => React.createElement(types[entry.type], {
          ...entry,
          key: `${logDate}--${entry.questionId}`,
        }))}
      </IonCardContent>
    </IonCard>
  )
}

export default JournalEntry;
