# Backends

Frappe.js comes with built-in backends for data storage. These can be client-side or server-side :

- SQLite.
- REST.

There can be only one backend at a time that can be accessed by the `frappe.db` property.

### API

The backend will implement the following `async` methods:

- `getDoc`.
- `getAll`.
- `getValue`.
- `insert`.
- `update`.

### SQLite Backend:

Connection parameter required for the sqlite backend is the path of the file.

```js
const SQLite = require('frappejs/frappe/backends/sqlite');

frappe.db = await new SQLite({ dbPath: dbPath });
```

### SQL Queries:

You can also directly write SQL with `frappe.db.sql`.

```js
allTodos = frappe.db.sql('select name from todo');
```

### REST Backend:

For the client, the backend is the REST API that executes calls with web-requests.

Before using, you must initialize the `frappe.fetch` property with `window.fetch` or `node-fetch`.

```js
const HTTPClient = require('frappejs/frappe/backends/http');

frappe.fetch = window.fetch.bind();
frappe.db = await new HTTPClient({server: server});
```
