import { useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { FETCH_EXPENSE_TRANSACTIONS, REMOVE_EXPENSE_TRANSACTIONS } from './lib/graphql';
import { DEFAULT_OPTIONS } from './lib/constants';
import { updateCacheAfterRemove } from './lib/cache';
import { showDate } from '../../lib/date-time';
import { useExpenseProjects } from './use-expense-projects';

const mapTransactions = (items, project) => {
  const currency = project.data && project.data.currency
    ? project.data.currency
    : null;

  return items.map((item) => ({
    ...item,
    showCreatedAt: showDate(new Date(item.created_at)),
    showAmount: currency ? `${item.amount} ${currency}` : item.amount,
    showReporter: item.reporter ? item.reporter.email.split('@').shift() : 'n/a',
    showCategory: item.category.name,
  }));
}

export const useExpenseHistory = (options = DEFAULT_OPTIONS) => {
  const { projectId, setProjectId, currentProject, ...projects } = useExpenseProjects();

  const transactionsQuery = useQuery(FETCH_EXPENSE_TRANSACTIONS, {
    fetchPolicy: 'cache-first',
    variables: { projectId, pageSize: options.limit, lastDate: '3000-01-01' },
  });

  const [removeTransactions] = useMutation(REMOVE_EXPENSE_TRANSACTIONS, {
    update: updateCacheAfterRemove({
      query: FETCH_EXPENSE_TRANSACTIONS,
      variables: { projectId, pageSize: options.limit, lastDate: '3000-01-01' },
    }),
  });

  const transactions = useMemo(() => {
    if (!transactionsQuery.data) return [];
    if (!transactionsQuery.data.transactions) return [];
    return mapTransactions(transactionsQuery.data.transactions, currentProject);
  }, [transactionsQuery.data, currentProject]);

  const reload = async (e) => {
    await projects.refetch();
    await transactionsQuery.refetch();
    e.detail && e.detail.complete && e.detail.complete();
  };

  const loadMore = () => {
    if (!transactions.length) return;
    transactionsQuery.fetchMore({
      variables: { lastDate: transactions[transactions.length - 1].created_at },
      updateQuery: (prev, { fetchMoreResult: next }) =>
        next
          ? {
            transactions: [
              ...prev.transactions,
              ...next.transactions
            ]
          }
          : prev
    });
  };

  const remove = (id) => {
    const ids = Array.isArray(id) ? id : [id];
    return removeTransactions({ variables: { ids } });
  }

  return {
    projects: {
      options: projects.options,
      value: projectId,
      setValue: setProjectId,
    },
    transactions,
    reload,
    loadMore,
    remove,
  };
};
