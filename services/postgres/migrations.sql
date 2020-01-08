--------------------------------------------------------------------
-- Add settings tables
--------------------------------------------------------------------

CREATE TABLE app_settings (
	"key" VARCHAR(25) PRIMARY KEY,
	"value" jsonb DEFAULT '{}'
);

INSERT INTO app_settings ("key", "value")
VALUES ('client.web.build', '1');

CREATE TABLE users_settings (
	"user_id" integer PRIMARY KEY REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	"data" jsonb DEFAULT '{}',
	"created_at" timestamp with time zone NOT NULL DEFAULT now(),
	"updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- populate user settings with existing users
INSERT INTO users_settings SELECT u.id, '{}' as "data" FROM users AS u;

-- function and trigger to automatically create a new user settings row
CREATE OR REPLACE FUNCTION populate_users_settings ()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users_settings (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS populate_users_settings_trigger ON public.users;
CREATE TRIGGER populate_users_settings_trigger
AFTER INSERT
ON users
FOR EACH ROW
EXECUTE PROCEDURE populate_users_settings();


--------------------------------------------------------------------
-- #14 Add logs in a random journal form
--------------------------------------------------------------------

CREATE TABLE journal_notes (
	"id" SERIAL PRIMARY KEY,
	"user_id" integer REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	"text" text NOT NULL,
	"data" jsonb,
	"created_by" integer NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	"created_at" timestamp with time zone NOT NULL DEFAULT now(),
	"updated_by" integer NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	"updated_at" timestamp with time zone NOT NULL DEFAULT now(),
	CHECK ("text" <> '')
);


--------------------------------------------------------------------
-- Transactions History
--------------------------------------------------------------------

CREATE OR REPLACE VIEW expense_transactions_list AS
SELECT t1.*, t2.member_id AS user_id
FROM expense_transactions AS t1
LEFT JOIN expense_projects_users AS t2 ON t1.project_id = t2.project_id;



--------------------------------------------------------------------
-- #11B Assign Expense entry to a different user
-- (after backup)
--------------------------------------------------------------------

-- recreate sequence for transactions and reset next value
-- (needed by crappy backup script)
CREATE SEQUENCE IF NOT EXISTS expense_transactions_id_seq INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE expense_transactions_id_seq OWNED BY expense_transactions.id;
ALTER TABLE expense_transactions ALTER COLUMN id SET DEFAULT nextval('expense_transactions_id_seq');
SELECT setval('expense_transactions_id_seq',  (SELECT MAX(id) FROM expense_transactions));

-- this view is a temporary solution, each user would get access to the
-- information "who has access to what projects" without restrictions
DROP VIEW IF EXISTS expense_projects_users_list;
CREATE OR REPLACE VIEW expense_projects_users_list AS
WITH
all_users AS (
	SELECT id AS user_id FROM users
),
all_members AS (
	SELECT t2.member_id, t1.email, t2.project_id
	FROM users AS t1
	LEFT JOIN expense_projects_users AS t2 ON t1.id = t2.member_id
),
all_combinations AS (
	SELECT
		t1.user_id,
		t2.project_id,
		t2.member_id,
		t2.email
	FROM all_users AS t1
	CROSS JOIN all_members AS t2
)
SELECT t1.* FROM all_combinations AS t1
JOIN expense_projects_users AS t2
ON t1.project_id = t2.project_id AND t1.user_id = t2.member_id;

-- Same result with only nested queries:
-- SELECT t1.* FROM (
-- 	SELECT
-- 		t1.user_id,
-- 		t2.project_id,
-- 		t2.member_id,
-- 		t2.email
-- 	FROM (
-- 		SELECT id AS user_id FROM users
-- 	) AS t1
-- 	CROSS JOIN (
-- 		SELECT t2.member_id, t1.email, t2.project_id
-- 		FROM users AS t1
-- 		LEFT JOIN expense_projects_users AS t2 ON t1.id = t2.member_id
-- 	) AS t2
-- ) AS t1
-- JOIN expense_projects_users AS t2
-- ON t1.project_id = t2.project_id AND t1.user_id = t2.member_id;


--------------------------------------------------------------------
-- #11 Assign Expense entry to a different user
--------------------------------------------------------------------

-- add "member_id" to the "expense_transactions"
ROLLBACK;
BEGIN;
	CREATE TEMPORARY TABLE temp_transactions ON COMMIT DROP AS SELECT * FROM expense_transactions;
	DROP TABLE expense_transactions CASCADE;
	CREATE TABLE expense_transactions (
	    "id" SERIAL PRIMARY KEY,
	    "project_id" integer REFERENCES expense_projects(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	    "category_id" integer REFERENCES expense_categories(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	    "member_id" integer NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	    "amount" integer NOT NULL,
	    "notes" text,
	    "data" jsonb,
	    "is_confirmed" boolean NOT NULL DEFAULT false,
	    "created_by" integer NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
	    "updated_by" integer NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
	    CHECK ("amount" <> 0)
	);

	INSERT INTO expense_transactions
	SELECT id, project_id, category_id, created_by AS member_id, amount, notes, data, is_confirmed, created_by, created_at, updated_by, updated_at
	FROM temp_transactions;
COMMIT;

-- add "is_owner" to the "expense_projects_users" table
BEGIN;
	CREATE TEMPORARY TABLE temp_relations ON COMMIT DROP AS SELECT * FROM expense_projects_users;
	DROP TABLE IF EXISTS expense_projects_users CASCADE;

	CREATE TABLE expense_projects_users (
	    "project_id" integer REFERENCES expense_projects(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	    "member_id" integer REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	    "is_owner" BOOLEAN NOT NULL DEFAULT false,
	    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
	    "created_by" integer NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	    CONSTRAINT expense_projects_users_pkey PRIMARY KEY (project_id, member_id)
	);

	INSERT INTO expense_projects_users
	SELECT
		project_id,
		member_id,
		false AS is_owner,
		created_at,
		created_by
	FROM temp_relations;
COMMIT;

-- add all the project owners to the relationship table
INSERT INTO expense_projects_users
SELECT
	id AS project_id,
	created_by AS member_id,
	true AS is_owner,
	created_at AS created_at,
	created_by AS created_by
FROM expense_projects
ON CONFLICT ON CONSTRAINT expense_projects_users_pkey
DO UPDATE SET is_owner = true;

-- replace views
CREATE OR REPLACE VIEW expense_projects_list AS
SELECT t2.*, t1.member_id AS member_id
FROM expense_projects_users AS t1
LEFT JOIN expense_projects AS t2 ON t1.project_id = t2.id;

BEGIN;
DROP VIEW expense_categories_list;
CREATE OR REPLACE VIEW expense_categories_list AS
SELECT t1.*, t2.member_id AS member_id
FROM expense_categories AS t1
LEFT JOIN expense_projects_list AS t2 ON t1.project_id = t2.id;
COMMIT;

-- CREATE OR REPLACE VIEW expense_projects_users_list AS
-- SELECT
-- 	t1.project_id,
-- 	t1.member_id,
-- 	t2.email
-- FROM (
-- 	SELECT
-- 		(CASE WHEN (t1.project_id IS NULL) THEN t2.project_id ELSE t1.project_id END) AS project_id,
-- 		(CASE WHEN (t1.member_id IS NULL) THEN t2.member_id ELSE t1.member_id END) AS member_id
-- 	FROM (
-- 		SELECT uuid_generate_v1() AS uuid, id AS project_id, created_by AS member_id FROM expense_projects
-- 	) AS t1
-- 	FULL OUTER JOIN (
-- 		SELECT uuid_generate_v1() AS uuid, project_id, member_id FROM expense_projects_users
-- 	) AS t2 ON t1.uuid = t2.uuid
-- ) AS t1
-- LEFT JOIN users AS t2 ON t1.member_id = t2.id;


--------------------------------------------------------------------
-- #8 Expense Tracking
--------------------------------------------------------------------

CREATE TABLE expense_projects (
    "id" SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    "notes" text,
    "data" jsonb,
    "is_active" boolean NOT NULL DEFAULT true,
    "order" smallint NOT NULL DEFAULT 9999,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "created_by" integer NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_by" integer NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CHECK ("name" <> '')
);

CREATE TABLE expense_projects_users (
    "project_id" integer REFERENCES expense_projects(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    "member_id" integer REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "created_by" integer NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT expense_projects_users_pkey PRIMARY KEY (project_id, member_id)
);

CREATE TABLE expense_categories (
    "id" SERIAL PRIMARY KEY,
    "project_id" integer REFERENCES expense_projects(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    "name" text NOT NULL,
    "notes" text,
    "data" jsonb,
    "is_active" boolean NOT NULL DEFAULT true,
    "order" smallint NOT NULL DEFAULT 9999,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "created_by" integer NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_by" integer NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CHECK ("name" <> '')
);

CREATE TABLE expense_transactions (
    "id" SERIAL PRIMARY KEY,
    "project_id" integer REFERENCES expense_projects(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    "category_id" integer REFERENCES expense_categories(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    "created_by" integer NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "amount" integer NOT NULL,
    "notes" text,
    "data" jsonb,
    "is_confirmed" boolean NOT NULL DEFAULT false,
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_by" integer NOT NULL REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CHECK ("amount" <> 0)
);


-- table to pick list of projects on which a user has access
create or replace view expense_projects_list as
select
	p.*,
	j.member_id as member_id
from expense_projects as p
left join expense_projects_users as j on p.id = j.project_id
where p.is_active = true
order by p.order desc;

-- table to pick list of categories on which a user has access
create or replace view expense_categories_list as
select
	c.*,
	c.created_by as owner_id,
	j.member_id as member_id
from expense_categories as c
left join expense_projects_users as j on c.project_id = j.project_id
left join expense_projects as p on c.project_id = p.id
where c.is_active = true
order by c.order desc;
