/* eslint-disable */

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { LOAD_JOURNAL_NOTE, UPDATE_JOURNAL_NOTE, INSERT_JOURNAL_NOTE } from './lib/graphql';
import { updateCacheAfterCreate } from './lib/cache';

export const NEW_ITEM_ID = '$new';
const INITIAL_VALUES = { id: NEW_ITEM_ID, text: '' };
const noop = () => {};

const useJournalNotesUpsert = (noteId) => {
  const submitTimer = useRef(null);
  const [ values, setValues ] = useState(INITIAL_VALUES);
  const [ initialValues, setInitialValues ] = useState(INITIAL_VALUES);

  const {
    loading: noteIsLoading,
    data: noteData,
    error: noteError,
  } = useQuery(LOAD_JOURNAL_NOTE, { variables: { noteId }});

  const [ updateNote ] = useMutation(UPDATE_JOURNAL_NOTE);
  const [ createNote ] = useMutation(INSERT_JOURNAL_NOTE, { update: updateCacheAfterCreate });

  const submit = async () => {
    try {
      // console.log('@submit', initialValues.id)
      const { id } = initialValues;
      if (id === NEW_ITEM_ID) {
        const { text } = values;
        const variables = { text };
        // console.log('@create', variables);
        const res = await createNote({ variables })
        setInitialValues(res.data.insert_journal_notes.returning[0]);
      } else {
        const { text } = values;
        const variables = { noteId: id, text };
        // console.log('@update', variables);
        const res = await updateNote({ variables });
        setInitialValues(res.data.update_journal_notes.returning[0]);
      }
    } catch (err) {
      console.error('@@submit', err.message)
    }
  };

  // Populate the initial values for the edit form
  useEffect(() => {
    if (noteIsLoading || noteError) return noop;

    const initialValues = (noteData && noteData.journal_notes)
      ? { ...noteData.journal_notes[0] }
      : { ...INITIAL_VALUES };

    // console.log('@initialValues', initialValues);
    setValues(initialValues);
    setInitialValues(initialValues);
  }, [ noteId, noteIsLoading, noteError, noteData ]);

  // Auto save
  // @TODO: skip first load
  useEffect(() => {
    clearTimeout(submitTimer.current);
    submitTimer.current = setTimeout(submit, 500);
  }, [values])

  return {
    submit,
    title: values.text.length ? values.text.substring(0, 20) : 'New Note',
    hasChanges: values.text !== initialValues.text,
    values: {
      text: {
        options: {
          readonly: false,
        },
        value: values.text,
        update: (text) => setValues({ ...values, text }),
      },
    },
  }
};

export default useJournalNotesUpsert;
