# Concepts

1. [DocType](#doctype)
1. [DocField](#docfield)
1. [Naming](#naming)
1. [Document](#document)
1. [Controllers](#controllers)
    - [Controller Methods](#controller-methods)
    - [Controller Hooks](#controller-hooks)
1. [DocType Relationships](#doctype-relationships)
1. Child DocType
1. Single DocType
1. Routing
1. Translations
1. Request / Response

## DocType

A DocType is the core building block of any application based on the Frappe Framework.
It describes the **Model** and the **View** of your data.
It contains what fields are stored for your data, and how they behave with respect to each other.
It contains information about how your data is named.
It also enables rich **Object Relational Mapper (ORM)** pattern which we will discuss later in this guide.
When you create a DocType, a JSON object is created which in turn creates a database table.

> ORM is just an easy way to read, write and update data in a database without writing explicit SQL statements.

**Conventions**

To enable rapid application development, Frappe Framework follows some standard conventions.

1. DocType is always singular. If you want to store a list of articles in the database, you should name the doctype **Article**.
1. Table names are prefixed with `tab`. So the table name for **Article** doctype is `tabArticle`.


The standard way to create a DocType is by typing *new doctype* in the search bar in the **Desk**.

![ToDo DocType Screenshot](/new-docs/assets/doctype/todo_doctype.png)

A DocType not only stores fields, but also other information about how your data behaves in the system. We call this **Meta**. Since this meta-data is also stored in a database table, it makes it easy to change meta-data on the fly without writing much code. Learn more about [Meta](#meta).

> A DocType is also a DocType. This means that we store meta-data as the part of the data.

After creating a DocType, Frappe can provide many features out-of-the-box. If you go to `/desk#List/ToDo` you will be routed to the List View in the desk.

![ToDo List](/new-docs/assets/doctype/todo_list.png)
*ToDo List*

Similarly, you get a Form View at the route `/desk#Form/ToDo/000001`. The Form is used to create new docs and view them.

![ToDo Form](/new-docs/assets/doctype/todo_form.png)
*ToDo Form*

## Module

`DocType`s belong to a module, to enable easier grouping of related models for a domain. For example

## DocField

A DocField is a list of fields which describes what properties a DocType will have. For instance, a ToDo doctype has fields `description`, `status` and `priority`. These ultimately become columns in the database table `tabToDo`.

**Example**

The DocField stores a lot of data about the field. Some of them are described below.

```json

[
    {
        "label": "Description",     // the value shown to the user (Form, Print, etc)
        "fieldname": "description", // the property name we refer in code, also the column name
        "fieldtype": "Text Editor", // the fieldtype which also decides how to store this value
        "reqd": 1                   // whether this field is mandatory
    },
    {
        "label": "Status",
        "fieldname": "status",
        "fieldtype": "Select",
        "options": [
            "Open",
            "Pending",
            "Closed"
        ]
    },
    {
        "label": "Priority",
        "fieldname": "priority",
        "fieldtype": "Select",
        "options": [
            "Low",
            "Medium",
            "High"
        ],
        "default": "Low"            // the default value to be set
    }
]

```

Frappe comes with 31 different fieldtypes out-of-the-box. These fieldtypes serve a variety of use-cases. Learn more about [Fieldtypes](#fieldtypes).

## Naming

All `docs` in Frappe have a primary key called `name`. This is the unique id by which you will be finding records and manipulating them using the ORM.
You can configure how `docs` should be named when a new document is created.
The following are the ways you can setup naming in a DocType.

**1. field:[fieldname]**

The `doc` name is fetched from the value of the field provided.

<img src="/new-docs/assets/doctype/naming_field.png" alt="naming by field" class="screenshot" style="width: 50%;">

**2. [series]**

You can provide a naming pattern which will be incremented automatically. For e.g, if you set it as `PRE.#####`, the first document created will have the `name` as **PRE00001**, and second one will be **PRE00002** and so on.

<img src="/new-docs/assets/doctype/naming_series_1.png" alt="naming by series" class="screenshot" style="width: 50%;">

**3. naming_series:**

The naming pattern is derived from a field in the document. For e.g, you have a field `naming_series` in your document and it's value is set as `PRE.#####`, then that will be the pattern used for generating the name. This value can change per document. So the next document can have a different pattern.

> This works only if you have a field called `naming_series` in your DocType.

<img src="/new-docs/assets/doctype/naming_series_2.png" alt="naming by series by field" class="screenshot" style="width: 50%;">

**4. Prompt**

If you set it as **Prompt**, the name is required to be filled in manually.

<img src="/new-docs/assets/doctype/naming_prompt.png" alt="naming by prompt" class="screenshot">

**5. Format**

This is the most flexible one when it comes to configuring your naming schemes.

Let's say we have

```text
{%- raw -%}
EXAMPLE-{MM}-test-{fieldname1}-{fieldname2}-{#####}
{% endraw -%}
```

<img src="/new-docs/assets/doctype/naming_format.png" alt="naming by format" class="screenshot" style="width: 50%;">

Everything outside the curly braces are plain text. Keywords inside the curly braces will be evaluated based on what they represent. In this case:

- **MM**: will be replaced by the current month
- **fieldname1**: will be replaced by the value of `fieldname1` in the document
- **#####**: will generate a series, which starts with `00001`

So the final name may look like, `EXAMPLE-02-test-value1-value2-00001`

## Document

An instance of a DocType is called a `doc` (shorthand for document). Usually a `doc` directly maps to a single row in the table.

**Example**

Let's say we have a DocType **ToDo** with the following fields:

- `description`
- `status`
- `priority`

Now, if we want to query a document from the database, we can use the [ORM](#orm).

```python

>>> doc = frappe.get_doc('ToDo', '0000001')
<frappe.desk.doctype.todo.todo.ToDo at 0x1128d35d0>

>>> doc.as_dict()
{u'creation': datetime.datetime(2018, 8, 14, 12, 57, 4, 568148),
 u'description': u'Buy Groceries',
 u'modified': datetime.datetime(2018, 8, 14, 12, 57, 16, 622779),
 u'modified_by': u'faris@erpnext.com',
 u'name': u'0000001',
 u'owner': u'faris@erpnext.com',
 u'priority': u'Medium',
 u'status': u'Open',
 ...
 }
```

You get the values of `description`, `status` and `priority`, but you also get fields like `creation`, `owner` and `modified_by` which are fields added by default by the framework on all `docs`.

## Controllers

A Controller is a normal python class which extends from `frappe.model.Document` base class. This base class is the core logic of a DocType. It handles how values are loaded from the database, how they are parsed and saved back to the database.

When you create a DocType named `Person`, a python file is created by the name `person.py` and the contents look like:

```python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Person(Document):
	pass

```

All the fields are available to the class as attributes.

### Controller Methods

You can add custom methods to your Controller and it will be callable using the `doc` object. For example,

```python
# controller definition
class Person(Document):
	def get_full_name(self):
        "Returns the person's full name"
        return self.first_name + ' ' + self.last_name

# somewhere in your code
>>> doc = frappe.get_doc('Person', '000001')
>>> doc.get_full_name()
John Doe
```

You can also override the pre-defined document methods to add your own behaviour. For e.g to override the `save()` method,

```python
class Person(Document):
	def save(self, *args, **kwargs):
        do_something()
        super().save(*args, **kwargs) # call the base save method
        do_something_else()
```

There are a lot of methods provided by default on the `doc` object. You can find the complete [list here](#complete-document-reference).

### Controller Hooks

To add custom behaviour during the lifecycle of a document, we have controller hooks.

Method Name                  | Description
-----------------------------|-------------
`before_submit`              | Called before a document is submitted.
`before_cancel`              | This is called before a submitted document is cancelled.
`before_update_after_submit` | This is called *before* a submitted document values are updated.
`before_insert`              | This is called before a document is inserted into the database.
`before_naming`              | This is called before the `name` property of the document is set.
`autoname`                   | This is an optional method which is called only when it is defined in the controller. Use this method to customize how the `name` property of the document is set.
`validate`                   | Use this method to throw any validation errors and prevent the document from saving.
`before_save`                | This method is called before the document is saved.
`after_insert`               | This is called after the document is inserted into the database.
`on_update`                  | This is called when values of an existing document is updated.
`on_submit`                  | This is called when a document is submitted.
`on_update_after_submit`     | This is called *when* a submitted document values are updated.
`on_cancel`                  | This is called when a submitted is cancelled.
`on_change`                  | This is called to indicate that a document's values has been changed.
`on_trash`                   | This is called when a document is being deleted.
`after_delete`               | This is called after a document has been deleted.

To use a controller hook, just define a class method with that name. For e.g

```python
class Person(Document):
	def validate(self):
        if self.age > 60:
            frappe.throw('Age must be less than 60')

    def after_insert(self):
        frappe.sendmail(recipients=[self.email], message="Thank you for registering!")
```

**1. Create a document**

To create a new document and save it to the database,

```python
doc = frappe.get_doc({
    'doctype': 'Person',
    'first_name': 'John',
    'last_name': 'Doe'
})
doc.insert()

doc.name # 000001
```

**2. Load a document**

To get an existing document from the database,

```python
doc = frappe.get_doc('Person', '000001')

# doctype fields
doc.first_name # John
doc.last_name # Doe

# standard fields
doc.creation # datetime.datetime(2018, 9, 20, 12, 39, 34, 236801)
doc.owner # faris@erpnext.com
```

