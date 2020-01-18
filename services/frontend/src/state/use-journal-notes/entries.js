import { useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { LOAD_JOURNAL_NOTES, REMOVE_JOURNAL_NOTES } from './lib/graphql';
import { updateCacheAfterRemove } from './lib/cache';

export const DEFAULT_OPTIONS = { limit: 20 };

const useJournalNotesEntries = (options = DEFAULT_OPTIONS) => {
  const variables = { limit: options.limit, offset: 0 };

  const notesQuery = useQuery(LOAD_JOURNAL_NOTES, {
    fetchPolicy: 'cache-first',
    variables,
  });

  const [removeNotes] = useMutation(REMOVE_JOURNAL_NOTES, {
    update: updateCacheAfterRemove({
      query: LOAD_JOURNAL_NOTES,
      variables,
    }),
  });

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
    return removeNotes({ variables: { ids } });
  };

  const loadMore = () => {
    notesQuery.fetchMore({
      variables: { offset: entries.length },
      updateQuery: (prev, { fetchMoreResult: next }) =>
        next
          ? {
            journal_notes: [
              ...prev.journal_notes,
              ...next.journal_notes
            ]
          }
          : prev
    });
  };

  return {
    entries,
    reload,
    loadMore,
    remove,
  };
};

export default useJournalNotesEntries;
