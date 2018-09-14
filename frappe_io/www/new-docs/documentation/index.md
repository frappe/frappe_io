# Concepts

1. [DocType](#doctype)
1. [DocField](#docfield)
1. [Naming](#naming)
1. [Document](#document)
1. Child DocType
1. Single DocType
1. DocField
1. Controllers
    - Client Side
    - Server Side
1. Routing
1. Translations
1. Request / Response

## DocType

A DocType is the single source of information about data in your system. It contains what fields are stored in the database.
It is essentially the **model** in your system. It directly maps to a single database table.

> As a convention tables are prefixed with `tab`. So the table name for **ToDo** doctype is `tabToDo`.

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