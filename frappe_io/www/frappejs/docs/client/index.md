# Client

Frappe.js comes with built in single-page-application (SPA) with routing, views, list and form objects.

In building the client, you can use the REST API to query data, and use the models and controllers declared in your module.

You can use the same document API in the client as in the server, the only difference being that the data will be fetched via REST API in the background.

### Routing:

- [Router](/frappejs/docs/client/router.md).

### Views:

- [Page](/frappejs/docs/client/page.md).
- [List](/frappejs/docs/client/lists.md).
- [Form](/frappejs/docs/client/forms.md).

### Starting:

You can setup your client by setting up the server and then importing your controllers with `require`.

##### Example:

```js
const client = require('frappejs/frappe/client');

client.start({
	server: 'localhost:8000',
	container: document.querySelector('.container'),
}).then(() => {
	const todo = require('frappejs/frappe/models/doctype/todo/todo.js');
	frappe.init_controller('todo', todo);

	// ....
});
```

### REST Client:

Frappe.js comes with a built in REST client so you can also use REST as a database backend with the Frappe.js API.

#### Create, Read, Update, Delete:

You can manage documents, using the same Document API as if it were a local database.

##### Example:

```js
await frappe.init();
await frappe.initDb('rest', {server: 'localhost:8000'});

let doc = await frappe.getDoc({doctype:'ToDo', subject:'test rest insert 1'});
await doc.insert();

doc.subject = 'subject changed';
await doc.update();

let data = await frappe.db.getAll({doctype:'ToDo'});
```
