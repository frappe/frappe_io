<!-- add-breadcrumbs -->
# Customizing Web Forms

Web Forms are a powerful way to add forms to your website. Web forms are powerful and scriptable and from Version 7.1+ they also include tables, paging and other utilities

<img class="screenshot" alt="Web Form" src="/docs/assets/img/portals/sample-web-form.png">

### Standard Web Forms

If you check on the "Is Standard" checkbox, a new folder will be created in the `module` of the Web Form for that web form. In this folder, you will see a `.py` and `.js` file that you can customize the web form with.

### Web Form Settings

- **Allow Edit**: Allow each user to have one instance and edit it
- **Allow Multiple**: Allow users to view and edit multiple instances of the web form
- **Show as Grid**: Show table view of the web form values (only if "Allow Multiple" is set)
- **Allow Incomplete Forms**: For very long forms, you can allow the user to save without throwing validation for mandatory. The user will still see the fields as manadatory.

### Custom Script

> Introduced in Version 11

You can also add a custom client script to the web form

## API

##### Event Handler

Write an event handler to do actions when a field is changed.

```js
frappe.web_form.on([fieldname], [handler]);
```

##### Get Value

Get value of a particular field

```js
value = frappe.web_form.get_value([fieldname]);
```

##### Set Value

Set value of a particular field

```js
frappe.web_form.set_value([fieldname], [value])
```

##### Validate

`frappe.web_form.validate` is called before the web_form is saved. Add custom validation by overriding the `validate` method. To stop the user from saving, return `false`;

```js
frappe.web_form.validate = () => {
	// return false if not valid
}
```

##### Set Field Property

```js
frappe.web_form.set_field_property([fieldname], [property], [value]);
```

##### Trigger script when form is loaded

Initialize form with customisation after it is loaded

```js
frappe.web_form.after_load = () {
	// init script here
}
```

## Examples

##### Reset value if invalid

```js
frappe.web_form.on('amount', (field, value) => {
	if (value < 1000) {
		frappe.msgprint('Value must be more than 1000');
		field.set_value(0);
	}
});
```

##### Custom Validation

```js
frappe.web_form.validate = () => {
	let data = frappe.web_form.get_values();
	if (data.amount < 1000) {
		frappe.msgprint('Value must be more than 1000');
		return false;
	}
});
```

##### Hide a field based on value

```js
frappe.web_form.on('amount', (field, value) => {
	if (value < 1000) {
		frappe.web_form.set_field_value('rate', 'hidden', 1);
	}
});
```

##### Show a message on startup

```js
frappe.web_form.after_load = () => {
	frappe.msgprint('Please fill all values carefully');
}
```

### Breadcrumbs

You can customize the breadcrumbs in a Web Form by adding JSON object.

Example:

```
[{"label": "Home", "route":"/" }]
```

{next}