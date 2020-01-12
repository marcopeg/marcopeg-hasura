import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  FETCH_EXPENSE_TRANSACTIONS,
  LOAD_PROJECTS_LIST,
  SAVE_EXPENSE_REPORT,
} from './lib/graphql';
import { DEFAULT_OPTIONS } from './lib/constants'
import { updateCacheAfterCreate } from './lib/cache';

const getDefaultProject = (projects) =>
  projects.length
    ? projects[0]
    : null;

const getDefaultCategoryID = (project) =>
  project && project.categories.length
    ? project.categories[0].id
    : null;

const useExpenseEntry = (options = DEFAULT_OPTIONS) => {
  const projects = useQuery(LOAD_PROJECTS_LIST);
  const [project, setProject] = useState(null);
  const [category, setCategory] = useState(null);
  const [reporter, setReporter] = useState(null);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');

  const [saveReport] = useMutation(SAVE_EXPENSE_REPORT, {
    update: updateCacheAfterCreate({
      query: FETCH_EXPENSE_TRANSACTIONS,
      variables: { projectId: project, pageSize: options.limit, lastDate: '3000-01-01' },
    }),
  });

  // auto select the project in case there is only one value
  useEffect(() => {
    if (project !== null || !projects.data || projects.error) return;

    // console.log('@auto select project on load');
    const defaultProject = getDefaultProject(projects.data.expense_projects_list);
    if (defaultProject) {
      setProject(defaultProject.id);
    }
  }, [project, projects.data, projects.error]);

  // auto select category on project change
  useEffect(() => {
    if (project === null || !projects.data || projects.error) return;
    // console.log('@auto select category on project change', project);
    const currentProject = projects.data.expense_projects_list.find($ => $.id === project);
    if (currentProject) {
      setCategory(getDefaultCategoryID(currentProject));
    }
  }, [project, projects.data, projects.error]);

  // auto select reporter on project change
  useEffect(() => {
    if (project === null || !projects.data || projects.error) return;
    // console.log('@auto select reporter on project change', project);
    const currentProject = projects.data.expense_projects_list.find($ => $.id === project);
    if (currentProject) {
      try {
        const userId = projects.data.users[0].id;
        const members = currentProject.members.map($ => $.member_id);
        if (members.includes(userId)) {
          setReporter(userId);
        } else {
          setReporter(members[0]);
        }
      } catch (err) {
        setReporter(null);
      }
    }
  }, [project, projects.data, projects.error]);

  const currentUserId = (projects.data && projects.data.users && projects.data.users.length)
    ? projects.data.users[0].id
    : null;

  const currentProject = project
    ? projects.data.expense_projects_list.find($ => $.id === project)
    : null;

  const projectsOptions = (projects.data && projects.data.expense_projects_list)
    ? projects.data.expense_projects_list.map((project) => ({
      value: project.id,
      label: project.name,
    }))
    : [];

  const categoriesOptions = project
    ? projects.data.expense_projects_list
      .find($ => $.id === project)
      .categories.map((category) => ({
        value: category.id,
        label: category.name,
      }))
    : [];
  const reportersOptions = project
    ? projects.data.expense_projects_list
      .find($ => $.id === project)
      .members.map((reporter) => ({
        value: reporter.member_id,
        label: reporter.member_id === currentUserId ? 'me' : reporter.email,
      }))
    : [];

  const submit = async () => {
    if (!amount) {
      throw new Error('Missing amount!')
    }
    if (!project) {
      throw new Error('Missing project!')
    }
    if (!category) {
      throw new Error('Missing category!')
    }
    if (!reporter) {
      throw new Error('Missing reporter!')
    }

    await saveReport({
      variables: {
        amount,
        project,
        category,
        reporter,
        notes,
        date,
      }
    })

    // reset form
    setAmount('')
    setNotes('')
    setDate(new Date())
  }

  return {
    isLoading: projects.loading,
    project: {
      value: project,
      setValue: setProject,
      currency: currentProject
        ? (currentProject.data || {}).currency || null
        : null,
      placeholder: currentProject
        ? (currentProject.data || {}).placeholder || null
        : null,
    },
    category: {
      value: category,
      setValue: setCategory,
    },
    reporter: {
      value: reporter,
      setValue: setReporter,
    },
    amount: {
      value: amount,
      setValue: setAmount,
    },
    date: {
      value: date,
      setValue: setDate,
    },
    notes: {
      value: notes,
      setValue: setNotes,
    },
    options: {
      projects: projectsOptions,
      categories: categoriesOptions,
      reporters: reportersOptions,
    },
    submit,
  }
};

export default useExpenseEntry;
