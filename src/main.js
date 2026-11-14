function onFormSubmit(e) {
  try {
    const resps = e.response.getItemResponses();
    const data = resps.reduce((acc, resp) => {
      const title = resp.getItem().getTitle();
      const answer = resp.getResponse();

      return Object.assign(acc, { [title]: answer });
    }, {});

    const source = config.sources[data[config.form_keys.kind]];
    if (data[config.form_keys.file] === undefined) {
      console.warn("File not found.");
      return
    }

    for (let fileId of data[config.form_keys.file]) {
      const file = DriveApp.getFileById(fileId);

      const rows = parseCsvStatement(file, source);

      appendTransactionsToSheet(
        rows,
        data[config.form_keys.kind],
        data[config.form_keys.account],
      );
    }

  } catch (err) {
    console.error("Error in onFormSubmit: " + err.message);
  }
}

function appendTransactionsToSheet(rows, kind, account) {
  const ss = SpreadsheetApp.openById(config.output_spreadsheet_id);
  const sheet = ss.getSheetByName("transactions");

  const rowsToAppend = rows.map(row => [
    row.date,
    row.product,
    row.amount,
    row.category,
    kind,
    account,
    row.expense,
  ]);

  if (rowsToAppend.length > 0) {
    sheet.getRange(
      sheet.getLastRow() + 1,
      1,
      rowsToAppend.length,
      rowsToAppend[0].length,
    ).
      setValues(rowsToAppend);
    console.log(`Insert ${rowsToAppend.length} rows`);
  }
}
