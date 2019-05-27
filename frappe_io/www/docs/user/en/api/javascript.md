<!-- base_template: frappe_io/www/frappe/frappe_base.html -->
<!-- add-breadcrumbs -->
<!-- title: JavaScript -->
# JavaScript API

Frappe attaches itself to the `window` object under the `frappe` namespace. You
will find most of the Client API under the `frappe` object. All of these methods
are only available inside the Desk. A good way to play with these APIs is from
the browser console.

## frappe.call
`frappe.call(method, args)`

Makes an AJAX request to the server, where the `method` which is the dotted path
to a whitelisted Python method, is executed and it's return value is sent as the
response.

```js
// call with no parameters
frappe.call('ping')
	.then(r => {
		console.log(r)
		// {message: "pong"}
	})

// call with a single parameter
frappe.call('frappe.core.doctype.user.user.get_role_profile', {
	role_profile: 'Test'
}).then(r => {
	console.log(r.message)
})

// call with all options
frappe.call({
	method: 'frappe.core.doctype.user.user.get_role_profile',
	args: {
		role_profile: 'Test'
	},
	// disable the button until the request is completed
	btn: $('.primary-action'),
	// freeze the screen until the request is completed
	freeze: true,
	callback: (r) => {
		// on success
	},
	error: (r) => {
		// on error
	}
})
```

## frappe.get_route
`frappe.get_route()`

Returns the current route as an array.
```js
frappe.get_route()
// ["List", "Task", "List"]
```

## frappe.set_route
`frappe.set_route(route)`

Changes the current route to `route`.
```js
// route in parts
frappe.set_route('List', 'Task', 'List')
// route as array
frappe.set_route(['List', 'Task', 'Gantt'])
// route as string
frappe.set_route('List/Event/Calendar')
```

## frappe.ui.form.make_control
`frappe.ui.form.make_control({ parent, df })`

Makes a frappe control based on `df` properties and appends into `parent`
container.

```js
frappe.ui.form.make_control({
	parent: $wrapper.find('.my-control'),
	df: {
		label: 'Due Date',
		fieldname: 'due_date',
		fieldtype: 'Date'
	},
	render_input: true
})
```

Here are the `df` properties for most of frappe control types.

```js
// Attach
{
	label: 'Attachment',
	fieldname: 'attachment',
	fieldtype: 'Attach'
}

// Attach Image
{
	label: 'User Image',
	fieldname: 'user_image',
	fieldtype: 'Attach Image'
}

// Autocomplete
{
	label: 'Select User',
	label: 'user',
	fieldtype: 'Autocomplete',
	options: [
		'faris@erpnext.com',
		'suraj@erpnext.com'
	]
}

// Barcode
{
	label: 'Item Barcode',
	fieldname: 'item_barcode',
	fieldtype: 'Barcode'
}

// Check
{
	label: 'Enable feature',
	fieldname: 'enable_feature',
	fieldtype: 'Check'
}

// Code
{
	label: 'JS Script',
	fieldname: 'script',
	fieldtype: 'Code',
	// for syntax highlighting
	options: 'Javascript' // JS, HTML, CSS, Markdown, SCSS, JSON
}

// Color
{
	label: 'Your favorite color',
	fieldname: 'user_color',
	fieldtype: 'Color'
}

// Currency
{
	label: 'Amount',
	fieldname: 'amount',
	fieldtype: 'Currency',
	options: 'INR' // or name of field which holds currency
}

// Data
{
	label: 'First Name',
	fieldname: 'first_name',
	fieldtype: 'Data'
}

// Date Range
{
	label: 'Select Date Range',
	fieldname: 'date_range',
	fieldtype: 'Date Range'
}

// Date
{
	label: 'Birth Date',
	fieldname: 'birth_date',
	fieldtype: 'Date'
}

// Datetime
{
	label: 'Submission Date and Time',
	fieldname: 'submission',
	fieldtype: 'Datetime'
}

// Dynamic Link
{
	label: 'Party',
	fieldname: 'party',
	fieldtype: 'Dynamic Link',
	options: 'party_type' // fieldname which holds the Link type
}

// Float
{
	label: 'Threshold',
	fieldname: 'threshold',
	fieldtype: 'Float'
}

// Geolocation
{
	label: 'Meeting Place',
	fieldname: 'meeting_place',
	fieldtype: 'Geolocation'
}

// HTML Editor
{
	label: 'Custom HTML',
	fieldname: 'custom_html',
	fieldtype: 'HTML Editor'
}

// Int
{
	label: 'No of days',
	fieldname: 'no_of_days',
	fieldtype: 'Int'
}

// Link
{
	label: 'Select User',
	fieldname: 'user',
	fieldtype: 'Link',
	options: 'User' // name of doctype
}

// Markdown Editor
{
	label: 'Blog Content',
	fieldname: 'content',
	fieldtype: 'Markdown Editor'
}

// MultiCheck
{
	label: 'Blog Content',
	fieldname: 'content',
	fieldtype: 'MultiCheck',
	options: [
		'Option 1',
		'Option 2',
		'Option 3',
		'Option 4',
	],
	columns: 2 // break into 2 columns
}

// MultiSelect
{
	label: 'Select Users',
	fieldname: 'users',
	fieldtype: 'MultiSelect',
	options: [
		'faris@erpnext.com',
		'suraj@erpnext.com',
		'shivam@erpnext.com'
	]
}

// Password
{
	label: 'New Password',
	fieldname: 'password',
	fieldtype: 'Password'
}

// Rating
{
	label: 'Rate your experience',
	fieldname: 'rating',
	fieldtype: 'Rating'
}

// Select
{
	label: 'Status',
	fieldname: 'status',
	fieldtype: 'Select',
	options: [
		'Open',
		'Closed',
		'Cancelled'
	]
}

// Signature
{
	label: 'Status',
	fieldname: 'status',
	fieldtype: 'Signature'
}

// Text Editor
{
	label: 'Description',
	fieldname: 'description',
	fieldtype: 'Text Editor'
}

// Time
{
	label: 'In Time',
	fieldname: 'in_time',
	fieldtype: 'Time'
}
```

