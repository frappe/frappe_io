<!-- base_template: frappe_io/www/frappe/frappe_base.html -->
<!-- add-breadcrumbs -->
# Controls

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