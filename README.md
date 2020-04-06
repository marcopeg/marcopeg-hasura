# marcopeg-hasura

## Create a Backup

- Set `PG_STRING_REMOTE=postgres://xxx` to the production database in `.env`
- Run `humble pg-dump` to create an updated backup
- Export the settings using the WebConsole

## GitPod - Environment Variables

GitPod runs with the development settings that fake the Auth0 login.
In order for this mechanism to work, you need to setup 2 environment variables in your
GitPod settings page:

- REACT_APP_HASURA_DEV_TOKEN=3:user
- REACT_APP_HASURA_DEV_USER={"username":"john"}

`REACT_APP_HASURA_DEV_TOKEN` is structured as `{userId}:{role}@{hasuraSecret}`
where the _hasura secret_ is optional.


`REACT_APP_HASURA_DEV_USER` simulates the Auth0 profile informations and it is
completely optional.

## GitPod - Initialize a Workspace

- Import the postgres dump using `adminer` interface. **uncheck `stop on error`**
- Import Hasura's settings using the WebConsole
- Run `npm start` in the `migrations` service
