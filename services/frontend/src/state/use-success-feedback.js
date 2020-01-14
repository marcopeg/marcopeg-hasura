import React from 'react';
import globalHook from 'use-global-hook';

const initialState = {
  isOpen: false,
  isStopped: true,
};

const actions = {
  show: (store) => {
    store.setState({ isOpen: true });
    setTimeout(() => store.setState({ isStopped: false }), 50);
  },
  hide: (store) => store.setState({
    isOpen: false,
    isStopped: true,
  }),
};

export const useSuccessFeedback = globalHook(React, initialState, actions);
