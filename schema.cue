package config

#Config

#Config: {
    trigger_form_id: string & != ""
    source_folder_id: string & != ""
    output_spreadsheet_id: string & != ""

    form_keys: #FormKeys

    sources: [string]: #Source
    products: [...#Product]
}

#FormKeys: {
    kind: string
    account: string
    file: string
}

#Source: {
    encoding: *"UTF-8" | "SHIFT_JIS"
    delimiter: *"," | "\t"
    skipRows: *0 | (int & >= 0)
    dropRows: *[] | [...#RowCondition]
    columns: {
        date: int & >= 0
        product: int & >= 0
        amount: int & >= 0
    }
    interpolateYear: *false | bool
    invertAmount: *false | bool
}

#RowCondition: {
    kind: "date" | "product" | "amount" | "category" | "expense"
    pattern: #Pattern
}

#Product: {
    product: #Pattern
    category?: string
    expense: *false | bool
}

#Pattern: {exact: string | int} | {prefix: string} | {suffix: string} | {regexp: string}
