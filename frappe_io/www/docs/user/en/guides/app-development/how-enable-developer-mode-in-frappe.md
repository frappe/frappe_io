<!-- base_template: frappe_io/www/frappe/frappe_base.html --><!-- add-breadcrumbs -->
# How to Enable Developer Mode in Frappe

When you are in application design mode and you want the changes in your DocTypes, Reports etc to affect the app repository, you must be in **Developer Mode**.

To enable developer mode, update the `site_config.json` file of your site in the sites folder:

	frappe-bench/sites/{your site}/site_config.json

Inside the `frappe-bench` folder, run

	bench set-config developer_mode 1

OR, manually, write `"developer_mode": 1` inside the `{ .. }` of `site_config.json`

	{
	  "developer_mode": 1,
	  ...
	}

After setting developer mode, clear the cache:

	bench clear-cache

To view the full developer options, you must be logged in as the "Administrator" user. You also will need to enable the Developer icon in your desktop settings:

	Desk -> User dropdown list -> Set Desktop Icons -> check "Developer"

<!-- markdown -->
