.PHONY: build

build:
	@cat << EOF >> src/config.js
	const SOURCE_FOLDER_ID = "${SOURCE_FOLDER_ID}";
	const OUTPUT_SPREADSHEET_ID = "${OUTPUT_SPREADSHEET_ID}";
	EOF
	clasp push
