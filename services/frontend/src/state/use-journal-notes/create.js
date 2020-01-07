/* eslint-disable */

import { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { INSERT_JOURNAL_NOTE } from './lib/graphql';
import { updateCacheAfterCreate } from './lib/cache';

const INITIAL_VALUES = { text: '' };

const useJournalNotesCreate = () => {
  const [ insertNote ] = useMutation(INSERT_JOURNAL_NOTE, { update: updateCacheAfterCreate });
  const [ values, setValues ] = useState(INITIAL_VALUES);

  const reset = () => setValues(INITIAL_VALUES);
  const submit = async () => {
    await insertNote({ variables: values });
    reset();
  };

  return {
    submit,
    reset,
    values: {
      text: {
        value: values.text,
        update: v => setValues({ ...values, text: v }),
      },
    },
  };
};

export default useJournalNotesCreate;
