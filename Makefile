
start-hasura:
	humble up -d && humble logs -f

start-fe:
	(cd services/frontend && yarn start)
