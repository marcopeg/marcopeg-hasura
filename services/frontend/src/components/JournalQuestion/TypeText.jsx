import React from 'react';
import {
  IonItem,
  IonLabel,
  IonTextarea,
} from '@ionic/react';

const TypeText = ({
  question,
  questionData,
  answer,
  answerData,
  updateAnswer,
}) => (
  <IonItem>
    <IonLabel position="floating">{question}</IonLabel>
    <IonTextarea
      autocapitalize={true}
      {...questionData}
      value={answer}
      onIonChange={(e) => updateAnswer(e.target.value, answerData)}
    />
  </IonItem>
);

export default TypeText;
