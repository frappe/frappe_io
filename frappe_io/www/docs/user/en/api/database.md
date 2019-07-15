---
base_template: frappe_io/www/frappe/frappe_base.html
add_breadcrumbs: 1
title: Database - API
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  API methods for querying, updating or creating records in Frappe
---

# Database API

## frappe.db.get_list
`frappe.db.get_list(doctype, filters, or_filters, fields, order_by, group_by, start, page_length)`

- Also aliased to `frappe.get_list`

Returns a list of records from a `doctype` table. ORM Wrapper for a `SELECT`
query. Will also apply user permissions for the records for the session user.

```python
frappe.db.get_list('Task',
	filters={
		'status': 'Open'
	},
	fields=['subject', 'date'],
	order_by='date desc',
	start=10,
	page_length=20,
	as_list=True
)
# output
(('Update Branding and Design', '2019-09-04'),
('Missing Documentation', '2019-09-02'),
('Fundraiser for Foundation', '2019-09-03'))

# Tasks with date after 2019-09-08
frappe.db.get_list('Task', filters={
	'date': ['>', '2019-09-08']
})

# Tasks with subject that contains "test"
frappe.db.get_list('Task', filters={
	'subject': ['like', '%test%']
})

# Count number of tasks grouped by status
frappe.db.get_list('Task',
	fields=['count(name) as count', 'status'],
	group_by='status'
)
# output
[{'count': 1, 'status': 'Working'},
 {'count': 2, 'status': 'Overdue'},
 {'count': 2, 'status': 'Open'},
 {'count': 1, 'status': 'Filed'},
 {'count': 20, 'status': 'Completed'},
 {'count': 1, 'status': 'Cancelled'}]
```

## frappe.db.get_all
`frappe.db.get_all(doctype, filters, or_filters, fields, order_by, group_by, start, page_length)`

- Also aliased to `frappe.get_all`

Same as `frappe.db.get_list` but will fetch all records without applying permissions.

## frappe.db.get_value
`frappe.db.get_value(doctype, name, fieldname)` or `frappe.db.get_value(doctype, filters, fieldname)`

- Also aliased to `frappe.get_value` and `frappe.db.get_values`

Returns a document's field value or a list of values.

```python
# single value
subject = frappe.db.get_value('Task', 'TASK00002', 'subject')

# multiple values
subject, description = frappe.db.get_value('Task', 'TASK00002', ['subject', 'description'])

# as dict
task_dict = frappe.db.get_value('Task', 'TASK00002', ['subject', 'description'], as_dict=1)
task_dict.subject
task_dict.description

# with filters, will return the first record that matches filters
subject, description = frappe.db.get_value('Task', {'status': 'Open'}, ['subject', 'description'])
```

## frappe.db.get\_single\_value
`frappe.db.get_single_value(doctype, fieldname)`

Returns a field value from a Single DocType.

```python
timezone = frappe.db.get_single_value('System Settings', 'timezone')
```

## frappe.db.set_value
`frappe.db.set_value(doctype, name, fieldname, value)`

- Also aliased to `frappe.db.update`

Sets a field's value in the database, does not call the ORM triggers but updates
the modified timestamp (unless specified not to).

```python
# update a field value
frappe.db.set_value('Task', 'TASK00002', 'subject', 'New Subject')

# update multiple values
frappe.db.set_value('Task', 'TASK00002', {
	'subject': 'New Subject',
	'description': 'New Description'
})

# update without updating the `modified` timestamp
frappe.db.set_value('Task', 'TASK00002', 'subject', 'New Subject', update_modified=False)
```

> This method won't call ORM triggers like `validate` and `on_update`. Use this
> method to update hidden fields or if you know what you are doing.

## frappe.db.exists
`frappe.db.exists(doctype, name)`

Returns true if a document record exists.

```python
# check if record exists by name
frappe.db.exists('Task', 'TASK00002') # True

# check if record exists by filters
frappe.db.exists({
	'doctype': 'Task',
	'status': 'Open',
	'subject': 'New Task'
})
```

## frappe.db.count
`frappe.db.count(doctype, filters)`

Returns number of records for a given `doctype` and `filters`.

```python
# total number of Task records
frappe.db.count('Task')

# total number of Open tasks
frappe.db.count('Task', {'status': 'Open'})
```

## frappe.db.delete
`frappe.db.delete(doctype, filters)`

Delete `doctype` records that match `filters`.

```python
frappe.db.delete('Task', {
	'status': 'Cancelled'
})
```

## frappe.db.commit
`frappe.db.commit()`

Commits current transaction. Calls SQL `COMMIT`.

> Frappe will automatically run `frappe.db.commit()` at the end of a successful
> Web Request of type `POST` or `PUT`. It does not run on `GET` requests.
>
> You dont need to call this explicitly in most cases. Use this if you have to
> commit early in a transaction.

## frappe.db.rollback
`frappe.db.rollback()`

Rollbacks current transaction. Calls SQL `ROLLBACK`.

> Frappe will automatically run `frappe.db.rollback()` if an exception is thrown
> during a Web Request of type `POST` or `PUT`. Use this if you have to rollback
> early in a transaction.
