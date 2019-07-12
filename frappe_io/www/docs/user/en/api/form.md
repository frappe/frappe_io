---
base_template: frappe_io/www/frappe/frappe_base.html
add_breadcrumbs: 1
title: Form Scripts - API
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  Everything you need to know about Form Scripts and available API methods.
---

# Form Scripts

Form Scripts lets you add client side logic to your Forms. You can write Form
Scripts for automatically fetching values, adding validation or adding
contextual actions to your Form.

## Standard Form Scripts

When you create a new DocType, a `{doctype}.js` is created where you can write
your form script.

Syntax:

```js
frappe.ui.form.on(doctype, {
	event1() {
		// handle event 1
	},
	event2() {
		// handle event 2
	}
})
```

For example, `todo.js` which is located at `frappe/desk/doctype/todo/todo.js`
may look like this:

```js
// Script for ToDo Form
frappe.ui.form.on('ToDo', {
	// on refresh event
	refresh(frm) {
		// if reference_type and reference_name are set,
		// add a custom button to go to the reference form
		if (frm.doc.reference_type && frm.doc.reference_name) {
			frm.add_custom_button(__(frm.doc.reference_name), () => {
				frappe.set_route("Form", frm.doc.reference_type, frm.doc.reference_name);
			});
		}
	}
})
```

### Child Table Scripts

Child Table Scripts should be written in the same file as their parent.

```js
frappe.ui.form.on('Quotation', {
	// ...
})

frappe.ui.form.on('Quotation Item', {
	// cdt is Child DocType name i.e Quotation Item
	// cdn is the row name for e.g bbfcb8da6a
	item_code(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);
	}
})
```

## Custom Form Scripts

You can also write form scripts by creating **Custom Script** in the system. You
should write Custom Scripts if the logic is specific to your site. If you want
to share Form Scripts across sites, you must include them via Apps.

To create a new Custom Script, go to

**Home > Customization > Custom Script > New**

![New Custom Script](/docs/assets/img/new-custom-script.png)
*New Custom Script*

## Form Events

Form Scripts depend on events to trigger. Here are the list of all Form Events
that are triggered by Form.

These events will get `frm` as the first parameter in their handler functions.

```js
frappe.ui.form.on('ToDo', {
	// frm passed as the first parameter
	setup(frm) {
		// write setup code
	}
})
```

Event Name            | Description
----------------------| -------------
`setup` | Triggered once when the form is created for the first time
`before_load` | Triggered before the form is about to load
`onload` | Triggered when the form is loaded and is about to render
`refresh` | Triggered when the form is loaded and rendered.
`onload_post_render` | Triggered after the form is loaded and rendered
`validate` | Triggered before before_save
`before_save` | Triggered before save is called
`after_save` | Triggered after form is saved
`before_submit` | Triggered before submit is called
`on_submit` | Triggered after form is submitted
`before_cancel` | Triggered before cancel is called
`after_cancel` | Triggered after form is cancelled
`timeline_refresh` | Triggered after form timeline is rendered
`{fieldname}_on_form_rendered` | Triggered when a row is opened as a form in a Table field
`{fieldname}` | Triggered when the value of fieldname is changed

### Child Table Events

These events are triggered in the context of a Child Table. Hence, along with
`frm`, they will also get the `cdt` (Child DocType) and `cdn` (Child Docname)
parameters in their handler functions.

```js
frappe.ui.form.on('ToDo', {
	// cdt, cdn are also passed as parameters
	// links is the name of Table field in ToDo
	links_add(frm, cdt, cdn) {
		// cdt is Child DocType
		// cdn is Child docname
		// They are useful for identifying the row which triggered this event
		// In this case, the row that was added
	}
})
```

Event Name            | Description
----------------------| -------------
`before_{fieldname}_remove` | Triggered when a row is about to be removed from a Table field
`{fieldname}_add` | Triggered when a row is added to a Table field
`{fieldname}_remove` | Triggered when a row is removed from a Table field
`{fieldname}_move` | Triggered when a row is reordered to another location in a Table field
`form_render` | Triggered when a row is opened as a form in a Table field

## Form API

Here are a list of common methods that are available on the `frm` object.

### frm.set_value

Set the value of a field. This will trigger the field change event in the form.

```js
// set a single value
frm.set_value('description', 'New description')

// set multiple values at once
frm.set_value({
	status: 'Open',
	description: 'New description'
})

// returns a promise
frm.set_value('description', 'New description')
	.then(() => {
		// do something after value is set
	})
```

### frm.refresh

Refresh the form with the latest values from the server. Will trigger
`before_load`, `onload`, `refresh`, `timeline_refresh` and `onload_post_render`.

```js
frm.refresh();
```

### frm.save

Trigger form save. Will trigger `validate`, `before_save`, `after_save`,
`timeline_refresh` and `refresh`.

It can be used to trigger other save actions like Submit, Cancel and Update. In
that case, the relevant events will be triggered.

```js
// save form
frm.save();

// submit form
frm.save('Submit');

// cancel form
frm.save('Cancel');

// update form (after submit)
frm.save('Update');

// all methods returns a promise
```


### frm.enable\_save / frm.disable\_save

Methods to enable / disable the Save button in the form.

```js
if (frappe.user_roles.includes('Custom Role')) {
	frm.enable_save();
} else {
	frm.disable_save();
}
```

