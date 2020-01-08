/**
 *
 * @param {query, variables} gql Used to identify the query that needs to be updated
 */

// It is not a given that the cache was already populated
export const updateCacheAfterCreate = (gql) => (cache, res) => {
  try {
    cache.writeQuery({
      ...gql,
      data: {
        transactions: [
          ...res.data.insert_expense_transactions.returning,
          ...cache.readQuery(gql).transactions,
        ],
      },
    });
  } catch (err) {};
};

/**
 *
 * @param {query, variables} gql Used to identify the query that needs to be updated
 */
export const updateCacheAfterRemove = (gql) => (cache, res) => {
  try {
    const removedIds = res.data.delete_expense_transactions.returning.map($ => $.id);
    const { transactions } = cache.readQuery(gql);
    cache.writeQuery({
      ...gql,
      data: {
        transactions: transactions.filter($ => !removedIds.includes($.id)),
      },
    });
  } catch (err) {
    console.error('@@updateCacheAfterRemove');
    console.error(err);
  }
};

