---
add_breadcrumbs: 1
title: Apps
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  A Frappe app is a python package that uses the Frappe framework. Frappe apps
  live in a directory called `apps` in the `frappe-bench` directory.
---

# Apps

A Frappe app is a python package that uses the Frappe framework. Frappe apps live
in a directory called `apps` in the `frappe-bench` directory.

The default app `frappe` is a frappe app which acts as the framework for all
apps. A Frappe app should have an entry in `apps.txt`.

## Creating an App

Frappe ships with a boilerplate for a new app. To create a new app, run the
following command from the `frappe-bench` directory.

```sh
$ bench new-app custom_app
INFO:bench.app:creating new app custom_app
App Title (default: Custom App):
App Description: Custom Frappe App
App Publisher: John Doe
App Email: custom@johndoe.com
App Icon (default 'octicon octicon-file-directory'):
App Color (default 'grey'):
App License (default 'MIT'):
'custom_app' created at /Users/johndoe/frappe-bench/apps/custom_app
INFO:bench.app:installing custom_app
INFO:bench.utils:./env/bin/pip install -q  -e ./apps/custom_app
```
The `custom_app` directory will now be created in the `apps` directory. It will
also be added to `apps.txt`.

## Directory structure

The directory structure of the app will look something like this:

```sh
apps/custom_app
├── MANIFEST.in
├── README.md
├── custom_app
│   ├── __init__.py
│   ├── config
│   │   ├── __init__.py
│   │   ├── desktop.py
│   │   └── docs.py
│   ├── custom_app
│   │   └── __init__.py
│   ├── hooks.py
│   ├── modules.txt
│   ├── patches.txt
│   ├── public
│   │   ├── css
│   │   └── js
│   ├── templates
│   │   ├── __init__.py
│   │   └── includes
│   └── www
├── custom_app.egg-info
│   ├── PKG-INFO
│   ├── SOURCES.txt
│   ├── dependency_links.txt
│   ├── not-zip-safe
│   ├── requires.txt
│   └── top_level.txt
├── license.txt
├── requirements.txt
├── package.json
└── setup.py
```

### requirements.txt

This file stores the list of python dependencies. When this app is installed,
it's dependencies will also get installed.

### package.json

This file is used to keep track of node dependencies. Learn more about it
[here](https://docs.npmjs.com/files/package.json).

### custom_app

This is the directory where the source files are stored.

### custom\_app/custom_app

When you create a new app, a module with the same name is also created within
the app. This is the directory which corresponds to that module.

### custom_app/hooks.py

This file is used to hook into frappe events and extend or override standard
behaviour by frappe.

Learn more about [hooks](/docs/user/en/guides/basics/hooks).

### custom_app/modules.txt

Every frappe app is organized into different modules. Every DocType is part of a
module. These modules are listed in this file.

Learn more about [modules](/docs/user/en/understanding-doctypes#module).

### custom_app/patches.txt

This file is used to maintain the list of patches an app might have to go
through in its lifecycle. These patches are run in order, and they are run only
once.

Learn more about [patches](/docs/user/en/patches).

### custom_app/public

The public folder is a static folder and can be served by nginx in production.
Files put here can be accessed via the url `/assets/custom_app/**/*`.

For example, the file `public/img/logo.png` is accessible via the url
`/assets/custom_app/img/logo.png`.

This folder is used to store static assets used directly in the client side like
JS, CSS and Images.

### custom_app/templates

The templates folder is used to write and manage Jinja Templates. They can be
organized in any way you want. This directory is directly scanned when you use
them in Jinja templates.

For example, when you include a partial {% raw %}`{% include "templates/navbar/navbar.html" %}`{% endraw %},
it will first scan this directory and then fallback to other apps.

### custom_app/www

Files in this directory are directly mapped to portal pages and the URLs match the
directory structure.

Learn more about [portal pages](/docs/user/en/portal-pages).

## Installing an app into a site

To use an app, it must be installed on a site. Installing an app on a site means
creating the models that are bundled with the app into the site, which means
creating database tables in the site database.

To install an app onto a site, run the following command:

```sh
$ bench --site site_name install-app custom_app

Installing custom_app...
```

To check whether the app was installed correctly, run the following command:

```
$ bench --site site_name list-apps
frappe
custom_app
```
