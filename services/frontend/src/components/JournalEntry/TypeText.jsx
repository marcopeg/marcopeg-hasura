import React from 'react';
import ReactMarkdown from "react-markdown";

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
        <ReactMarkdown className="markdown-text1" source={answer} />
      </IonText>
    </div>
  );
}

export default TypeText;
