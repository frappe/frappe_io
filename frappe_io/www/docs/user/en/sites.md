---
base_template: frappe_io/www/frappe/frappe_base.html
add_breadcrumbs: 1
title: Sites
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  Frappe is a multitenant platform and each tenant is called a site. A site has
  its own database. Sites exist in a directory called `sites`, assumed as the
  current working directory when running a bench command.
---

# Sites

Frappe is a multitenant platform and each tenant is called a site. A site has
its own database. Sites exist in a directory called `sites`, assumed as the
current working directory when running a bench command.

## Sites Directory

The sites directory `frappe-bench/sites` is where all the sites for this bench
live. It also contains some other files and directories which are explained next.

### apps.txt

This file contains a list of Frappe apps. An app should be listed here before it
can be installed on a site. It is added automatically when `bench get-app`
command or `bench new-app` command is run.

### common\_site\_config.json

Configuration common to all sites can be put in this file. Learn more about
[site configuration]().

#### `scheduler_tick_interval:`
Job Scheduler runs a loop that enqueues all scheduled jobs pending execution once every `scheduler_tick_interval` seconds (Default: 60 seconds).

Which makes this setting the minimum possible frequency for scheduling jobs.

### assets

Assets contain files that are required to be served for the client browser.
These generally include *.js, *.css, and image files. This directory is auto
generated using the `bench build` command. This directory is served by Nginx in
production.

## Creating a new site

To create a new site, run the following command from the `frappe-bench` directory:

```sh
$ bench new-site mysite.local

Installing frappe...
Updating DocTypes for frappe        : [========================================]
Updating country info               : [========================================]
*** Scheduler is disabled ***
```

The `mysite.local` directory will now be created in the `sites` directory.

## Directory Structure

```sh
sites/mysite.local
├── locks
├── private
│   ├── backups
│   └── files
├── public
│   └── files
├── site_config.json
└── task-logs
```

### locks

This directory is used by the scheduler to synchronize various jobs using
the [file locking concept](http://en.wikipedia.org/wiki/File_locking).

### private

This directory contains files that require authentication to access. It contains
private files and backups. They can be accessed by the URL:
`/private/files/private-file.png`.

### public

This directory contains publicly accessible files. They can be accessed by the
URL: `/files/public-file.png`.

### site_config.json

This file contains site specific configuration.

## Site Config

A file named `site_config.json` exists in every site directory and is used to
store site specific configuration. The values are available in `frappe.conf`
local variable as a dict.

Example `site_config.json`:

```
{
	"db_name": "test_frappe",
	"db_password": "test_frappe",
	"admin_password": "admin",
}
```

Here is a list of all configuration options that can be specified:



<img width=250>Key Name | Description
-----------------     | -----------
`db_name`             | Database name
`db_password`         | Database password
`db_host`             | Database host (Default: `localhost`)
`db_ssl_ca`           | Full path to the ca.pem file used for connecting via ssl. (Example: `"/etc/mysql/ssl/ca.pem"`)
`db_ssl_cert`         | Full path to the cert.pem file used for connecting via ssl. (Example: `"/etc/mysql/ssl/client-cert.pem"`)
`db_ssl_key`          | Full path to the key.pem file used for connecting via ssl. (Example: `"/etc/mysql/ssl/client-key.pem"`)
`encryption_key`      | Encryption key used for passwords that are not hashed
`admin_password`      | Default Password for user Administrator
`root_password`       | MariaDB root password.
`mute_emails`         | Skips email sending (Default: 0)
`max_reports_per_user`| Maximum number of Auto Email Reports which can be created by a user (Default: 3)
`mail_server`         | SMTP server hostname
`mail_port`           | STMP port
`use_ssl`             | Connect via SSL / TLS
`mail_login`          | Login ID for SMTP server
`mail_password`       | Password for SMTP server
`developer_mode`      | Enable developer mode to allow creating controller based DocTypes
`disable_website_cache` | Disable cache in website pages
`logging`             | Set `0` to disable, set `1` to print logs, set `2` to log queries
`disable_async`       | Disables socket.io client, client stops polling the socket.io server
`max_file_size`       | Set this to limit the size of files uploaded by user (Default: 10MB)

## Site Resolution

While responding to an HTTP request, a site is automatically selected based on,

* `Host` header in the HTTP request matches a site
* `X-Frappe-Site-Name` header in the HTTP request matches a site

It is also possible to force the development server to serve a specific site by
starting it with the following command:

```sh
bench --site mysite.local serve
```

## Set a site as the current site

To force a site to be used as the default site, run the following command:

```sh
bench use mysite.local
```

After running this command, site specific commands can be run without the
`--site` parameter.

For example, instead of running:
```sh
bench --site mysite.local migrate
```

You can just run:
```sh
bench migrate
```
