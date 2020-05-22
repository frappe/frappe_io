---
add_breadcrumbs: 1
title: Document - API
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  API for working with Documents in Frappe
---

# Document API

A Document is an instance of a DocType. It is derived from the
`frappe.model.Document` class and represents a single record in the database
table.

## frappe.get_doc
`frappe.get_doc(doctype, name)`

Returns a [Document](/docs/user/en/understanding-doctypes#document) object of
the record identified by `doctype` and `name`. If `doctype` is a Single DocType
`name` is not required.

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

Returns a new Document object in memory which does not exist yet in the database.
```python
# create a new document
doc = frappe.get_doc({
	'doctype': 'Task',
	'title': 'New Task'
})
doc.insert()
```

`frappe.get_doc(doctype={document_type}, key1 = value1, key2 = value2, ...)`

Returns a new Document object in memory which does not exist yet in the database.
```python
# create new object with keyword arguments
user = frappe.get_doc(doctype='User', email_id='test@example.com')
user.insert()
```

## frappe.get\_cached\_doc

Similar to `frappe.get_doc` but will look up the document in cache first before
hitting the database.

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

Returns meta information of `doctype`. This will also apply custom fields and
property setters.

```python
meta = frappe.get_meta('Task')
meta.has_field('status') # True
meta.get_custom_fields() # [field1, field2, ..]
```

To get the original document of DocType (without custom fields and property
setters) use `frappe.get_doc('DocType', doctype_name)`


## Document Methods
This section lists out common methods that are available on the `doc` object.

## doc.insert

This method inserts a new document into the database table. It will check for
user permissions and execute `before_insert`, `validate`, `on_update`,
`after_insert` methods if they are written in the controller.

It has some escape hatches that can be used to skip certain checks explained below.

```py
doc.insert(
	ignore_permissions=True, # ignore write permissions during insert
	ignore_links=True, # ignore Link validation in the document
	ignore_if_duplicate=True, # dont insert if DuplicateEntryError is thrown
	ignore_mandatory=True # insert even if mandatory fields are not set
)
```

## doc.save

This method saves changes to an existing document. This will check for user
permissions and execute `validate` before updating and `on_update` after
updating values.

```py
doc.save(
	ignore_permissions=True, # ignore write permissions during insert
	ignore_version=True # do not create a version record
)
```

## doc.delete

Delete the document record from the database table. This method is an alias to
`frappe.delete_doc`.

```py
doc.delete()
```

## doc.get\_doc\_before\_save

Will return a version of the doc before the changes were made. You can use it to
compare what changed from the last version.

```py
old_doc = doc.get_doc_before_save()
if old_doc.price != doc.price:
	# price changed
	pass
```

## doc.reload

Will get the latest values from the database and update the doc state.

When you are working with a document, it may happen that some other part of code
updates the value of some field directly in the database. In such cases you can
use this method to reload the doc.

```py
doc.reload()
```

## doc.check_permission

Throw if the current user has no permission for the provided permtype.

```py
doc.check_permission(permtype='write') # throws if no write permission
```

## doc.get_title

Get the document title based on `title_field` or field named **title** or **name**.

```
title = doc.get_title()
```

## doc.notify_update

Publish realtime event to indicate that the document has been modified. Client
side event handlers react to this event by updating the form.

```py
doc.notify_update()
```

## doc.db_set

Set a field value of the document directly in the database and update the
modified timestamp.

> This method does not trigger controller validations and should be used very
> carefully.

```py
# updates value in database, updates the modified timestamp
doc.db_set('price', 2300)

# updates value in database, will trigger doc.notify_update()
doc.db_set('price', 2300, notify=True)

# updates value in database, will also run frappe.db.commit()
doc.db_set('price', 2300, commit=True)

# updates value in database, does not update the modified timestamp
doc.db_set('price', 2300, update_modified=False)
```

## doc.get_url

Returns Desk URL for this document. For e.g: `/desk#Form/Task/TASK00002`

```py
url = doc.get_url()
```

## doc.add_comment

Add a comment to this document. Will show up in timeline in Form view.

```py
# add a simple comment
doc.add_comment('Comment', text='Test Comment')

# add a comment of type Edit
doc.add_comment('Edit', 'Values changed')

# add a comment of type Shared
doc.add_comment("Shared", "{0} shared this document with everyone".format(user))
```

## doc.add_seen

Add the given/current user to list of users who have seen this document. Will
update the `_seen` column in the table. It is stored as a JSON Array.

```py
# add john to list of seen
doc.add_seen('john@doe.com')

# add session user to list of seen
doc.add_seen()
```

> This works only if **Track Seen** is enabled in the DocType.

## doc.add_viewed

Add a view log when a user views a document i.e opens the Form.

```py
# add a view log by john
doc.add_viewed('john@doe.com')

# add a view log by session user
doc.add_viewed()
```

> This works only if **Track Views** is enabled in the DocType.

## doc.run_method

Run method if defined in controller, will also trigger hooks if defined.

```py
doc.run_method('validate')
```

## doc.queue_action

Run a controller method in background. If the method has an inner function, like
`_submit` for `submit`, it will call that method instead.

```py
doc.queue_action('send_emails', emails=email_list, message='Howdy')
```
