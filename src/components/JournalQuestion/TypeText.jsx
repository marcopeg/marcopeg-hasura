import React from 'react';
import {
  IonItem,
  IonLabel,
  IonTextarea,
} from '@ionic/react';

const TypeText = ({ question, answer, updateValue }) => (
  <IonItem>
    <IonLabel position="floating">{question.text}</IonLabel>
    <IonTextarea
      {...question.data}
      value={answer.text}
      onIonChange={(e) => updateValue(e.target.value, answer.data)}
    />
  </IonItem>
);

export default TypeText;
