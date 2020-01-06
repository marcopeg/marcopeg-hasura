/* eslint-disable */

import { useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { LOAD_JOURNAL_NOTES, REMOVE_JOURNAL_NOTES } from './lib/graphql';
import { updateCacheAfterRemove } from './lib/cache';

const useJournalNotesEntries = () => {
  const notesQuery = useQuery(LOAD_JOURNAL_NOTES);
  const [removeNotes] = useMutation(REMOVE_JOURNAL_NOTES, { update: updateCacheAfterRemove });

  const entries = useMemo(() => {
    return notesQuery.data && notesQuery.data.journal_notes ? notesQuery.data.journal_notes : [];
  }, [notesQuery.data])

  // Ionic "pull-to-refresh" compatible
  const reload = async (e) => {
    await notesQuery.refetch();
    e.detail && e.detail.complete && e.detail.complete();
  };

  const remove = (id) => {
    const ids = Array.isArray(id) ? id : [id];
    return removeNotes({ variables: { ids }});
  };

  return {
    entries,
    reload,
    remove,
  };
};

export default useJournalNotesEntries;
