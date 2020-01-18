import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useSuccessFeedback } from '../use-success-feedback';
import { FETCH_EXPENSE_TRANSACTIONS, SAVE_EXPENSE_REPORT } from './lib/graphql';
import { DEFAULT_OPTIONS } from './lib/constants'
import { updateCacheAfterCreate } from './lib/cache';
import { useExpenseProjects } from './use-expense-projects';
import { useCurrentUser } from '../use-current-user';

const noop = () => { };

export const useExpenseEntry = (options = DEFAULT_OPTIONS) => {
  const [, { show: showSuccessFeedback }] = useSuccessFeedback();
  const currentUser = useCurrentUser();
  const {
    projectId,
    projectTitle,
    setProjectId,
    currentProject,
    ...projects
  } = useExpenseProjects();

  const [categoryId, setCategoryId] = useState(null);
  const [reporterId, setReporterId] = useState(null);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');

  const [saveReport] = useMutation(SAVE_EXPENSE_REPORT, {
    update: updateCacheAfterCreate({
      query: FETCH_EXPENSE_TRANSACTIONS,
      variables: { projectId, pageSize: options.limit, lastDate: '3000-01-01' },
    }),
  });

  const categoriesOptions = currentProject
    ? currentProject.categories.map((category) => ({
      value: category.id,
      label: category.name,
    }))
    : [];

  const reportersOptions = currentProject
    ? currentProject.members.map((reporter) => ({
      value: reporter.member_id,
      label: reporter.member_id === currentUser.id ? 'me' : reporter.email,
    }))
    : [];

  // auto select category on project change
  useEffect(() => {
    if (!currentProject) return noop;
    setCategoryId(currentProject.categories[0].id);
  }, [currentProject]);

  // auto select reporter on project change
  useEffect(() => {
    if (!currentProject) return noop;
    try {
      const members = currentProject.members.map($ => $.member_id);
      if (members.includes(currentUser.id)) {
        setReporterId(currentUser.id);
      } else {
        setReporterId(members[0]);
      }
    } catch (err) {
      setReporterId(null);
    }
  }, [currentProject, currentUser]);

  const submit = async () => {
    if (!amount) {
      throw new Error('Missing amount!')
    }
    if (!projectId) {
      throw new Error('Missing project!')
    }
    if (!categoryId) {
      throw new Error('Missing category!')
    }
    if (!reporterId) {
      throw new Error('Missing reporter!')
    }

    await saveReport({
      variables: {
        amount,
        project: projectId,
        category: categoryId,
        reporter: reporterId,
        notes,
        date,
      }
    });

    showSuccessFeedback();

    // reset form, let time for the visual feedback to slide up
    setTimeout(() => {
      setAmount('')
      setNotes('')
      setDate(new Date())
    }, 150);
  }

  return {
    isLoading: false,
    title: projectTitle,
    project: {
      value: projectId,
      setValue: setProjectId,
      currency: null,
      placeholder: null,
    },
    category: {
      value: categoryId,
      setValue: setCategoryId,
    },
    reporter: {
      value: reporterId,
      setValue: setReporterId,
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
      projects: projects.options,
      categories: categoriesOptions,
      reporters: reportersOptions,
    },
    submit,
  }
};
