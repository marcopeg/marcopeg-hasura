/* eslint-disable */

import React from 'react';
import { useAppVersion } from '../state/use-app-version';
import { IonButton } from '@ionic/react';

const styles = {
  wrapper: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
};

const UpdateScreen = () => {
  const { shouldUpdate, next, update } = useAppVersion();

  if (!shouldUpdate) {
    return null;
  }

  return (
    <div style={styles.wrapper}>
        <p>Update available!</p>
        <p><small>{next.version}</small></p>
        <IonButton onClick={update}>Update!</IonButton>
    </div>
  )
}

export default UpdateScreen;
