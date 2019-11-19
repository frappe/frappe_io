<!-- base_template: frappe_io/www/frappe/frappe_base.html --><!-- add-breadcrumbs -->
# Making Models

The next step is to create the models as we discussed in the introduction. In Frappe, models are called **DocTypes**. You can create new DocTypes from the Desk UI. **DocTypes** are made of fields called **DocField** and role based permissions are integrated into the models, these are called **DocPerms**.

When a DocType is saved, a new table is created in the database. This table is named as `tab[DocType]`.
For Example, a DocType Article will create a table named as `tabArticle`, similarly a DocType Library Transaction will create a table named as `tabLibrary Transaction` and not `tabLibraryTransaction` 

When you create a **DocType** below mentioned files/folders are automatically created.

* A new folder in the 'doctype' sub-folder of corresponding **Module** folder
* A model JSON file
* Controller template in Python
* Controller template in JS

When you update the DocType, the JSON model file is updated and whenever `bench migrate` is executed, it is synced with the database. This makes it easy to propagate schema changes and migrate.

### Developer Mode

To create models, you must set `developer_mode` as 1 in the `site_config.json` file located in /sites/library and execute command `bench clear-cache` or use the user menu in UI and click on "Reload" for the changes to take effect. You should now see the "Developer" app on your desk

	{
	 "db_name": "bcad64afbf",
	 "db_password": "v3qHDeVKvWVi7s97",
	 "developer_mode": 1
	}

{next}
