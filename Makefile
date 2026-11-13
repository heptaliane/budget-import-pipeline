CONFIG_FILE := config.yaml

.PHONY: push vet

push: build
	clasp push

vet:
	@cue vet $(CONFIG_FILE) schema.cue

build:
	@printf "const config = " > src/config.js
	@cue export $(CONFIG_FILE) schema.cue --out json >> src/config.js
