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
    skipRows: *0 | (int & >= 0)
    columns: {
        date: int & >= 0
        product: int & >= 0
        amount: int & >= 0
    }
}

#Product: {
    product: #Pattern
    category?: string
    expense: *false | bool
}

#Pattern: {exact: string} | {prefix: string} | {suffix: string} | {regexp: string}