### frm.email_doc

Open Email dialog for this form.

```js
// open email dialog
frm.email_doc();

// open email dialog with some message
frm.email_doc(`Hello ${frm.doc.customer_name}`);
```

### frm.reload_doc

Reload document with the latest values from the server and call `frm.refresh()`.

```js
frm.reload_doc();
```

### frm.refresh_field

Refresh the field and it's dependencies.

```js
frm.refresh_field('description');
```

### frm.is_dirty

Check if form values has been changed and is not saved yet.

```js
if (frm.is_dirty()) {
	frappe.show_alert('Please save form before attaching a file')
}
```

### frm.is_new

Check if the form is new and is not saved yet.

```js
// add custom button only if form is not new
if (!frm.is_new()) {
	frm.add_custom_button('Click me', () => console.log('Clicked custom button'))
}
```

### frm.set_intro

Set intro text on the top of the form.

```js
if (!frm.doc.description) {
	frm.set_intro('Please set the value of description');
}
```

### frm.add\_custom_button

Add a custom button in the inner toolbar of the page. Alias to
[page.add\_inner_button](/docs/user/en/api/page#pageadd_inner_button).

```js
// Custom buttons
frm.add_custom_button('Open Reference form', () => {
	frappe.set_route('Form', frm.doc.reference_type, frm.doc.reference_name);
})

// Custom buttons in groups
frm.add_custom_button('Closed', () => {
	frm.doc.status = 'Closed'
}, 'Set Status');
```

### frm.clear\_custom_button

Remove a specific custom button by label (and group).

```js
// remove custom button
frm.clear_custom_button('Open Reference form');

// remove custom button in a group
frm.clear_custom_button('Closed', 'Set Status');
```

### frm.clear\_custom_buttons

Remove all custom buttons from the inner toolbar.

```js
frm.clear_custom_buttons();
```

### frm.set\_df_property

Change the docfield property of a field and refresh the field.

```js
// change the fieldtype of description field to Text
frm.set_df_property('description', 'fieldtype', 'Text');

// set the options of the status field to only be [Open, Closed]
frm.set_df_property('status', 'options', ['Open', 'Closed'])

// set a field as mandatory
frm.set_df_property('title', 'reqd', 1)

// set a field as read only
frm.set_df_property('status', 'read_only', 1)
```

### frm.toggle_enable

Toggle a field or list of fields as `read_only` based on a condition.

```js
// set status and priority as read_only
// if user does not have System Manager role
let is_allowed = frappe.user_roles.includes('System Manager');
frm.toggle_enable(['status', 'priority'], is_allowed);
```

### frm.toggle_reqd

Toggle a field or list of fields as mandatory (`reqd`) based on a condition.

```js
// set priority as mandatory
// if status is Open
frm.toggle_reqd('priority', frm.doc.status === 'Open');
```

### frm.toggle_display

Show/hide a field or list of fields based on a condition.

```js
// show priority and due_date field
// if status is Open
frm.toggle_display(['priority', 'due_date'], frm.doc.status === 'Open');
```

### frm.set_query

Apply filters on a Link field to show limited records to choose from. You must
call `frm.set_query` very early in the form lifecycle, usually in `setup` or
`onload`.

```js
// show only customers whose territory is set to India
frm.set_query('customer', () => {
	return {
		filters: {
			territory: 'India'
		}
	}
})

// set filters for Link field item_code in
// items field which is a Child Table
frm.set_query('items', 'item_code', () => {
	return {
		filters: {
			item_group: 'Products'
		}
	}
})
```

You can also override the filter method and provide your own custom method on
the server side. Just the set the query to the module path of your python method.

```js
// change the filter method by passing a custom method
frm.set_query('fieldname', () => {
	return {
		query: 'dotted.path.to.custom.custom_query',
		filters: {
			field1: 'value1'
		}
	}
})
```

```py
# python method signature
def custom_query(doctype, txt, searchfield, start, page_len, filters):
	# your logic
	return filtered_list
```

### frm.add_child

Add a row with values to a Table field.

```js
let row = frm.add_child('items', {
	item_code: 'Tennis Racket',
	qty: 2
});

frm.refresh_field('items');
```

### frm.call

Call a server side controller method with arguments.

For the following controller code:
```py
class ToDo(Document):
	def get_linked_doc(self, throw_if_missing=False):
		if not frappe.db.exists(self.reference_type, self.reference_name):
			if throw_if_missing:
				frappe.throw('Linked document not found')

		return frappe.get_doc(self.reference_type, self.reference_name)
```

You can call it from client using `frm.call`.
```js
frm.call('get_linked_doc', { throw_if_missing: true })
	.then(r => {
		if (r.message) {
			let linked_doc = r.message;
			// do something with linked_doc
		}
	})
```

### frm.trigger

Trigger any form event explicitly.

```js
frappe.ui.form.on('ToDo', {
	refresh(frm) {
		frm.trigger('set_mandatory_fields');
	},

	set_mandatory_fields(frm) {
		frm.toggle_reqd('priority', frm.doc.status === 'Open');
	}
})
```

### frm.get_selected

Get selected rows in Child Tables in an object where key is the table fieldname
and values are row names.

```js
let selected = frm.get_selected()
console.log(selected)
// {
// 	items: ["bbfcb8da6a", "b1f1a43233"]
// 	taxes: ["036ab9452a"]
// }
```