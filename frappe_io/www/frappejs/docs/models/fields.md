# Fields

Fields are properties a the document instance that are defined in its DocType.

## Field Types:

- <h3>Data:</h3>

    Small, single line text (140 chars).

- <h3>Text:</h3>

    Long multi-line text.

- <h3>Int:</h3>

    Integer.

- <h3>Float:</h3>

    Number.

- <h3>Currency:</h3>

    Number with currency.

- <h3>Code:</h3>

    Code string (like Text but monospaced).

- <h3>Date:</h3>

    Date (formatted by [SystemSettings.dateFormat](/frappejs/docs/utilities/system-settings.md)).

- <h3>Select:</h3>

    Dropdown with fixed options. Options must be set in the `options` property.

    ```
    {
        fieldtype: "Select",
        fieldname: "status",
        label: "Status",
        options: [
            "Open",
            "Closed",
            "Pending"
        ]

    }
    ```

- <h3>Link:</h3>

    Reference to another document set by `target`.

    ```
    {
        fieldtype: "Link",
        fieldname: "customer",
        label: "Customer",
        target: "Customer"
    }
    ```

- <h3>Table:</h3>

    Property with child documents, the type of children is defined by `childtype` property.

    ```
    {
        fieldtype: "Table",
        fieldname: "items",
        label: "Items",
        target: "InvoiceItem"
    }
    ```
