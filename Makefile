start:
	humble up -d && humble logs -f

start-pg:
	humble up -d postgres && humble logs -f

start-fe:
	(cd services/frontend && yarn start)

reset-pg:
	humble do cleanup containers
	rm -rf data/postgres
	humble up -d postgres
	humble logs -f
