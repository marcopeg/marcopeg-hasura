/**
 * Add trigger that creates the NEW project's owner relationship
 * (triggered on create new project)
 */

const down = async (hasura) => {
  await hasura.query(`
    DROP TRIGGER IF EXISTS expense_create_projects_members_owner_trigger ON public.expense_projects;
    DROP FUNCTION IF EXISTS expense_create_projects_members_owner;
  `, null, { throw: false, log: 'dismantle' });
};

const up = async (hasura) => {
  await hasura.query(`
    DROP TRIGGER IF EXISTS expense_create_projects_members_owner_trigger ON public.expense_projects;

    CREATE OR REPLACE FUNCTION expense_create_projects_members_owner ()
    RETURNS TRIGGER AS $$
    DECLARE
      rec RECORD;
    BEGIN
      INSERT INTO public.expense_projects_users
      ( project_id, member_id,      created_by,     is_owner )
      VALUES
      ( NEW.id,     NEW.created_by, NEW.created_by, true );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER expense_create_projects_members_owner_trigger
    AFTER INSERT
    ON public.expense_projects
    FOR EACH ROW
    EXECUTE PROCEDURE expense_create_projects_members_owner();
  `, null, { throw: false, log: 'build' });
};

module.exports = {
  stable: true,
  up,
  down,
};
