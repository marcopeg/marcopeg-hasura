/* eslint-disable no-console */

const down = async () => { };

const up = async (hasura) => {
  await hasura.untrackFunction({
    schema: 'public',
    name: 'expense_projects_list_by_user',
  });

  await hasura.untrackTable({
    schema: 'public',
    name: 'expense_projects_by_user',
    cascade: true,
  });

  await hasura.query(`
    ALTER TABLE expense_transactions ALTER COLUMN amount TYPE DECIMAL(10,2);
    ALTER TABLE expense_transactions_by_user ALTER COLUMN amount TYPE DECIMAL(10,2);
  `, null, { throw: false, log: 'build' });

  await hasura.trackTable({
    schema: 'public',
    name: 'expense_projects_by_user',
  });

  await hasura.createSelectPermission({
    role: 'user',
    table: 'expense_projects_by_user',
    permission: {
      columns: '*',
      filter: {},
    },
  });

  await hasura.trackFunctionWithSession({
    schema: 'public',
    name: 'expense_projects_list_by_user',
  });
};

module.exports = {
  stable: true,
  up,
  down,
};
