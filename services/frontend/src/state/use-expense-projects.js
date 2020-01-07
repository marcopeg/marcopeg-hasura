import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

export const FETCH_EXPENSE_PROJECTS = gql`
  query fetchProjects {
    projects: expense_projects_list (
      order_by: { order: asc }
    ) {
      id
      name
      data
      notes
    }
  }
`;

export const FETCH_EXPENSE_TRANSACTIONS = gql`
  query fetchTransactions (
    $projectId: Int!
    $limit: Int!
    $offset: Int!
  ) {
    transactions: expense_transactions_list(
      where: { project_id: {_eq: $projectId } },
      order_by: { created_at: desc }
      limit: $limit
      offset: $offset
    ) {
      id
      created_at
      amount
      notes
      reporter {
        email
      }
      category {
        name
      }
    }
  }
`;

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const day2str = (day) => {
  if (day === 1) return `${day}st`;
  if (day === 2) return `${day}nd`;
  if (day === 3) return `${day}rd`;
  return `${day}th`;
};

const showDate = (date) =>
  `${monthNames[date.getMonth()]}  ${day2str(date.getDate())}, ${date.getFullYear()}`

const mapTransactions = (items, project) => {
  const currency = project.data && project.data.currency
    ? project.data.currency
    : null;

  return items.map((item) => {
    // console.log(item)
    return {
      ...item,
      showCreatedAt: showDate(new Date(item.created_at)),
      showAmount: currency ? `${item.amount} ${currency}` : item.amount,
      showReporter: item.reporter ? item.reporter.email.split('@').shift() : 'n/a',
      showCategory: item.category.name,
    };
  });
}

const useExpenseProjects = () => {
  const [ projectId, setProjectId ] = useState(null);

  const projectsQuery = useQuery(FETCH_EXPENSE_PROJECTS);

  const transactionsQuery = useQuery(FETCH_EXPENSE_TRANSACTIONS, {
    fetchPolicy: 'cache-first',
    variables: { projectId, limit: 2, offset: 0 },
  });

  const currentProject = useMemo(() => (
    projectId
      ? projectsQuery.data.projects.find($ => $.id === projectId)
      : null
  ), [ projectId, projectsQuery.data ]);

  const projectsOptions = useMemo(() => {
    if (!projectsQuery.data) return [];
    if (!projectsQuery.data.projects) return [];
    return projectsQuery.data.projects.map($ => ({ value: $.id, label: $.name }));
  }, [projectsQuery.data]);

  const transactions = useMemo(() => {
    if (!transactionsQuery.data) return [];
    if (!transactionsQuery.data.transactions) return [];
    return mapTransactions(transactionsQuery.data.transactions, currentProject);
  }, [ transactionsQuery.data, currentProject ]);

  // Auto select project
  useEffect(() => {
    if (!projectId && projectsOptions.length) {
      setProjectId(projectsOptions[0].value);
    }
  }, [ projectId, projectsOptions ]);

  const reload = async (e) => {
    await projectsQuery.refetch();
    e.detail && e.detail.complete && e.detail.complete();
  };

  const loadMore = () =>
    transactionsQuery.fetchMore({
      variables: { offset: transactions.length },
      updateQuery: (prev, { fetchMoreResult: next }) =>
        next
          ? { transactions: [
              ...prev.transactions,
              ...next.transactions
            ]}
          : prev
    });

  return {
    projects: {
      options: projectsOptions,
      value: projectId,
      setValue: setProjectId,
    },
    transactions,
    reload,
    loadMore,
  };
};

export default useExpenseProjects;
