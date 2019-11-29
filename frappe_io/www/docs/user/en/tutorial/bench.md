<!-- base_template: frappe_io/www/frappe/frappe_base.html --><!-- add-breadcrumbs -->
# Installing the Frappe Bench

Easiest way to setup frappe on a Unix Like system is to use frappe-bench. Read the detailed instructions on how to install using Frappe Bench.

> [https://github.com/frappe/bench](https://github.com/frappe/bench)

With Frappe Bench you will be able to setup and host multiple applications and sites and it will also setup a Python Virtualenv so that you can have an isolated environment to run your applications (and will not have version conflict with other development environments).

The `bench` command line tool will also be installed that will help you in development and management of the installation.

## Create a new bench

The init command will create a bench directory with frappe framework installed. It will be setup for periodic backups and auto updates once a day.

        $ bench init frappe-bench && cd frappe-bench
        INFO:bench.utils:virtualenv -q env -p /usr/bin/python3
        Already using interpreter /usr/bin/python3
        INFO:bench.utils:env/bin/pip -q install --upgrade pip
        INFO:bench.utils:env/bin/pip -q install wheel
        .
        .
        ✨  Done in 102.992s
        Done in 104.04s.
        INFO:bench.utils:setting up backups
        INFO:bench.utils:setting up auto update
        Bench frappe-bench initialized

        

{next}
