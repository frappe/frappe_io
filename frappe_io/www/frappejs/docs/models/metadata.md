# Metadata

Metadata are first class objects in Frappe.js. You can get a metadata object by `frappe.getMeta`. All objects from the `models` folders of all modules are loaded.

##### Example:

```js
let todoMeta = frappe.getMeta('ToDo');

// get all fields of type "Data"
let dataFields = todoMeta.getFieldsWith({ fieldtype: 'Data' })
```