## frappe.ui.Dialog
`new frappe.ui.Dialog({ title, fields, primary_action })`

Creates a new Dialog instance.

```js
let d = new frappe.ui.Dialog({
	title: 'Enter details',
	fields: [
		{
			label: 'First Name',
			fieldname: 'first_name',
			fieldtype: 'Data'
		},
		{
			label: 'Last Name',
			fieldname: 'last_name',
			fieldtype: 'Data'
		},
		{
			label: 'Age',
			fieldname: 'age',
			fieldtype: 'Int'
		}
	],
	primary_action_label: 'Submit',
	primary_action(values) {
		console.log(values);
		d.hide();
	}
});

d.show();
```

![Dialog](/docs/assets/img/frappe-ui-dialog.png)
*frappe.ui.Dialog*

## frappe.msgprint
`frappe.msgprint(message)` or `frappe.msgprint({ title, message, indicator })`

Show `message` in a modal.

```js
// only message
frappe.msgprint(__('Document updated successfully'))

// with options
frappe.msgprint({
	title: __('Notification'),
	indicator: 'green',
	message: __('Document updated successfully')
})
```

## frappe.throw
`frappe.throw(error_message)`

Show `error_message` in a modal and `throw` exception.

```js
frappe.throw(__('Start date cannot be after end date'))
```

## frappe.prompt
`frappe.prompt(label)` or `frappe.prompt(df)` or `frappe.prompt(fields)`

Prompt user for a value or list of values.

```js
// prompt for single value of type Data
frappe.prompt('First Name', ({ value }) => console.log(value))

// Set title and button label
frappe.prompt('First Name', console.log, 'Enter First Name', 'Submit');

// prompt for single value of any type
frappe.prompt({
	label: 'Birth Date',
	fieldname: 'date',
	fieldtype: 'Date'
}, (values) => {
	console.log(values.date);
})

// prompt for multiple values
frappe.prompt([
	{
		label: 'First Name',
		fieldname: 'first_name',
		fieldtype: 'Data'
	},
	{
		label: 'Last Name',
		fieldname: 'last_name',
		fieldtype: 'Data'
	},
], (values) => {
	console.log(values.first_name, values.last_name);
})
```

## frappe.confirm
`frappe.confirm(message, if_yes, if_no)`

Show a confirmation modal, executes `if_yes` if confirmation is given else
executes `if_no`.

```js
frappe.confirm('Are you sure you want to delete this document?',
	() => {
		// delete document
	}, () => {
		// do nothing
	})
```

