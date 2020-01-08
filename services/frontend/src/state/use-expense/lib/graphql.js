import { gql } from 'apollo-boost';

export const FETCH_EXPENSE_PROJECTS = gql`
  query fetchProjects {
    projects: expense_projects_list (
      order_by: { order: asc }
    ) {
      id
      name
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

export const LOAD_PROJECTS_LIST = gql`
  query loadProjectsList {
    expense_projects_list {
      id
      name
      data
      categories (order_by: {order: asc}) {
        id
        name
        notes
      }
      members (order_by: {email: asc}) {
        member_id
        email
      }
    }
    users { id }
  }
`;

export const SAVE_EXPENSE_REPORT = gql`
  mutation saveExpenseReport (
    $amount: Int!
    $project: Int!
    $category: Int!
    $reporter: Int!
    $notes: String
    $date: timestamptz
  ) {
    insert_expense_transactions(
      objects: {
        amount: $amount
        category_id: $category
        project_id: $project
        member_id: $reporter
        notes: $notes
        created_at: $date
      }
    ) {
      returning {
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
  }
`;

export const REMOVE_EXPENSE_TRANSACTIONS = gql`
  mutation removeExpenseTransactions (
    $ids: [Int!]
  ) {
    delete_expense_transactions (
      where: { id: { _in: $ids }}
    ) {
      returning {
        id
      }
    }
  }
`;
