.DEFAULT_GOAL := help
SHELL := /bin/bash

.PHONY: help
help:
	@cat $(MAKEFILE_LIST) | grep -E '^[a-zA-Z_-]+:.*?## .*$$' | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: bootstrap
bootstrap:  ## Install build dependencies
	npm install

.PHONY: build
build: bootstrap ## Build project (dummy task for CI)

.PHONY: test
test: ## Run tests
	npm test

.PHONY: integration-test
integration-test: ## Run integration tests
	npm test --integration

.PHONY: markdown-standard-test
markdown-standard-test: ## Run linting on JavaScript examples in markdown using StandardJS
	npm run test:markdown:standard

.PHONY: markdown-standard-test-fix
markdown-standard-test-fix: ## Fix errors found from linting
	npm run test:markdown:standard -- --fix

.PHONY: generate-env-file
generate-env-file: ## Generate the environment file for running the tests inside a Docker container
	scripts/generate_docker_env.sh

.PHONY: bootstrap-with-docker
bootstrap-with-docker: generate-env-file ## Prepare the Docker builder image
	docker build -t notifications-node-client .
	./scripts/run_with_docker.sh make bootstrap

.PHONY: test-with-docker
test-with-docker: ## Run tests inside a Docker container
	./scripts/run_with_docker.sh make test

.PHONY: integration-test-with-docker
integration-test-with-docker: ## Run integration tests inside a Docker container
	./scripts/run_with_docker.sh make integration-test

.PHONY: get-client-version
get-client-version: ## Retrieve client version number from source code
	@node -p "require('./package.json').version"

clean:
	rm -rf .cache venv
