import React from 'react';
import globalHook from 'use-global-hook';

const initialState = {
  changes: {},
};

const addJournalChanges = (store, changes) => {
  const data = changes.reduce((acc, curr) => ({
    ...acc,
    [`${curr.user_id}-${curr.journal_question.id}-${curr.created_at_day}`]: curr,
  }), {})

  store.setState({ changes: { ...store.state.changes, ...data }});
}

const resetJournalChanges = (store) => {
  store.setState({changes: {} });
}

export const useJournalChanges = globalHook(React, initialState, {
  addJournalChanges,
  resetJournalChanges,
});
