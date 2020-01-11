/* eslint-disable no-console */
const { query } = require('../lib/query');
const {
  trackTable,
  untrackTable,
  trackFunctionWithSession,
  untrackFunction,
  createSelectPermission,
} = require('../lib/api');

const down = async () => {
  await untrackFunction({
    schema: 'public',
    name: 'expense_transactions_list_by_user',
  });

  await untrackTable({
    schema: 'public',
    name: 'expense_transactions_by_user',
    ascade: true,
  });

  await query(`
    DROP FUNCTION IF EXISTS expense_transactions_list_by_user(JSON, TEXT);
    DROP TABLE IF EXISTS expense_transactions_by_user CASCADE;
  `, null, { throw: false, log: 'dismantle' });
};

const up = async () => {
  await down();

  await query(`
    CREATE TABLE expense_transactions_by_user (
      id INTEGER PRIMARY KEY,
      project_id integer REFERENCES expense_projects(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
      category_id integer REFERENCES expense_categories(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
      member_id integer NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
      amount integer NOT NULL CHECK (amount <> 0),
      notes text,
      data jsonb,
      is_confirmed boolean NOT NULL DEFAULT false,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      user_id integer NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT
    );

    CREATE OR REPLACE FUNCTION expense_transactions_list_by_user(
      hasura_session JSON,
      dummy TEXT
    )
    RETURNS SETOF expense_transactions_by_user AS $$
    BEGIN
      RETURN QUERY
      SELECT
        id,
        project_id,
        category_id,
        member_id,
        amount,
        notes,
        data,
        is_confirmed,
        created_at,
        (hasura_session->>'x-hasura-user-id')::INTEGER AS user_id
      FROM expense_transactions
      WHERE project_id IN (SELECT project_id FROM expense_projects_users WHERE member_id = (hasura_session->>'x-hasura-user-id')::INTEGER)
      ORDER BY created_at DESC;
    END
    $$ LANGUAGE plpgsql STABLE;

  `);

  await trackTable({
    schema: 'public',
    name: 'expense_transactions_by_user',
  });

  await createSelectPermission({
    role: 'user',
    table: 'expense_transactions_by_user',
    permission: {
      columns: '*',
      filter: {
        user_id: 'X-Hasura-User-Id',
      },
    },
  });

  await trackFunctionWithSession({
    schema: 'public',
    name: 'expense_transactions_list_by_user',
  });
};

module.exports = {
  stable: false,
  up,
  down,
};
