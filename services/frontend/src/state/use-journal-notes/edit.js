/* eslint-disable */

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { LOAD_JOURNAL_NOTE, UPDATE_JOURNAL_NOTE } from './lib/graphql';

const noop = () => {};
const INITIAL_VALUES = { text: '' };

const useJournalNotesEdit = (noteId) => {
  const {
    loading: noteIsLoading,
    data: noteData,
    error: noteError,
  } = useQuery(LOAD_JOURNAL_NOTE, { variables: { noteId }});
  const [ updateNote ] = useMutation(UPDATE_JOURNAL_NOTE);
  const [ values, setValues ] = useState(INITIAL_VALUES);
  const [ initialValues, setInitialValues ] = useState(INITIAL_VALUES);

  const reset = () => {
    setValues(initialValues);
  };

  const submit = async () => {
    const variables = { ...values, noteId };
    await updateNote({ variables });
  };

  // Populate the initial values for the edit form
  useEffect(() => {
    if (noteIsLoading || noteError) return noop;
    if (!noteData.journal_notes.length) return noop;

    const initialValues = { ...values, text: noteData.journal_notes[0].text };
    setValues(initialValues);
    setInitialValues(initialValues);
  }, [ noteIsLoading, noteError, noteData ]);

  return {
    submit,
    reset,
    values: {
      text: {
        options: {
          readonly: noteIsLoading,
        },
        value: values.text,
        update: v => setValues({ ...values, text: v }),
      },
    },
  };
};

export default useJournalNotesEdit;
