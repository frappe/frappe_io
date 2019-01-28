<!-- base_template: frappe_io/www/frappejs/frappejs_base.html -->
# System Settings

SystemSettings is a [Single document](/frappejs/docs/models/singles.md) that has system defaults like:

- `dateFormat`: default date format.

You can get system settings as :

```js
let settings = frappe.getSingle("SystemSettings");
```
