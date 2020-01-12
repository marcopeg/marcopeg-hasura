/* eslint-disable no-console */

const down = async (hasura) => {
  await hasura.untrackFunction({
    schema: 'public',
    name: 'expense_transactions_list_by_user',
  });

  await hasura.untrackTable({
    schema: 'public',
    name: 'expense_transactions_by_user',
    ascade: true,
  });

  await hasura.query(`
    DROP FUNCTION IF EXISTS expense_transactions_list_by_user;
    DROP TABLE IF EXISTS expense_transactions_by_user CASCADE;
  `, null, { throw: false, log: 'dismantle' });
};

const up = async (hasura) => {
  await down(hasura);

  await hasura.query(`
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
      SELECT
        t1.id,
        t1.project_id,
        t1.category_id,
        t1.member_id,
        t1.amount,
        t1.notes,
        t1.data,
        t1.is_confirmed,
        t1.created_at,
        (hasura_session->>'x-hasura-user-id')::INTEGER AS user_id
      FROM expense_transactions AS t1
      WHERE t1.project_id IN (
        SELECT t1.project_id FROM expense_projects_users AS t1
        WHERE t1.project_id = VAR_projectId
          AND member_id = (hasura_session->>'x-hasura-user-id')::INTEGER
      )
        AND created_at < last_date
      ORDER BY created_at DESC
      LIMIT page_size ;
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
      filter: {
        user_id: 'X-Hasura-User-Id',
      },
    },
  });

  await hasura.trackFunctionWithSession({
    schema: 'public',
    name: 'expense_transactions_list_by_user',
  });

  await hasura.call({
    type: 'create_object_relationship',
    args: {
      table: 'expense_transactions_by_user',
      name: 'category',
      using: {
        foreign_key_constraint_on: 'category_id',
      },
    },
  });

  await hasura.call({
    type: 'create_object_relationship',
    args: {
      table: 'expense_transactions_by_user',
      name: 'reporter',
      using: {
        foreign_key_constraint_on: 'member_id',
      },
    },
  });

  await hasura.query({
    sql: `DROP VIEW IF EXISTS expense_transactions_list CASCADE`,
    option: { throw: false, log: 'cleanup' },
  });
};

module.exports = {
  stable: false,
  up,
  down,
};
