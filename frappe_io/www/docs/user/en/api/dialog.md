---
base_template: frappe_io/www/frappe/frappe_base.html
add_breadcrumbs: 1
title: Dialog - API
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  API methods for creating and managing Dialogs in Frappe
---

# Dialog API
Frappe provides a group of standard, interactive and flexible dialogs that are easy to configure and use.

## Contents
1. [JavaScript API](#javascript-api)
2. [Python API](#python-api)

----

## JavaScript API
### frappe.ui.Dialog
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

![Dialog](/docs/assets/img/api/dialog-api-custom-dialog.png)
*frappe.ui.Dialog*

### frappe.msgprint
`frappe.msgprint(message)` or `frappe.msgprint({ title, message, indicator })`

Show `message` in a modal.

```js
// only message
frappe.msgprint(__('Document updated successfully'));

// with options
frappe.msgprint({
	title: __('Notification'),
	indicator: 'green',
	message: __('Document updated successfully')
});
```
![Msgprint](/docs/assets/img/api/dialog-api-msgprint.png)
*frappe.msgprint*

You can also bind a primary action to this dialog by passing `action`(as a method) within `primary_action`. Alternatively, `primary_action` can contain `server_action`  **or**  `client_action`.

The `server_action` and `client_action` are dotted paths to the respective methods which will execute on clicking the primary button.

```js
// with primary action
 frappe.msgprint({
	title: __('Notification'),
	message: __('Are you sure you want to proceed?'),
	primary_action:{
		action(values) {
        	console.log(values);
		}
	}
});

// with server and client action
frappe.msgprint({
	title: __('Notification'),
	message: __('Are you sure you want to proceed?'),
	primary_action: {
	'label': 'Proceed',
	// either one of the actions can be passed
	'server_action': 'dotted.path.to.method',
	'client_action': 'dotted_path.to_method',
	'args': args
	}
});
```
![Msgprint with Primary Action](/docs/assets/img/api/dialog-api-msgprint-with-primary-action.png)
*frappe.msgprint with primary action bound*


### frappe.throw
`frappe.throw(error_message)`

Show `error_message` in a modal and `throw` exception.

```js
frappe.throw(__('This is an Error Message'))
```
![Throw](/docs/assets/img/api/dialog-api-throw.png)
*frappe.throw*

### frappe.prompt
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
![Prompt](/docs/assets/img/api/dialog-api-prompt.png)
*frappe.prompt*

### frappe.confirm
`frappe.confirm(message, if_yes, if_no)`

Show a confirmation modal, executes `if_yes` if confirmation is given else
executes `if_no`.

```js
frappe.confirm('Are you sure you want to proceed?',
	() => {
		// action to perform if Yes is selected
	}, () => {
		// action to perform if No is selected
	})
```
![Prompt](/docs/assets/img/api/dialog-api-confirm.png)
*frappe.confirm*

### frappe.show_alert
`frappe.show_alert(message, seconds)` or `frappe.show_alert({message, indicator}, seconds)`

Alert Dialog is used for showing non-obstructive messages.

Its parameters include  `message`, which can contain the indicator color as well, and its display duration. The default is **3 seconds**.

```js
frappe.show_alert('Hi, you have a new message', 5);

//show_alert with indicator
frappe.show_alert({message:__('Hi, you have a new message'), indicator:'green'}, 5);
```

![Show Alert](/docs/assets/img/api/dialog-api-show-alert.png)
*frappe.show_alert*

### frappe.show_progress
`frappe.show_progress(title, count, total, description)`

Displays a progress bar with `count` (as current progress) and `total` (as maximum progress value).

```js
frappe.show_progress('Loading..', 70, 100, 'Please wait');
```

![Show Progress](/docs/assets/img/api/dialog-api-progress.png)
*frappe.show_progress*

### frappe.ui.form.MultiSelectDialog
`new frappe.ui.form.MultiSelectDialog({ doctype, target, setters, date_field, get_query, action })`

A MultiSelectDialog consists of filter fields followed by a multiple selection list. The primary button will perform the passed `action` on the selected options.

By default, the **Search Term** field and **Date Range** field will compose the filter fields.

The argument list includes:

- `doctype`: The source to fetch and display selection entries from.
- `target`: The target where the modal is to be displayed.
- `setters`: These will compose the filter fields and values to populate them with. These also translate to custom columns for the selection list.
- `date_field`: It is necessary to pass the `date_field` of the DocType in consideration.
- `get_query`: A function that returns `query` and `filters` to query the selection list. A custom server side method can be passed via `query`, and `filters` will be passed to that method.
- `action`: Contains the primary action to be performed on the selected options. It takes `selections` as a parameter, which comprises of the selected options.

Let us assume we want to fetch  Material Requests into our dialog. We can then go on to invoke the MultiSelectDialog in the following manner:

```js
new frappe.ui.form.MultiSelectDialog({
	doctype: "Material Request",
	target: this.cur_frm,
	setters: {
		company: "Zoot"
	},
	date_field: "transaction_date",
	get_query() {
		return {
			filters: { docstatus: ['!=', 2] }
		}
	},
	action(selections) {
		console.log(selections);
	}
});

// MultiSelectDialog with custom query method
let query_args = {
	query:"dotted.path.to.method",
	filters: { docstatus: ["!=", 2], supplier: "John Doe" }
}

new frappe.ui.form.MultiSelectDialog({
	doctype: "Material Request",
	target: this.cur_frm,
	setters: {
		company: "Zoot"
	},
	date_field: "transaction_date",
	get_query() {
		return query_args;
	},
	action(selections) {
		console.log(selections);
	}
});
```

![MultiSelectDialog](/docs/assets/img/api/dialog-api-multiselectdialog.png)
*frappe.ui.form.MultiSelectDialog*

Here all the Material Requests that fulfill the filter criteria will be fetched into the selection area. The setter `company` is added to the filter fields along with its passed value. The `date_field` will be used to fetch and query dates from the DocType mentioned.

The **Make Material Request** (or `Make {DocType}`) secondary action button will redirect you to a new form in order to make a new entry into the DocType passed.

----

## Python API
### frappe.msgprint
`frappe.msgprint(msg, title, raise_exception, as_table, indicator, primary_action)`

Shows a message to the user and can optionally throw an exception as well.

The argument list includes:

- `msg`: The message to be displayed
- `title`: Title to the modal
- `raise_exception`: Exception
- `as_table`: If `msg` is a list of lists, render as HTML table
- `primary_action`: Bind a primary server/client side action.

```py
frappe.msgprint(msg='This file does not exist',
	title='Error',
	raise_exception=FileNotFoundError)
```
![MultiSelectDialog](/docs/assets/img/api/dialog-api-msgprint-py.png)
*frappe.msgprint*

`primary_action` can contain a `server_action` **or** `client_side` action which must contain dotted paths to the respective methods. The JavaScript function must be a globally available function.

```py
# msgprint with server and client side action
frappe.msgprint(msg='This file does not exist',
	title='Error',
	raise_exception=FileNotFoundError
	primary_action={
		'label': _('Perform Action'),
		'server_action': 'dotted.path.to.method',
		'client_action': 'dotted_path.to_method',
		'args': args })
```

![MultiSelectDialog](/docs/assets/img/api/dialog-api-msgprint-py-with-primary-action.png)
*frappe.msgprint with primary action*

### frappe.throw
`frappe.throw(msg, exc, title)`

It is essentially a wrapper around `frappe.msgprint`.

`exc` can be passed an optional exception. By default it will raise a `ValidationError` exception.

```py
frappe.throw(msg='This file does not exist',
	exc=FileNotFoundError,
	title='Error')
```
![Throw-py](/docs/assets/img/api/dialog-api-msgprint-py.png)
*frappe.throw*