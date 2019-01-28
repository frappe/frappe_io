<!-- base_template: frappe_io/www/frappejs/frappejs_base.html -->
# Managing Documents

Frappe.js Object-Relational-Mapper (ORM) helps you manage (create, read, update, delete) documents based on the DocTypes declared.

Documents are sub-classed from the `frappe.document.Document` class.

All document write methods are asynchronous and return javascript Promise objects.

### Create:

You can insert a document in the backend with the `insert` method.

```js
// make a new todo
let todo = await frappe.newDoc({
    doctype: 'ToDo',
    subject: 'something'
});
await todo.insert();
```

### Read:

You can read a document from the backend with the `frappe.getDoc` method.

```js
// get all open todos
let todos = await frappe.db.getAll({
    doctype: 'ToDo',
    fields: ['name'],
    filters: {
        status: 'Open'
    }
});
// get the whole document object representing this todo
let first_todo = await frappe.getDoc('ToDo', todos[0].name);
```

### Update:

The `update` method updates a document.

```js
// get all open todos
let first_todo = await frappe.getDoc('ToDo', todos[0].name);
first_todo.set('status', 'Closed');

await first_todo.update();
```

### Delete:

The `delete` method deletes a document.

```js
// get all open todos
let first_todo = await frappe.getDoc('ToDo', todos[0].name);

await first_todo.delete();
```

### Extending Documents:

Each model can be extended by adding events in the [controller](controllers.md) class.
