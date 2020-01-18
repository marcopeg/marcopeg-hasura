import React from 'react';
import globalHook from 'use-global-hook';

const initialState = {
  projectId: null,
};

const actions = {
  setProjectId: (store, projectId) => {
    store.setState({ projectId });
  },
};

export const useGlobalExpense = globalHook(React, initialState, actions);
