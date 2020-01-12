/* eslint-disable no-console */

const down = async (hasura) => {
  await hasura.untrackFunction({
    schema: 'public',
    name: 'expense_transactions_list_by_user',
  });

  await hasura.untrackTable({
    schema: 'public',
    name: 'expense_transactions_by_user',
    cascade: true,
  });

  await hasura.query(`
    DROP FUNCTION IF EXISTS expense_transactions_list_by_user;
    DROP TABLE IF EXISTS expense_transactions_by_user CASCADE;
  `, null, { throw: false, log: 'dismantle' });
};

const up = async (hasura) => {
  await hasura.query(`
    CREATE TABLE expense_transactions_by_user (
      id INTEGER PRIMARY KEY,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      amount integer NOT NULL CHECK (amount <> 0),
      notes text,
      data jsonb,
      reporter json,
      category json
    );

    DROP FUNCTION IF EXISTS expense_transactions_list_by_user;
    CREATE OR REPLACE FUNCTION expense_transactions_list_by_user (
      hasura_session JSON,
      project_id INTEGER,
      last_date TIMESTAMP WITH TIME ZONE = NOW(),
      page_size SMALLINT = 20
    )
    RETURNS SETOF expense_transactions_by_user AS $$
    DECLARE
      VAR_projectId INTEGER := project_id;
    BEGIN
      RETURN QUERY
      WITH
      granted_projects_ids AS (
        SELECT t1.project_id FROM expense_projects_users AS t1
        WHERE t1.project_id = VAR_projectId AND member_id = (hasura_session->>'x-hasura-user-id')::INTEGER
      ),
      granted_expenses AS (
        SELECT
          t1.*,
          (hasura_session->>'x-hasura-user-id')::INTEGER AS user_id
        FROM expense_transactions AS t1
        WHERE t1.project_id IN (SELECT * FROM granted_projects_ids)
      )
      SELECT
        t1.id,
        t1.created_at,
        t1.amount,
        t1.notes,
        t1.data,
        json_build_object('email', t2.email) AS reporter,
        json_build_object('name', t3.name) AS category
      FROM granted_expenses AS t1
      JOIN users AS t2 ON t2.id = t1.member_id
      JOIN expense_categories AS t3 ON t3.id = t1.category_id
      WHERE t1.created_at < last_date
      ORDER BY t1.created_at DESC
      LIMIT page_size;
    END
    $$ LANGUAGE plpgsql STABLE;
  `, null, { throw: false, log: 'build' });

  await hasura.trackTable({
    schema: 'public',
    name: 'expense_transactions_by_user',
  });

  await hasura.createSelectPermission({
    role: 'user',
    table: 'expense_transactions_by_user',
    permission: {
      columns: '*',
      filter: {},
    },
  });

  await hasura.trackFunctionWithSession({
    schema: 'public',
    name: 'expense_transactions_list_by_user',
  });

  await hasura.query({
    sql: `DROP VIEW IF EXISTS expense_transactions_list CASCADE`,
    option: { throw: false, log: 'cleanup' },
  });
};

module.exports = {
  stable: true,
  up,
  down,
};
