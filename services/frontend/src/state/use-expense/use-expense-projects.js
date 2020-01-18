/* eslint-disable */
import { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FETCH_EXPENSE_PROJECTS } from './lib/graphql';
import { useGlobalExpense } from './use-global-expense';

const noop = () => { };

export const useExpenseProjects = () => {
  const [{ projectId }, { setProjectId }] = useGlobalExpense();
  const { data, error, refetch } = useQuery(FETCH_EXPENSE_PROJECTS);

  const options = (data && !error && data.projects)
    ? data.projects.map((project) => ({ value: project.id, label: project.name }))
    : [];

  const currentProject = (projectId && data && data.projects && data.projects.length)
    ? data.projects.find((project) => project.id === projectId)
    : null;

  const projectTitle = currentProject
    ? currentProject.name
    : 'Expense';

  // Select first available project on data load
  useEffect(() => {
    if (projectId) return noop;
    if (error) return noop;
    if (!data) return noop;
    if (!data.projects) return noop;
    if (!data.projects.length) return noop;
    setProjectId(data.projects[0].id);
  }, [data, error, projectId, setProjectId]);

  return {
    projectId,
    projectTitle,
    setProjectId,
    currentProject,
    options,
    refetch,
  }
};
