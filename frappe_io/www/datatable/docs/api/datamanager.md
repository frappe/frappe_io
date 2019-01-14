<!-- base_template: frappe_io/www/datatable/datatable_base.html -->
## DataManager

All the methods listed here are available on the `datatable.datamanager` property.

Example
```javascript
const datatable = new DataTable(container, options);
datatable.datamanager.getRows();
```

#### sortRows

Sorts rows according the values in the column identified by `colIndex` and order `sortOrder`.

```javascript
sortRows(colIndex: Number, sortOrder: 'asc | desc | none'): void

// Usage
datatable.datamanager.sortRows(data, columns);
```

---
