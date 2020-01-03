import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const LOAD_PROJECTS_LIST = gql`
  query loadProjectsList {
    expense_projects_list {
      id
      name
      categories(order_by: {order: asc}) {
        id
        name
        notes
      }
    }
  }
`;

const SAVE_EXPENSE_REPORT = gql`
  mutation saveExpenseReport (
    $amount:Int!
    $category:Int!
    $project:Int!
    $notes:String
    $date: timestamptz
  ) {
    insert_expense_transactions(
      objects: {
        amount: $amount,
        category_id: $category,
        project_id: $project
        notes: $notes
        created_at: $date
      }
    ) {
      returning {
        amount
        category_id
        created_at
        created_by
        data
        id
        is_confirmed
        notes
        project_id
        updated_at
        updated_by
      }
    }
  }
`;

const useExpenseEntry = () => {
  const projects = useQuery(LOAD_PROJECTS_LIST);
  const [ project, setProject ] = useState(null);
  const [ category, setCategory ] = useState(null);
  const [ amount, setAmount ] = useState('');
  const [ date, setDate ] = useState(new Date());
  const [ notes, setNotes ] = useState('');

  const [ saveReport ] = useMutation(SAVE_EXPENSE_REPORT);

  // auto select the project in case there is only one value
  useEffect(() => {
    if (project !== null
        || !projects.data
        || projects.error
        || projects.data.expense_projects_list.length < 1
      ) {
      return
    }
    const { id, categories } = projects.data.expense_projects_list[0];
      setProject(id);

      if (categories.length) {
        setCategory(categories[0].id);
      }
  }, [ project, projects.data, projects.error ]);

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

    await saveReport({
      variables: {
        amount,
        project,
        category,
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
    },
    category: {
      value: category,
      setValue: setCategory,
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
    },
    submit,
  }
};

export default useExpenseEntry;
