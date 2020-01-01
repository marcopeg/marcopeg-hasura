-- reset schema
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    auth0_id text NOT NULL UNIQUE,
    email text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_pkey ON users(id int4_ops);
CREATE UNIQUE INDEX IF NOT EXISTS users_auth0_id_key ON users(auth0_id text_ops);

-- journal questions
CREATE TABLE IF NOT EXISTS journal_questions (
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    "order" smallint NOT NULL,
    type text NOT NULL,
    text text NOT NULL,
    data jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    show_in_journal boolean NOT NULL DEFAULT false,
    CONSTRAINT journal_questions_user_id_type_text_key UNIQUE (user_id, type, text)
);

CREATE UNIQUE INDEX IF NOT EXISTS journal_questions_pkey ON journal_questions(id int4_ops);
CREATE UNIQUE INDEX IF NOT EXISTS journal_questions_user_id_type_text_key ON journal_questions(user_id int4_ops,type text_ops,text text_ops);


-- journal logs
CREATE TABLE IF NOT EXISTS journal_logs (
    user_id integer REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    question_id integer REFERENCES journal_questions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    text text,
    data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    created_at_day date DEFAULT now(),
    CONSTRAINT journal_logs_pkey PRIMARY KEY (user_id, question_id, created_at_day)
);

CREATE UNIQUE INDEX IF NOT EXISTS journal_logs_pkey ON journal_logs(user_id int4_ops,question_id int4_ops,created_at_day date_ops);
