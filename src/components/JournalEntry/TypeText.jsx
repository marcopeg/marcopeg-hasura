import React from 'react';

import {
  IonText,
} from '@ionic/react';

const TypeText = ({ question, answer, entries }) => {
  if (!answer) {
    return null
  }

  return (
    <div>
      <IonText>
        {entries.length > 1 ? <b>{question}</b> : null}
        <p>{answer}</p>
      </IonText>
    </div>
  )
}

export default TypeText;
