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