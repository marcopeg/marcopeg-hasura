/* eslint-disable no-console */

const down = async (hasura) => {
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
    DROP FUNCTION IF EXISTS expense_projects_list_by_user;
    DROP TABLE IF EXISTS expense_projects_by_user CASCADE;
  `, null, { throw: false, log: 'dismantle' });
};

const up = async (hasura) => {
  await down(hasura);

  await hasura.query(`
    CREATE TABLE expense_projects_by_user (
      id INTEGER PRIMARY KEY,
      name text,
      data jsonb,
      categories json[],
      members json[]
    );
  `, null, { throw: false, log: 'build table' });

  await hasura.query(`
    DROP FUNCTION IF EXISTS expense_projects_list_by_user;
    CREATE OR REPLACE FUNCTION expense_projects_list_by_user (
      hasura_session JSON,
      dummy TEXT
    )
    RETURNS SETOF expense_projects_by_user AS $$
    BEGIN
      RETURN QUERY
      SELECT
        t1.id,
        t1.name,
        t1.data,
        ARRAY (
          SELECT
            json_build_object (
              'id', t2.id,
              'name', t2.name,
              'notes', t2.notes
            ) AS category
          FROM expense_categories AS t2
          WHERE t2.project_id = t1.id
            AND t2.is_active = true
          ORDER BY t2.order ASC
        ) AS categories,
        ARRAY (
          SELECT
            json_build_object (
              'member_id', t3.id,
              'email', t3.email
            ) AS member
          FROM users AS t3
          JOIN expense_projects_users AS t4 ON t3.id = t4.member_id
          JOIN expense_projects AS t5 ON t4.project_id = t5.id
          WHERE t5.id = t1.id
        ) AS members
      FROM expense_projects AS t1
      JOIN expense_projects_users AS t2 ON t1.id = t2.project_id
      WHERE t2.member_id = (hasura_session->>'x-hasura-user-id')::INTEGER
      ORDER BY t1.order ASC;
    END
    $$ LANGUAGE plpgsql STABLE;
  `, null, { throw: false, log: 'build function' });

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

  await hasura.untrackTable({
    schema: 'public',
    name: 'expense_projects_users_list',
    cascade: true,
  });

  await hasura.untrackTable({
    schema: 'public',
    name: 'expense_projects_list',
    cascade: true,
  });

  await hasura.untrackTable({
    schema: 'public',
    name: 'expense_categories_list',
    cascade: true,
  });

  await hasura.query({
    sql: `
      DROP VIEW IF EXISTS expense_categories_list CASCADE;
      DROP VIEW IF EXISTS expense_projects_list CASCADE;
      DROP VIEW IF EXISTS expense_projects_users_list CASCADE;
    `,
    option: { throw: false, log: 'cleanup' },
  });
};

module.exports = {
  stable: true,
  up,
  down,
};
