-include .env
export

.PHONY: build

build:
	@echo "const SOURCE_FOLDER_ID = '${SOURCE_FOLDER_ID}';" > src/config.js
	@echo "const OUTPUT_SPREADSHEET_ID = '${OUTPUT_SPREADSHEET_ID}';" >> src/config.js
	clasp push
