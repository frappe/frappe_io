---
add_breadcrumbs: 1
title: Architecture
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
   Frappe Framework is a full-stack web based framework and it includes all the
   tools needed to deploy a site into production. Database, caching, background
   jobs, realtime notifications, etc are all configured when you set up a Frappe
   site.
---

# Architecture

Frappe Framework is a full-stack web based framework and it includes all the
tools needed to deploy a site into production. Database, caching, background
jobs, realtime notifications, etc are all configured when you set up a Frappe
site.

Frappe framework is based on Python, so it uses the `virtualenv` to setup
isolated environments for multiple Python versions. You can also use it to
deploy sites with different Frappe versions.

The following diagram closely resembles the `frappe-bench` directory structure
and its interface with different parts of the stack.

<img src="/docs/assets/img/architecture.png" alt="Architecture" class="mb-3">
*Architecture*

To setup a Frappe based site, you need to first install Bench. If you haven't
installed it already, check out the [Installation](/docs/user/en/installation)
page.

You can create a new `frappe-bench` setup by running the following command:

```sh
bench init frappe-bench
```

This command will do the following:

1. Create a directory called `frappe-bench` and `frappe-bench/sites`, `frappe-bench/apps` within it.
1. Setup a python virtual environment under `frappe-bench/env`.
1. Create a `frappe-bench/config` folder to store redis configuration files.
1. Download `frappe` app and `pip install` it.
1. Install node packages.
1. Build JS/CSS assets.

Each `frappe-bench` setup spawns it owns web, redis and node processes.
