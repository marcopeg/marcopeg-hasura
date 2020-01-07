/**
 *
 * @param {query, variables} gql Used to identify the query that needs to be updated
 */
export const updateCacheAfterCreate = (gql) => (cache, res) => {
  try {
    const { journal_notes } = cache.readQuery(gql);
    cache.writeQuery({
      ...gql,
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

/**
 *
 * @param {query, variables} gql Used to identify the query that needs to be updated
 */
export const updateCacheAfterRemove = (gql) => (cache, res) => {
  try {
    const removedIds = res.data.delete_journal_notes.returning.map($ => $.id);
    const { journal_notes } = cache.readQuery(gql);
    cache.writeQuery({
      ...gql,
      data: {
        journal_notes: journal_notes.filter($ => !removedIds.includes($.id)),
      },
    });
  } catch (err) {
    console.error('@@updateCacheAfterRemove');
    console.error(err);
  }
};
