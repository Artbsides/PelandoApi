.ONESHELL:

SHELL  = /bin/bash
PYTHON = /usr/bin/python3

-include .env
export


define PRINT_HELP_PYSCRIPT
import re, sys

for line in sys.stdin:
	match = re.match(r'^([a-zA-Z_-]+):.*?## (.*)$$', line)
	if match:
		target, help = match.groups()
		print("	%-20s %s" % (target, help))
endef
export PRINT_HELP_PYSCRIPT


help:
	@echo "Usage: make <command>"
	@echo "Options:"
	@$(PYTHON) -c "$$PRINT_HELP_PYSCRIPT" < $(MAKEFILE_LIST)


build:  ## Build images
	@docker-compose build

redis:  ## Run redis
	@docker-compose up redis -d

postgres:  ## Run postgres
	@docker-compose up postgres -d

install:  ## Install api dependencies
	@COMPOSE_DEVELOPMENT_COMMAND="npm ci" \
		docker-compose -f compose.yml -f compose.development.yml up pelando-api

start:  ## Run api. mode=dev|debug|prod
ifeq ("$(mode)", "prod")
	@docker-compose up pelando-api
else ifneq ($(filter "$(mode)", "dev" "debug"),)
	@COMPOSE_DEVELOPMENT_COMMAND="npm run start:$(mode)" \
		docker-compose -f compose.yml -f compose.development.yml up pelando-api
else
	@echo ====== Mode not found.
endif


%:
	@:
