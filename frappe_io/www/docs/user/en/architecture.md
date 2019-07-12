---
base_template: frappe_io/www/frappe/frappe_base.html
add_breadcrumbs: 1
title: Bench Architecture
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  Bench is a command-line utility that helps you install apps, manage multiple
  sites and update Frappe based apps on *nix based systems.
---

# Bench Architecture

Bench is a command-line utility that helps you install apps,
manage multiple sites and update Frappe based apps on *nix based systems
(macOS, CentOS, Debian, Ubuntu, etc) for development and production.
Bench will also create nginx and supervisor config files, setup backups and much more.

<img src="/docs/assets/img/bench-architecture.png" alt="Bench Architecture" class="mb-3">
*Bench Architecture*

> For installation, check this [guide](/docs/installation)

### Directory structure
When you install **bench**, you will have a directory structure similar to

```bash
.
├── apps
│   ├── frappe
├── config
├── env
├── logs
├── Procfile
└── sites
    ├── apps.txt
    ├── assets
    ├── common_site_config.json
    └── site1.local
        ├── private
        ├── public
        └── site_config.json
```

### Apps

A Frappe app is a python package that use the Frappe framework. Frappe apps live
in a directory called `apps`. As you can see, there is an app named `frappe`,
since frappe is an app which acts as the framework.
A Frappe app should have an entry in `apps.txt`.

### Sites

Frappe is a multitenant platform and each tenant is called a site.
Sites exist in a directory called `sites`, assumed as the current
working directory when running a bench command.

Every site contains a `private` and `public` directory which stores private and
public files respectively. `common_site_config.json` is a configuration file
common to all sites. `site_config.json` is a configuration file specific to each
 site and will override options from `common_site_config.json`.

### Virtual Environment

Every `frappe-bench` directory is a python virtual environment.
It holds the python packages required by frappe apps.

### Processes

Processes are defined in a file called `Procfile`. This is only for developement mode.

```
redis_cache: redis-server config/redis_cache.conf
redis_socketio: redis-server config/redis_socketio.conf
redis_queue: redis-server config/redis_queue.conf
web: bench serve --port 8000

socketio: /usr/bin/node apps/frappe/socketio.js

watch: bench watch

schedule: bench schedule
worker_short: bench worker --queue short --quiet
worker_long: bench worker --queue long --quiet
worker_default: bench worker --queue default --quiet
```

Let's see what each process is used for.

#### `redis_cache:`
Redis used for in-memory caching.

#### `redis_socketio:`
Redis used as a pub/sub between `web` and `socketio` processes for realtime communication.

#### `redis_queue:`
Redis used for managing background jobs queuing.

#### `web:`
Python web server based on [Werkzeug](https://palletsprojects.com/p/werkzeug/).

#### `socketio:`
Node server for a socketio connection with the browser for realtime communication.

#### `watch:`
Node server for bundling JS/CSS assets using [Rollup](https://rollupjs.org).
It will also rebuild files as they change.

#### `schedule:`
Job Scheduler using Python RQ.

#### `worker_short:`
This worker has a short timeout (300).

#### `worker_long:`
This worker has a long timeout (1500).

#### `worker_default:`
This worker has a default timeout (300).