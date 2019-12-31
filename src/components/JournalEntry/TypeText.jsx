import React from 'react';

import {
  IonText,
} from '@ionic/react';

const TypeText = ({ question, answer }) => {
  if (!answer) {
    return null
  }

  return (
    <div style={{ margin: '15px 0' }}>
      <IonText>
        <b>{question}</b>
        <p>{answer}</p>
      </IonText>
    </div>
  )
}

export default TypeText;
