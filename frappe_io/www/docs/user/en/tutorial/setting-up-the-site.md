<!-- base_template: frappe_io/www/frappe/frappe_base.html --><!-- add-breadcrumbs -->
# Setting up the Site

Let us create a new site and call it `library`.

*Note: Before you create any new site, you need to activate the Barracuda file format on your MariaDB installation.*
*Copy the following default ERPNext database settings into your `my.cnf` file.*

    [mysqld]
    innodb-file-format=barracuda
    innodb-file-per-table=1
    innodb-large-prefix=1
    character-set-client-handshake = FALSE
    character-set-server = utf8mb4
    collation-server = utf8mb4_unicode_ci

    [mysql]
    default-character-set = utf8mb4

You can then install a new site, by the command `bench new-site library`.

This will create a new database and site folder and install `frappe` (which is also an application!) in the new site. The `frappe` application has two built-in modules **Core** and **Website**. The Core module contains the basic models for the application. Frappe is a batteries included framework and comes with a lot of built-in models. These models are called **DocTypes**. More on that later.

	$ bench new-site library
	MySQL root password:
	Installing frappe...
	Updating frappe                     : [========================================]
	Updating country info               : [========================================]
	Set Administrator password:
	Re-enter Administrator password:
	Installing fixtures...
	*** Scheduler is disabled ***

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

### Setting Sites

In case you have multiple sites on your bench, you can map these sites to your localhost by adding your site name to the `/etc/hosts` file in the following manner:

```
# Host Database
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1       localhost library
255.255.255.255 broadcasthost
::1             localhost
~                                                                     
```
On saving this file, your site can be accessed by mentioning it's URL in your browser.

### Install App

Now let us install our app `library_management` in our site `library`

1. Install library_management in library with: `bench --site [site_name] install-app [app_name]`

Example:

	$ bench --site library install-app library_management

{next}
