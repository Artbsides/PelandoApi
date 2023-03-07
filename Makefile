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
		print("	%-12s %s" % (target, help))
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

tests:  ## Run tests. mode=watch|debug/cov
ifneq ($(filter "$(mode)", "dev" "debug" "cov"),)
	@COMPOSE_DEVELOPMENT_COMMAND="npm run tests:$(mode)" \
		docker-compose -f compose.yml -f compose.development.yml up pelando-api
else
	@echo ==== Mode not found.
endif

code-convention:  ## Run lint. mode=analyzer|fix
ifneq ($(filter "$(mode)", "analzer" "fix"),)
	@COMPOSE_DEVELOPMENT_COMMAND="npm run lint:$(mode)" \
		docker-compose -f compose.yml -f compose.development.yml up pelando-api
else
	@echo ==== Mode not found.
endif

secrets:  ## Encrypt or decrypt secrets. environment=staging|production action=encrypt|decrypt
ifeq ("$(action)", "encrypt")
	@SECRETS_PATH=".k8s/$(environment)/secrets"
	@SECRETS_PUBLIC_KEY="$$(cat $$SECRETS_PATH/.sops.yml | awk "/age:/" | sed "s/.*: *//" | xargs -d "\r")"

	@sops -e -i --encrypted-regex "^(data|stringData)$$" -a $$SECRETS_PUBLIC_KEY \
	  $$SECRETS_PATH/.secrets.yml

	@echo "==== Ok"

else ifeq ("$(action)", "decrypt")
	@SECRETS_KEY="$$(kubectl get secret sops-age --namespace argocd -o yaml | awk "/sops-age.txt:/" | sed "s/.*: *//" | base64 -d)"

	@SOPS_AGE_KEY=$$SECRETS_KEY sops -d -i .k8s/$(environment)/secrets/.secrets.yml && \
	  echo "==== Ok"

else
	@echo "==== Action not found."
endif

github-tag:  ## Create or delete github tags. action=create|delete tag=[0-9].[0-9].[0-9]-staging|
ifeq ("$(action)", "create")
	@git tag $(tag) && \
	  git push origin $(tag)

else ifeq ("$(action)", "delete")
	@git tag -d $(tag) && \
	  git push origin :refs/tags/$(tag)

else
	@echo "==== Action not found."
endif

delete-tag:  ##
	@git tag -d $(tag) && \
	  git push origin :refs/tags/$(tag)

start:  ## Run api. mode=dev|debug|prod
ifeq ("$(mode)", "prod")
	@docker-compose up pelando-api
else ifneq ($(filter "$(mode)", "dev" "debug"),)
	@COMPOSE_DEVELOPMENT_COMMAND="npm run start:$(mode)" \
		docker-compose -f compose.yml -f compose.development.yml up pelando-api
else
	@echo ==== Mode not found.
endif


%:
	@:
