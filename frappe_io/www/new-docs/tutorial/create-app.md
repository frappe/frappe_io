# Writing your first app

## Create a new app

Open your terminal and `cd` into the `frappe-bench` directory. All commands need to be executed from this directory. Now let's execute our first command.

```sh
$ bench new-app discuss
```

Fill out the prompts as shown below.

```sh
App Title (default: Discuss):
App Description: A simple discussion forum
App Publisher: John Doe
App Email: john@doe.com
App Icon (default 'octicon octicon-file-directory'): octicon .octicon-comment-discussion
App Color (default 'grey'): orange
App License (default 'MIT'):
```

This will create a basic `frappe` app boilerplate in the `apps` directory. The directory structure of the app is shown below:

<!-- ![app directory structure](/assets/new-docs/directory-structure.png) -->

```sh

apps/discuss
├── MANIFEST.in
├── README.md
├── discuss
│   ├── __init__.py
│   ├── config
│   │   ├── __init__.py
│   │   ├── desktop.py
│   │   └── docs.py
│   ├── discuss
│   │   └── __init__.py
│   ├── hooks.py
│   ├── modules.txt
│   ├── patches.txt
│   ├── public
│   │   ├── css
│   │   └── js
│   ├── templates
│   │   ├── __init__.py
│   │   ├── includes
│   │   └── pages
│   │       └── __init__.py
│   └── www
├── discuss.egg-info
│   ├── PKG-INFO
│   ├── SOURCES.txt
│   ├── dependency_links.txt
│   ├── not-zip-safe
│   ├── requires.txt
│   └── top_level.txt
├── license.txt
├── requirements.txt
└── setup.py

11 directories, 21 files
```

Find out more about the directory in detail [here]().

Now that we have created our app, we need a site to host it. Let's create a site.

## Create a new site

```sh
$ bench new-site discuss.local
```

This command shall create a new database in MariaDB, so fill in your MariDB password here. It'll also create a new directory named `discuss.local` in the `sites` directory.
It'll also install the core `frappe` app in your site. Finally you'll have to set the `Administrator` password to access your site.

```sh
MySQL root password:

Installing frappe...
Updating DocTypes for frappe        : [========================================]
Updating country info               : [========================================]
Set Administrator password:
Re-enter Administrator password:
*** Scheduler is disabled ***

```

Frappe supports a multi-tenant architecture, so to access discuss.local from your browser, you will have to do the following.

1. Edit the contents of `sites/currentsite.txt` and make it empty.
1. Edit the contents of `/etc/hosts` and add the following line to it. (you will need `sudo` access)

    ```
    127.0.0.1 discuss.local
    ```

Now, open this link: [http://discuss.local:8000](http://discuss.local:8000)

![site screenshot](/assets/new-docs/new-site.png)

You should see the login page of your site.
