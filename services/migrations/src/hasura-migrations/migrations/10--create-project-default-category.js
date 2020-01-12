/**
 * Adds a default category (named "Extra") to a new project:
 * (triggered on create new project)
 */

const down = async (hasura) => {
  await hasura.query(`
    DROP TRIGGER IF EXISTS expense_create_default_project_category_trigger ON public.expense_projects;
    DROP FUNCTION IF EXISTS expense_create_default_project_category;
  `, null, { throw: false, log: 'dismantle' });
};

const up = async (hasura) => {
  await hasura.query(`
    DROP TRIGGER IF EXISTS expense_create_default_project_category_trigger ON public.expense_projects;

    CREATE OR REPLACE FUNCTION expense_create_default_project_category ()
    RETURNS TRIGGER AS $$
    DECLARE
      rec RECORD;
    BEGIN
      INSERT INTO public.expense_categories
      ( project_id, name,      created_by,     updated_by )
      VALUES
      ( NEW.id,     'Extra',   NEW.created_by, NEW.created_by );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER expense_create_default_project_category_trigger
    AFTER INSERT
    ON public.expense_projects
    FOR EACH ROW
    EXECUTE PROCEDURE expense_create_default_project_category();
  `, null, { throw: false, log: 'build' });
};

module.exports = {
  stable: true,
  up,
  down,
};
