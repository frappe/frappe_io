<!-- base_template: frappe_io/www/frappe/frappe_base.html -->
<!-- add-breadcrumbs -->
# Python API

Frappe aims to achieve minimum cognitive load for its users. Hence, you can find
the most used methods and utilities in the `frappe` namespace itself. It's the
only import you need (most of the time) in a Python file.

## frappe.get_doc
`frappe.get_doc(doctype, name)`

Returns a [Document](/docs/user/en/understanding-doctypes#document) object of
the record identified by `doctype` and `name`. If `doctype` is a Single DocType
`name` is optional.

```python
# get an existing document
doc = frappe.get_doc('Task', 'TASK00002')
doc.title = 'Test'
doc.save()

# get a single doctype
doc = frappe.get_doc('System Settings')
doc.timezone # Asia/Kolkata
```

`frappe.get_doc(dict)`

- `dict`: A dict with `doctype` and other fields as key

Returns a new Document object in memory which does not exist yet in the database.
```python
# create a new document
doc = frappe.get_doc({
	'doctype': 'Task',
	'title': 'New Task'
})
doc.insert()
```

<!-- ## frappe.get\_cached\_doc

Similar to `frappe.get_doc` but will look up the document in cache first before
hitting the database. -->

## frappe.new_doc
`frappe.new_doc(doctype)`

Alternative way to create a new Document.
```python
# create a new document
doc = frappe.new_doc('Task')
doc.title = 'New Task 2'
doc.insert()
```

## frappe.delete_doc
`frappe.delete_doc(doctype, name)`

Deletes the record and its children from the database. Also deletes other
documents like Communication, Comments, etc linked to it.

```python
frappe.delete_doc('Task', 'TASK00002')
```

## frappe.rename_doc
`frappe.rename_doc(doctype, old_name, new_name, merge=False)`

Rename a document's `name` (primary key) from `old_name` to `new_name`. If
`merge` is `True` and a record with `new_name` exists, will merge the record
with it.

```python
frappe.rename_doc('Task', 'TASK00002', 'TASK00003')
```

> Rename will only work if **Allow Rename** is set in the DocType Form.

## frappe.get_meta
`frappe.get_meta(doctype)`

Returns meta information of `doctype`.
```python
meta = frappe.get_meta('Task')
meta.has_field('status') # True
meta.get_custom_fields() # [field1, field2, ..]
```

## frappe.db.get_list
`frappe.db.get_list(doctype, filters, or_filters, fields, order_by, group_by, start, page_length)`

- Also aliased to `frappe.get_list`

Returns a list of records from a `doctype` table. ORM Wrapper for a `SELECT`
query.

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

Same as `frappe.db.get_list` but will apply permissions and will filter records
that have `read` permission for the current user.

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
> Web Request. Use this if you have to commit early in a transaction.

## frappe.db.rollback
`frappe.db.rollback()`

Rollbacks current transaction. Calls SQL `ROLLBACK`.

> Frappe will automatically run `frappe.db.rollback()` if an exception is thrown
> during a Web Request. Use this if you have to rollback early in a transaction.
