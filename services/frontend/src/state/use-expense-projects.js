import { useState, useEffect } from 'react';
import { useLazyQuery } from '../lib/apollo';
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
  ) {
    transactions: expense_transactions_list(
      where: { project_id: {_eq: $projectId } },
      order_by: { created_at: desc }
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
  const [ projects, setProjects ] = useState([]);
  const [ transactions, setTransactions ] = useState([]);
  const [ currentProject, setCurrentProject ] = useState(null);

  const [ fetchProjects ] = useLazyQuery(FETCH_EXPENSE_PROJECTS);
  const [ fetchTransactions ] = useLazyQuery(FETCH_EXPENSE_TRANSACTIONS);

  // Load projects at boot time
  useEffect(() => {
    fetchProjects()
      .then(({ projects }) => setProjects(projects))
  }, []); // eslint-disable-line

  // Set current project whenever the list of projects change
  useEffect(() => {
    if (projects.length >= 1) {
      setCurrentProject(projects[0]);
    }
  }, [projects]);

  // Load transactions when the selected project change
  useEffect(() => {
    if (currentProject) {
      // console.log('@load transactions for', currentProject);
      fetchTransactions({ variables: { projectId: currentProject.id }})
        .then(({ transactions }) => {
          const items = mapTransactions(transactions, currentProject);
          setTransactions(items);
        })
    }
  }, [ currentProject, fetchTransactions ]);

  // Reset all data and reload
  const reload = () => new Promise((resolve, reject) => {
    const call = fetchProjects();

    // reset data
    setProjects([]);
    setTransactions([]);
    setCurrentProject(null);

    // repopulate
    call
      .then(({ projects }) => setProjects(projects))
      .then(resolve)
      .catch(reject);
  });

  return {
    projects: {
      options: projects.map($ => ({ value: $.id, label: $.name })),
      value: currentProject ? currentProject.id : null,
      setValue: (id) => setCurrentProject(projects.find($ => $.id === id)),
    },
    transactions,
    reload,
  };
};

export default useExpenseProjects;
