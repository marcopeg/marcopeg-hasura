import React from 'react';
import globalHook from 'use-global-hook';

const initialState = {
  records: [],
};

const addJournalRecords = (store, records) => {
  const data = records.reduce((acc, curr) => ({
    ...acc,
    [`${curr.user_id}-${curr.question_id}-${curr.created_at_day}`]: curr,
  }), {})

  store.setState({ records: { ...store.state.records, ...data }});
}

const resetJournalRecords = (store) => {
  store.setState({ records: {} });
}

export const useJournalChanges = globalHook(React, initialState, {
  addJournalRecords,
  resetJournalRecords,
});
