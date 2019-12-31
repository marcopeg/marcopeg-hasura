import React from 'react';
import { IonAvatar } from '@ionic/react';

const styles = {
  avatar: {
    marginRight: 20,
    fontSize: 7,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  year: {
    textTransform: 'uppercase',
  },
  day: {
    fontSize: 12,
  },
}

const IonAvatarDate = ({ date: inputDate }) => {
  const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
  const day = date.getDate().toString().padStart(2, 0);
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear().toString().substr(2, 4);

  return (
    <IonAvatar style={styles.avatar}>
      <div style={styles.day}>{day}</div>
      <div style={styles.year}>{month} {year}</div>
    </IonAvatar>
  )
}

export default React.memo(IonAvatarDate);
