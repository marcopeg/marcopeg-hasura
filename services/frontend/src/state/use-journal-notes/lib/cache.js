import { LOAD_JOURNAL_NOTES } from './graphql';

export const updateCacheAfterCreate = (cache, res) => {
  try {
    const { journal_notes } = cache.readQuery({ query: LOAD_JOURNAL_NOTES });
    cache.writeQuery({
      query: LOAD_JOURNAL_NOTES,
      data: {
        journal_notes: [
          ...res.data.insert_journal_notes.returning,
          ...journal_notes,
        ],
      },
    });
  } catch (err) {
    console.error('@@updateCacheAfterCreate');
    console.error(err);
  }
};

export const updateCacheAfterRemove = (cache, res) => {
  try {
    const removedIds = res.data.delete_journal_notes.returning.map($ => $.id);
    const { journal_notes } = cache.readQuery({ query: LOAD_JOURNAL_NOTES });
    cache.writeQuery({
      query: LOAD_JOURNAL_NOTES,
      data: {
        journal_notes: journal_notes.filter($ => !removedIds.includes($.id)),
      },
    });
  } catch (err) {
    console.error('@@updateCacheAfterRemove');
    console.error(err);
  }
};
