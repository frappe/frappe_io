
# Client

Frappe.js also comes with Vue Components like List, Form and FormControl. They can be used to provide UI interaction to your models.

These components use the HTTPClient to fetch data from the server and render them.

You can use the same document API in the client as in the server, the only difference being that the data will be fetched via REST API in the background.

## Desk

The Desk component is the parent component which sets up the List, Form, Sidebar and Navbar components. Here is how you can setup your App.vue file.

```html
<template>
  <div id="app">
    <frappe-desk>
      <router-view />
    </frappe-desk>
  </div>
</template>
<script>
import Vue from 'vue';
import FrappeDesk from 'frappejs/ui/components/Desk';

export default {
  name: 'App',
  components: {
    FrappeDesk
  }
}
</script>
```

You also need to register the core routes by importing them from frappejs.

```js
// router.js
import Vue from 'vue';
import Router from 'vue-router';
import coreRoutes from 'frappejs/ui/routes';
import SomeComponent from './components/someComponent';

Vue.use(Router);

const routes = [
	...coreRoutes,
	[
		{
			path: '/your-app-route',
			name: 'Some Component',
			component: SomeComponent
		}
	]
];

export default new Router({ routes });
```

##### List

The List Component handles object listing and paging for a standard model.

You can view the list of a doctype on the route `list/:doctype`, for e.g `list/ToDo`

##### Form

Forms are automatically created from the model (DocType).

Form component create the controls and also handles insert and update.

You can view the Form of a doctype on the route `edit/:doctype/:name`, for e.g `edit/ToDo/d1d8s8d7d`

##### Form Control

Frappe.js comes in with built-in controls for various types of inputs. They are already used in the Form component to render the doctype fields based on their fieldtype. You can use them separately by using the `frappe-control` component registered in Vue.

```html
<template>
	<div>
		This is simple control
		<frappe-control
			:docfield="{
				fieldtype: 'Data',
				label: 'First Name',
				fieldname: 'firstName'
			}"
			:value="John Doe"
			:doc="doc"
			@change="value => handleChange(value)"
		/>
	</div>
</template>
```

### REST Client:

Frappe.js comes with a built in REST client so you can also use REST as a database backend with the Frappe.js API.

#### Create, Read, Update, Delete:

You can manage documents, using the same Document API as if it were a local database.

##### Example:

```js
await frappe.init();
frappe.db = new HTTPClient({ server: 'localhost:8000' });

let doc = await frappe.getDoc({doctype:'ToDo', subject:'test rest insert 1'});
await doc.insert();

doc.subject = 'subject changed';
await doc.update();

let data = await frappe.db.getAll({doctype:'ToDo'});
```
