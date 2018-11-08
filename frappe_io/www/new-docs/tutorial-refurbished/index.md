# Frappe Tutorial

In this guide, we will show you how to create an application from scratch using **Frappe Framework**. Using the example of a Library Management System, we will cover:

1. Making a New App
1. Making Models
1. Creating Users and Records
1. Creating Controllers
1. Creating Web Views
1. Setting Hooks and Tasks

## Library Management App

For this guide book, we will build a simple **Library Management** application. In this application we will have models:

1. Article (Book or any other item that can be loaned)
1. Library Member
1. Library Transaction (Issue or Return of an article)
1. Library Membership (A period in which a member is allowed to transact)
1. Library Management Setting (Global settings like period of loan)

The user interface (UI) for the librarian will be the **Frappe Desk**, a built-in browser based UI environment where forms are automatically generated from the models and roles and permissions are also applied.

We will also create web views for library where users can browse articles from a website.

## What is an Application

An Application in Frappe is just a standard Python application. You can structure a Frappe Application the same way you structure a standard Python Application.

Frappe Framework provides a WSGI interface and for development you can use the built-in Werkzeug server. For production deployment, we recommend using nginx and gunicorn.

Frappe also has a multi-tenant architecture, grounds up. This means that you can run multiple "sites" in your setup, each could be serving a different set of applications and users. The database for each site is separate.

## Installing Bench

