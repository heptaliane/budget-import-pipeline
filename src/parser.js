function parseCsvStatement(file, source) {
  const content = file.getBlob().getDataAsString(source.encoding);
  const data = Utilities.parseCsv(content);

  return data.slice(source.skipRows).filter(row => {
    return !productResolver.shouldExpense(row[source.columns.product]);
  }).map(row => {
    return {
      date: new Date(Date.parse(row[source.columns.date])),
      product: row[source.columns.product],
      amount: Number(row[source.columns.amount]),
      category: productResolver.resolveCategory(row[source.columns.product]),
    };
  });
}

const productResolver = (function() {
  const rules = config.products.map(p => {
    let test = (_) => true;
    if (p.product.exact !== undefined) {
      test = (v) => v === p.product.exact;
    } else if (p.product.prefix !== undefined) {
      test = (v) => v.startsWith(p.product.prefix);
    } else if (p.product.suffix !== undefined) {
      test = (v) => v.endsWith(p.product.suffix);
    } else if (p.product.regexp !== undefined) {
      test = (new RegExp(p.product.regexp)).test;
    }

    return {
      test: test,
      category: p.category,
      expense: p.expense,
    };
  });

  return {
    resolveCategory: (product) => {
      const found = rules.find(r => r.test(product));
      return found === undefined ? "" : found.category;
    },
    shouldExpense: (product) => {
      const found = rules.find(r => r.test(product));
      return found === undefined ? false : found.expense;
    },
  }
})();
