import React from 'react';
import { useAuth0 } from '../lib/my-auth0';

const styles = {
  wrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#888',
    fontSize: '10pt',
    fontStyle: 'italic',
  },
  inner: {
    marginBottom: '40vh',
  },
}

const LoadingCurtain = () => {
  const { isLoading } = useAuth0();

  return isLoading
    ? (
      <div style={styles.wrapper}>
        <div style={styles.inner}>loading...</div>
      </div>
    )
    : null;
};

export default LoadingCurtain