Easiest way to setup frappe on a Unix like system is to use frappe-bench. Read the detailed instructions on how to [install using Frappe Bench](https://github.com/frappe/bench).

With Frappe Bench you will be able to setup and host multiple applications and sites and it will also setup a Python Virtualenv so that you can have an isolated environment to run your applications (and will not have version conflict with other development environments).

The `bench` command line tool will also be installed that will help you in development and management of the frappe based sites and apps.

## Make a New App

Once the bench is installed, cd into the `frappe-bench` folder. You will see two main folders, `apps` and `sites`. All the frappe applications will live inside `apps`.

To make a new application, run `bench new-app library_management` and fill in details about the application. This will create a boilerplate application for you.

```sh
$ bench new-app library_management
App Title (default: Library Management): Library Management
App Description: App for managing Articles, Members, Memberships and Transactions for Libraries
App Publisher: Frappe
App Email: info@frappe.io
App Icon (default 'octicon octicon-file-directory'): octicon octicon-book
App Color (default 'grey'): #589494
App License (default 'MIT'): GNU General Public License
```

### App Structure

The application will be created in a folder called `library_management` and will have the following structure:

```html
├── MANIFEST.in
├── README.md
├── library_management
|  ├── __init__.py
|  ├── config
|  |  ├── __init__.py
|  |  ├── desktop.py
|  |  └── docs.py
|  ├── hooks.py
|  ├── library_management
|  |  └── __init__.py
|  ├── modules.txt
|  ├── patches.txt
|  ├── public
|  |  ├── css
|  |  └── js
|  ├── templates
|  |  ├── __init__.py
|  |  ├── includes
|  |  └── pages
|  └── www
├── library_management.egg-info
├── license.txt
├── requirements.txt
└── setup.py
```

Name                   | Description
-----------------------|--
**config**             | Contains varios configurations such as desktop icons and docs generator.
**desktop.py**         | Configuration to add desktop icons to the Desk.
**docs.py**            | Contains configuration about the docs generator.
**library_management** | The first **Module** that is bootstrapped for the app. In Frappe, a **module** is where model and controller files reside.
**public**             | This folder is used to serve assets to browser like css and js files.
**templates**          | Templates for Web Views are maintained here.
**www**                | This folder directly serves `.html` and `.md` files and can be used to write static pages (with support for python controllers).
**hooks.py**           | Custom Hooks to integrate with other apps and also configure scheduler events.
**modules.txt**        | Contains list of **modules** in the app. When you create a new module, this file is updated automatically.
**patches.txt**        | The order of patches for migration are maintained here. The patch file itself can live anywhere in the application.

## Setting up the Site

Let us create a new site and call it `library`.

You can do so by issuing the command `bench new-site library`.

This will create a new database and site folder and install `frappe` (which is also an application!) in the new site.
The `frappe` application comes with lots of built-in modules one of which is called **Core**.
The Core module contains some basic models for the application which are necessary to run the application.
These models are called **DocTypes**. More on that later.

```sh
$ bench new-site library
MySQL root password:

Creating Database...

Installing frappe...
Updating DocTypes for frappe        : [========================================]
Updating country info               : [========================================]
*** Scheduler is disabled ***
```

### Site Structure

A new folder called `library` will be created in the `sites` folder. Here is the standard folder structure for a site.

```html
├── locks
├── private
|  ├── backups
|  └── files
├── public
|  └── files
├── site_config.json
└── task-logs
```

Name                     | Description
-------------------------|--
**public/files**         | User uploaded files are stored here
**private/files**        | User uploaded files which are accessible only to authorized users
**private/backups**      | Site backups are dumped here
**site_config.json**     | Site level configuration live here

### Install App

Now let us install our app `library_management` in our site `library`

Run the command

```sh
bench --site library install-app library_management

Installing library_management...
```

## Starting the Bench

To serve our site on the built-in web server, run `bench start`

```sh
$ bench start
22:19:59 system           | redis_cache.1 started (pid=89056)
22:19:59 system           | redis_queue.1 started (pid=89059)
22:19:59 system           | redis_socketio.1 started (pid=89058)
22:19:59 system           | web.1 started (pid=89061)
22:19:59 system           | socketio.1 started (pid=89063)
22:19:59 system           | watch.1 started (pid=89064)
22:19:59 system           | schedule.1 started (pid=89067)
22:19:59 redis_cache.1    | 89056:C 04 Nov 22:19:59.523 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
22:19:59 redis_cache.1    | 89056:C 04 Nov 22:19:59.533 # Redis version=4.0.11, bits=64, commit=00000000, modified=0, pid=89056, just started
22:19:59 redis_cache.1    | 89056:C 04 Nov 22:19:59.533 # Configuration loaded
22:19:59 redis_cache.1    | 89056:M 04 Nov 22:19:59.535 * Increased maximum number of open files to 10032 (it was originally set to 4864).
22:19:59 system           | worker_short.1 started (pid=89069)
22:19:59 redis_socketio.1 | 89058:C 04 Nov 22:19:59.529 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
22:19:59 redis_socketio.1 | 89058:C 04 Nov 22:19:59.540 # Redis version=4.0.11, bits=64, commit=00000000, modified=0, pid=89058, just started
22:19:59 redis_socketio.1 | 89058:C 04 Nov 22:19:59.540 # Configuration loaded
22:19:59 redis_socketio.1 | 89058:M 04 Nov 22:19:59.542 * Increased maximum number of open files to 10032 (it was originally set to 4864).
22:19:59 system           | worker_long.1 started (pid=89070)
22:19:59 system           | worker_default.1 started (pid=89071)
22:19:59 redis_queue.1    | 89059:C 04 Nov 22:19:59.535 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
22:19:59 redis_queue.1    | 89059:C 04 Nov 22:19:59.547 # Redis version=4.0.11, bits=64, commit=00000000, modified=0, pid=89059, just started
22:19:59 redis_queue.1    | 89059:C 04 Nov 22:19:59.547 # Configuration loaded
22:19:59 redis_queue.1    | 89059:M 04 Nov 22:19:59.549 * Increased maximum number of open files to 10032 (it was originally set to 4864).
22:19:59 redis_cache.1    | 89056:M 04 Nov 22:19:59.555 * Running mode=standalone, port=13000.
22:19:59 redis_cache.1    | 89056:M 04 Nov 22:19:59.555 # Server initialized
22:19:59 redis_cache.1    | 89056:M 04 Nov 22:19:59.556 * Ready to accept connections
22:19:59 redis_socketio.1 | 89058:M 04 Nov 22:19:59.563 * Running mode=standalone, port=12000.
22:19:59 redis_socketio.1 | 89058:M 04 Nov 22:19:59.563 # Server initialized
22:19:59 redis_socketio.1 | 89058:M 04 Nov 22:19:59.563 * Ready to accept connections
22:19:59 redis_queue.1    | 89059:M 04 Nov 22:19:59.578 * Running mode=standalone, port=11000.
22:19:59 redis_queue.1    | 89059:M 04 Nov 22:19:59.578 # Server initialized
22:19:59 redis_queue.1    | 89059:M 04 Nov 22:19:59.578 * Ready to accept connections
22:20:00 socketio.1       | listening on *: 9000
22:20:05 web.1            |  * Running on http://0.0.0.0:8000/ (Press CTRL+C to quit)
22:20:05 web.1            |  * Restarting with fsevents reloader
22:20:05 watch.1          | yarn run v1.10.1
22:20:05 watch.1          | $ node rollup/watch.js
22:20:06 web.1            |  * Debugger is active!
22:20:06 web.1            |  * Debugger PIN: 283-272-846
22:20:07 watch.1          |
22:20:07 watch.1          | Rollup Watcher Started
22:20:07 watch.1          |
22:20:07 watch.1          | Watching...
22:20:07 watch.1          | Rebuilding frappe-web.css
22:20:07 watch.1          | Rebuilding chat.js
22:20:08 watch.1          | Rebuilding frappe-web.min.js
22:20:10 watch.1          | Rebuilding control.min.js
22:20:11 watch.1          | Rebuilding dialog.min.js
22:20:12 watch.1          | Rebuilding desk.min.css
22:20:12 watch.1          | Rebuilding frappe-rtl.css
22:20:12 watch.1          | Rebuilding desk.min.js
22:20:14 watch.1          | Rebuilding module.min.css
22:20:14 watch.1          | Rebuilding form.min.css
22:20:14 watch.1          | Rebuilding form.min.js
22:20:15 watch.1          | Rebuilding list.min.css
22:20:15 watch.1          | Rebuilding list.min.js
22:20:16 watch.1          | Rebuilding report.min.css
22:20:16 watch.1          | Rebuilding report.min.js
22:20:17 watch.1          | Rebuilding web_form.min.js
22:20:17 watch.1          | Rebuilding web_form.css
22:20:17 watch.1          | Rebuilding print_format_v3.min.js
22:20:17 watch.1          | Rebuilding email.css
```

As you can see, a bunch of processes get started. Some of the processes include Redis Server (for caching), Node server (for realtime), and Rollup for watching/compiling JS/CSS files.

You can now open your browser and go to `http://localhost:8000`. You should see this login page if all goes well:

<img class="screenshot" alt="Login Screen" src="/docs/assets/img/login.png">

You can login with the username **Administrator** and password which you used during installation.

After you login, you should see the Setup Wizard. Input your language and country information and click on **Complete Setup** to complete the setup wizard.

<img class="screenshot" alt="Setup Wizard" src="/new-docs/assets/tutorial/setup-wizard.png">

After the setup, you should see the **Desk**.

<img class="screenshot" alt="Desk" src="/new-docs/assets/tutorial/desk.png">

Pat yourself on the back if you have reached this point.

### Developer Mode

Before we go on to create models, we need to enable Developer Mode. Locate the `site_config.json` of your site, in our case, it must be located in `frappe-bench/sites/library/site_config.json`.
Add the following key value pair in the JSON file.

```
{
    "developer_mode": 1,
    ...
}
```

Now, in your Desk, click on user dropdown and then Set Desktop Icons. Make sure the **Developer** item is checked and then Save.

<img class="screenshot" alt="Set Desktop Icons" src="/new-docs/assets/tutorial/set-desktop-icons.png">

You should now see the **Developer** icon on your desk. This gives you access to Developer Tools which will useful for us to create DocTypes.

<img class="screenshot" alt="Developer Icon" src="/new-docs/assets/tutorial/developer-icon.png">

## Making Models

The next step is to create the models as we discussed in the introduction. In Frappé, a model is called a **DocType**. You can create new DocTypes from the Desk UI. **DocTypes** are made of fields called **DocField** and role based permissions are integrated into the models, these are called **DocPerms**.

When a DocType is saved, a new table is created in the database. This table is named as `tab{doctype}`.

When you create a **DocType** a new folder is created in the **Module** and a model JSON file and a controller template in Python are automatically created. When you update the DocType, the JSON model file is updated and whenever `bench migrate` is executed, it is synced with the database. This makes it easy to propagate schema changes and migrate.

## Creating DocTypes

To create a new **DocType**, go to:

> Developer > Documents > Doctype > New

<img class="screenshot" alt="New Doctype" src="/new-docs/assets/tutorial/new-doctype.png">

The first field in DocType, is the name. Let's start with the doctype **Article**.

Select **Library Management** as the module for our DocType.

### Adding Fields

In the Fields Table, you can add the fields (properties) of the DocType (Article).

Fields are much more than database columns, they can be:

1. Columns in the database
1. Layout helpers (section / column breaks)
1. Child tables (Table type field)
1. Attachments or Images

Let us add the fields of the Article.

<img class="screenshot" alt="Adding Fields" src="/new-docs/assets/tutorial/new-doctype-fields.png">

When you add fields, you need to set the appropriate **Type** for it. **Label** is optional for Section Break and Column Break. **Name** (`fieldname`) is the name of the database table column and also the property of the controller. This has to be *code friendly*, i.e. it has to have small cases and _ instead of " ". If you leave the Name blank, it will be automatically inferred from the label when you save it.

You can also set other properties of the field like whether it is mandatory, read only etc.

Let's add the following fields:

1. Article Name
    - Type: Data
2. Author
    - Type: Data
3. Description
    - Type: Text Editor
4. ISBN
    - Type: Data
5. Status
    - Type: Select
    - Options: Enter **Issued** and **Available** each on a new line
6. Publisher
    - Type: Data
7. Language
    - Type: Data
8. Image
    - Type: Attach Image

<img class="screenshot" alt="Added Fields" src="/new-docs/assets/tutorial/added-fields.png">

<!-- ### Add Permissions

After adding the fields, hit done and add a new row in the Permission Rules section. For now, let us give Read, Write, Create, Delete and Report access to **Librarian**. Frappé has a finely grained Role based permission model. You can also change permissions later using the **Role Permissions Manager** from **Setup**.

<img class="screenshot" alt="Adding Permissions" src="/docs/assets/img/doctype_adding_permission.png"> -->

Now, click on the **Save** button.

**A few things have been created.**

- Database Table with the name `tabArticle` with columns we described in fields section.
- If you look at the folder `library_management/doctype/article` there are a couple of boilerplate files created automatically.
    - `article.py` is the Python controller
    - `article.js` is the JS controller
    - `article.json` is the JSON mentioned earlier which helps in migration
    - `test_*` a couple of test files

Now login into mariadb console and check the database table created:

```sh
$ bench --site library mariadb
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 166164
Server version: 10.3.9-MariaDB Homebrew

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [00299a408dc3498a]> DESC tabArticle;
+--------------+--------------+------+-----+---------+-------+
| Field        | Type         | Null | Key | Default | Extra |
+--------------+--------------+------+-----+---------+-------+
| name         | varchar(140) | NO   | PRI | NULL    |       |
| creation     | datetime(6)  | YES  |     | NULL    |       |
| modified     | datetime(6)  | YES  | MUL | NULL    |       |
| modified_by  | varchar(140) | YES  |     | NULL    |       |
| owner        | varchar(140) | YES  |     | NULL    |       |
| docstatus    | int(1)       | NO   |     | 0       |       |
| parent       | varchar(140) | YES  | MUL | NULL    |       |
| parentfield  | varchar(140) | YES  |     | NULL    |       |
| parenttype   | varchar(140) | YES  |     | NULL    |       |
| idx          | int(8)       | NO   |     | 0       |       |
| status       | varchar(140) | YES  |     | NULL    |       |
| publisher    | varchar(140) | YES  |     | NULL    |       |
| _liked_by    | text         | YES  |     | NULL    |       |
| isbn         | varchar(140) | YES  |     | NULL    |       |
| description  | longtext     | YES  |     | NULL    |       |
| language     | varchar(140) | YES  |     | NULL    |       |
| author       | varchar(140) | YES  |     | NULL    |       |
| article_name | varchar(140) | YES  |     | NULL    |       |
| _comments    | text         | YES  |     | NULL    |       |
| image        | text         | YES  |     | NULL    |       |
| _assign      | text         | YES  |     | NULL    |       |
| _user_tags   | text         | YES  |     | NULL    |       |
+--------------+--------------+------+-----+---------+-------+
22 rows in set (0.004 sec)
```

As you can see, along with the DocFields, several standard columns have also been added to the table.

- `name`: Primary Key.
- `creation`: Time of creation of record.
- `modified`: Time when record was last modified.
- `modified_by`: User who last modified this record.
- `owner`: User who created the record.
- `docstatus`: Document Status(docstatus) is a standard field in all doctypes (0 - draft, 1 - submitted, 2- cancelled).0 is set to be default.
- `parent`: The name of the parent doctype(If the doctype is the child of the of other doctype otherwise it is set to . be NULL).
- `parent feild`: The name of the table feild in the parent Doctype(If the doctype is itself child doctype).
- `parent type`: The parent doctype.
- `idx`: It shows index of the entries of the information in the corresponding Parent Doctype(If available) Table feild.
- `status`: 



We will discuss other fields later in the tutorial.
