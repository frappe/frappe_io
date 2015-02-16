# Setting up the Site

Let us create a new site and call it `library`.

You can install a new site, by the command `bench new-site library`

This will create a new database and site folder and install `frappe` (which is also an application!) in the new site. The `frappe` application has two built-in modules **Core** and **Website**. The Core module contains the basic models for the application. Frappe is a batteries included framework and comes with a lot of built-in models. These models are called **DocTypes**. More on that later.

	$ bench new-site library
	MySQL root password:
	Created user library
	Created database library
	Granted privileges to user library and database library
	Starting database import...
	Imported from database /private/var/www/rmehta/bench/frappe/frappe/data/Framework.sql
	core | doctype | bulk_email
	core | doctype | comment
	core | doctype | communication
	core | doctype | custom_field
	core | doctype | custom_script
	core | doctype | customize_form
	core | doctype | customize_form_field
	core | doctype | defaultvalue
	core | doctype | docfield
	core | doctype | docperm
	core | doctype | doctype
	core | doctype | event
	..
	..
	website | doctype | web_page
	website | doctype | website_group
	website | doctype | website_route
	website | doctype | website_route_permission
	website | doctype | website_script
	website | doctype | website_settings
	website | doctype | website_slideshow
	website | doctype | website_slideshow_item
	website | doctype | website_template
	website | page | sitemap_browser

### Site Structure

A new folder called `library` will be created in the `sites` folder. Here is the standard folder structure for a site.

	.
	├── locks
	├── private
	│   └── backups
	├── public
	│   └── files
	└── site_config.json

1. `public/files` is where user uploaded files are stored.
1. `private/backups` is where backups are dumped
1. `site_config.json` is where site level configurations are maintained.

### Install App

Now let us install our app `library_management` in our site `library`

1. Install library_management in library with: `bench frappe [site] --install_app [app]`

Example:

	$ bench frappe library --install_app library_management

{next}
