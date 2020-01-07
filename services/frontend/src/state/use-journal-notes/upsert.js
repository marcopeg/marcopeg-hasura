import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { LOAD_JOURNAL_NOTE, UPDATE_JOURNAL_NOTE, INSERT_JOURNAL_NOTE, LOAD_JOURNAL_NOTES } from './lib/graphql';
import { updateCacheAfterCreate } from './lib/cache';
import { DEFAULT_OPTIONS } from './entries';

export const NEW_ITEM_ID = '$new';
const INITIAL_VALUES = { id: NEW_ITEM_ID, text: '' };
const noop = () => {};

const useJournalNotesUpsert = (noteId, options = DEFAULT_OPTIONS) => {
  const submitTimer = useRef(null);
  const [ values, setValues ] = useState(INITIAL_VALUES);
  const [ initialValues, setInitialValues ] = useState(INITIAL_VALUES);

  const {
    loading: noteIsLoading,
    data: noteData,
    error: noteError,
  } = useQuery(LOAD_JOURNAL_NOTE, { variables: { noteId }});

  const [ updateNote ] = useMutation(UPDATE_JOURNAL_NOTE);

  const [ createNote ] = useMutation(INSERT_JOURNAL_NOTE, {
    update: updateCacheAfterCreate({
      query: LOAD_JOURNAL_NOTES,
      variables: { limit: options.limit, offset: 0 },
    }),
  });

  const submit = useCallback(async () => {
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
  }, [ initialValues, values, createNote, updateNote ]);

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
  }, [ values, submit ])

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
