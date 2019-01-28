<!-- base_template: frappe_io/www/frappejs/frappejs_base.html -->
# Fields

Fields are properties a the document instance that are defined in its DocType.

## Field Types:

##### Data:

Small, single line text (140 chars).

```js
{
    fieldtype: "Data",
    fieldname: "firstName",
    label: "First Name"
}
```

##### Text:

Long multi-line text.

```js
{
    fieldtype: "Text",
    fieldname: "description",
    label: "Description"
}
```

##### Int:

Integer.

```js
{
    fieldtype: "Int",
    fieldname: "noOfDays",
    label: "No of Days"
}
```

##### Float:

Number.

```js
{
    fieldtype: "Float",
    fieldname: "length",
    label: "Length"
}
```

##### Currency:

Number with currency.

```js
{
    fieldtype: "Currency",
    fieldname: "amount",
    label: "Amount"
}
```

##### Code:

Code string (like Text but monospaced).

```js
{
    fieldtype: "Code",
    fieldname: "htmlTemplate",
    label: "HTML Template"
}
```

##### Date:

Date (formatted by [SystemSettings.dateFormat](/frappejs/docs/utilities/system-settings.md)).

```js
{
    fieldtype: "Date",
    fieldname: "startDate",
    label: "Start Date"
}
```

##### Select:

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

##### Link:

Reference to another document set by `target`.

```
{
    fieldtype: "Link",
    fieldname: "customer",
    label: "Customer",
    target: "Customer"
}
```

##### Table:

Property with child documents, the type of children is defined by `childtype` property.

```
{
    fieldtype: "Table",
    fieldname: "items",
    label: "Items",
    childtype: "InvoiceItem"
}
```
