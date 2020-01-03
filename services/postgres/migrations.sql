-- #8 Expense Tracking

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
join expense_projects_users as j on p.id = j.project_id
where p.is_active = true
order by p.order desc;

-- table to pick list of categories on which a user has access
create or replace view expense_categories_list as
select
	c.*,
	c.created_by as owner_id,
	j.member_id as member_id
from expense_categories as c
join expense_projects_users as j on c.project_id = j.project_id
join expense_projects as p on c.project_id = p.id
where c.is_active = true
order by c.order desc;
