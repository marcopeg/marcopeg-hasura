# marcopeg-hasura

## Create a Backup

- Set `PG_STRING_REMOTE=postgres://xxx` to the production database in `.env`
- Run `humble pg-dump` to create an updated backup
- Export the settings using the WebConsole

## GitPod - Initialize a Workspace

- Import the postgres dump using `adminer` interface. **uncheck `stop on error`**
- Import Hasura's settings using the WebConsole
- Run `npm start` in the `migrations` service
