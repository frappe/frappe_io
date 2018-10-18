# Desk

Desk includes the default routing and menu system for the single page application.

### Menus:

You can add a new menu to the desk via:

```js
frappe.desk.add_sidebar_item('New ToDo', '#new/todo');
```

### Views:

Default route handling for various views:

- <h4>List Documents</h4>

  All list views are rendered at `/list/:doctype`.

- <h4>Edit Documents</h4>

  Documents can be edited via `/edit/:doctype/:name`.

- <h4>New Documents</h4>

  New Documents can be created via `/new/:doctype`.
