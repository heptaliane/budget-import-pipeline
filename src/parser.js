function parseCsvStatement(file, source) {
  const content = file.getBlob().getDataAsString(source.encoding);
  const data = Utilities.parseCsv(content, source.delimiter);
  const validator = newRowValidator(source);

  return data.slice(source.skipRows).map(row => {
    const amount = parseAmount(row, source);
    const product = parseProduct(row, source);
    return {
      date: parseDate(row[source.columns.date], source.interpolateYear),
      product: product,
      amountIn: amount.amountIn,
      amountOut: amount.amountOut,
      category: productResolver.resolveCategory(product),
      expense: productResolver.shouldExpense(product),
    };
  }).filter(row => validator(row));
}

function parseDate(dateStr, interpolateYear) {
  const date = new Date(Date.parse(dateStr));

  if (interpolateYear) {
    const now = new Date();
    date.setYear(now.getFullYear());
    if (now < date) {
      date.setYear(now.getFullYear() - 1);
    }
  }

  return date;
}

function parseProduct(row, source) {
  return source.columns.product.map(i => row[i]).join("");
}

function parseNumber(numStr) {
  return Number(numStr.replace(/(?!^-)[^0-9]+/g, ""));
}

function parseAmount(row, source) {
  if (source.columns.amount !== undefined) {
    const amount = parseNumber(row[source.columns.amount]);
    const isIncome = (amount > 0) === (source.signConversion === "natural");
    return {
      amountIn: isIncome ? Math.abs(amount) : 0,
      amountOut: isIncome ? 0 : Math.abs(amount),
    };
  }

  const amount = {
    amountOut: parseNumber(row[source.columns.amountOut]),
    amountIn: 0,
  };
  if (source.columns.amountIn !== undefined) {
    amount.amountIn = parseNumber(row[source.columns.amountIn]);
  }
  return amount;
}

function createTestFunction(pat) {
  if (pat.exact !== undefined) {
    return (v) => v === pat.exact;
  } else if (pat.prefix !== undefined) {
    return (v) => v.startsWith(pat.prefix);
  } else if (pat.suffix !== undefined) {
    return (v) => v.endsWith(pat.suffix);
  } else if (pat.regexp !== undefined) {
    return (new RegExp(pat.regexp)).test;
  }
  return (_) => false;
}

const productResolver = (function() {
  const rules = config.products.map(p => {
    return {
      test: createTestFunction(p.product),
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

function newRowValidator(source) {
  const rules = source.dropRows.map(r => {
    return {
      test: createTestFunction(r.pattern),
      kind: r.kind,
    };
  });

  return (row) => {
    for (let rule of rules) {
      if (rule.test(row[rule.kind])) {
        return false;
      }
    }
    return true
  };
}
