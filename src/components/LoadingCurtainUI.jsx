import React from 'react';

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
    zIndex: 999999,
  },
  inner: {
    marginBottom: '40vh',
  },
}

const LoadingCurtainUI = ({ isVisible }) => {
  if (!isVisible) {
    return null
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.inner}>loading...</div>
    </div>
  );
};

export default LoadingCurtainUI