## frappe.format
`frappe.format(value, df, options, doc)`

Format a raw value into user presentable format.

```js
frappe.format('2019-09-08', { fieldtype: 'Date' })
// "09-08-2019"

frappe.format('2399', { fieldtype: 'Currency', options: 'currency' }, { inline: true })
// "2,399.00"
```

## frappe.db.get_doc
`frappe.db.get_doc(doctype, name, filters)`

Returns the Document object of `doctype` and `name`. If `name` is not provided,
gets the first document matched by `filters`.

```js
// get doc by name
frappe.db.get_doc('Task', 'TASK00002')
	.then(doc => {
		console.log(doc)
	})

// get doc by filters
frappe.db.get_doc('Task', null, { status: 'Open' })
	.then(doc => {
		console.log(doc)
	})
```

## frappe.db.get_list
`frappe.db.get_list(doctype, { fields, filters })`

Returns a list of records of `doctype` with `fields` and `filters`.

```js
frappe.db.get_list('Task', {
	fields: ['subject', 'description'],
	filters: {
		status: 'Open'
	}
}).then(records => {
	console.log(records);
})
```

## frappe.db.get_value
`frappe.db.get_value(doctype, name, fieldname)`

Returns a document's field value or a list of values.

```js
// single value
frappe.db.get_value('Task', 'TASK00004', 'status')
	.then(r => {
		console.log(r.message.status) // Open
	})

// multiple values
frappe.db.get_value('Task', 'TASK00004', ['status', 'subject'])
	.then(r => {
		let values = r.message;
		console.log(values.status, values.subject)
	})

// using filters
frappe.db.get_value('Task', {status: 'Open'}, 'subject')
	.then(r => {
		let values = r.message;
		console.log(values.subject)
	})
```

## frappe.db.get\_single\_value
`frappe.db.get_single_value(doctype, field)`

Returns a field value from a Single DocType.

```js
frappe.db.get_single_value('System Settings', 'time_zone')
	.then(time_zone => {
		console.log(time_zone);
	})
```

## frappe.db.set_value
`frappe.db.set_value(doctype, docname, fieldname, value, callback)`

Sets a document's property using `frappe.get_doc` and `doc.save` on server.

```js
// update a field's value
frappe.db.set_value('Task', 'TASK00004', 'status', 'Open')
	.then(r => {
		let doc = r.message;
		console.log(doc);
	})

// update multiple fields
frappe.db.set_value('Task', 'TASK00004', {
	status: 'Working',
	priority: 'Medium'
}).then(r => {
	let doc = r.message;
	console.log(doc);
})
```

## frappe.db.insert
`frappe.db.insert(doc)`

Insert a new document.

```js
frappe.db.insert({
	doctype: 'Task',
	subject: 'New Task'
}).then(doc => {
	console.log(doc);
})
```

## frappe.db.count
`frappe.db.count(doctype, filters)`

Returns number of records for a given `doctype` and `filters`.

```js
// total number of Task records
frappe.db.count('Task')
	.then(count => {
		console.log(count)
	})

// total number of Open Tasks
frappe.db.count('Task', { status: 'Open' })
	.then(count => {
		console.log(count)
	})
```

## frappe.db.delete_doc
`frappe.db.delete_doc(doctype, name)`

Delete a document identified by `doctype` and `name`.

```js
frappe.db.delete_doc('Task', 'TASK00004')
```

## frappe.db.exists
`frappe.db.exists(doctype, name)`

Returns true if a document record exists.

```js
frappe.db.exists('Task', 'TASK00004')
	.then(exists => {
		console.log(exists) // true
	})
```

## frappe.provide
`frappe.provide(namespace)`

Creates a namespace attached to the window object if it doesn't exist.

```js
frappe.provide('frappe.ui.form');

// has the same effect as
window.frappe = {}
window.frappe.ui = {}
window.frappe.ui.form = {}
```

## frappe.require
`frappe.require(asset_path, callback)`

Load a JS or CSS asset asynchronously. It is used for libraries that are not
used often.

```js
// load a single asset
frappe.require('/assets/frappe/chat.js', () => {
	// chat.js is loaded
})

// load multiple assets
frappe.require(['/assets/frappe/chat.js', '/assets/frappe/chat.css'], () => {
	// chat.js and chat.css are loaded
})
```
