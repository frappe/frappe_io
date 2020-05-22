---
add_breadcrumbs: 1
title: Database Migrations
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  Frappe comes with a migration and patch system to handle database migrations
  and patching of existing data.
---

# Database Migrations

A project often undergoes changes related to database schema during course of
its development. It may also require patching of existing data. Frappe comes
with a migration and patch system tools to handle these scenarios.

When there are schema changes in your app, to migrate your existing site's
database to the new schema, you should run the command.

```sh
bench --site [sitename] migrate
```

## Schema changes

You can edit a DocType to add, remove or change fields. On saving a DocType, a
JSON file containing the DocType data is added to source tree of your app. When
you add an app to a site, the DocTypes are installed (database tables are
created) using this JSON file.

> For making schema changes, you must enable Developer Mode.

On running a `migrate`, DocTypes in the system are synced to their latest
version from the JSON files in the app.

When you remove or rename fields in the DocType, the corresponding database
columns are not removed from the database table, but they will not be visible in
the form view. This is done to avoid any potential data loss situations and to
allow you write related data migrations (patches) which might need values from
old fields.

> Frappe doesn't support reverse schema migrations.

## Data Migrations

On introducing data related changes, you might want to run one off scripts to
change existing data to match expectations as per new code. We call these scripts **patch** in frappe.

### Writing a patch

To write a patch, you must write an `execute` method in a python script and add
it to  `patches.txt` of your app.

It is recommended to make a file with a patch number and name in its path and
add it to a patches package (directory) in your app. You can then add a line
with dotted path to the patch module to `patches.txt`.

The directory structure followed in Frappe is as below

```sh
frappe
└── patches
	└── v12_0
		└── my_awesome_patch.py
```

The patch can then be added to `patches.txt` by its dotted path.
```
frappe.patches.v12_0.my_awesome_patch
```

### Schema during patch

The DocType meta available in the execute function will be as per the old JSON.
This is so that you can write migration code assuming you still have the old fields.
After the patch is run, the new schema is applied to the DocType.

If you want to have the new schema during your patch execution, use the `reload_doc` method.
```py
import frappe

def execute():
	frappe.reload_doc(module_name, "doctype", doctype_name)

	# your patch code here
```

### One off Python statements

You can also add one off python statements in `patches.txt` using the syntax,

```
frappe.patches.v12_0.my_awesome_patch
execute:frappe.delete_doc('Page', 'applications', ignore_missing=True)
```

### Patch execution order

Patches run in the order they are defined. All lines in `patches.txt` have to be
unique. If a patch has been run before, it won't run again. If you want to run a
patch again, add a comment that will make the line appear as new.

For Example,

```
frappe.patches.v12_0.my_awesome_patch #2019-09-08
```
