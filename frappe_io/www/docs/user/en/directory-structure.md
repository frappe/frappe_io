---
base_template: frappe_io/www/frappe/frappe_base.html
add_breadcrumbs: 1
title: Directory Structure
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  Explanation of directory structure of Frappe Framework
---

# Directory structure

When you initialize a new **frappe-bench** directory, you will have a directory
structure similar to:

```bash
.
├── apps
│   ├── frappe
├── config
    ├── redis_cache.conf
    ├── redis_queue.conf
	└── redis_socketio.conf
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

### apps

The `frappe` app and other frappe based apps live in this directory. When you
run the command `bench new-app app_name`, the app will be bootstrapped in this
directory. Your custom apps live here and you are supposed to edit/work with
them here.

Learn more about [apps](/docs/user/en/apps).

### sites

Sites are served from this directory. When you run the command `bench new-site
site_name`, the site will be created in this directory. Sites are distinguished
based on their directory name.

Learn more about [sites](/docs/user/en/sites).

### env

The Python virtual environment live in this directory. Frappe based apps and
Python package dependencies are installed here.

### config

Frappe uses 3 Redis instances to manage caching, job queueing and socketio
communication. All of those configurations live here.

### logs

This directory is used to dump log files from various processes. Each log file
is named based on the process it is logged from.

### Procfile

Frappe uses Procfile based process management. The default Procfile looks
something like this:

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
Python worker with a (short) timeout of 300ms.

#### `worker_long:`
Python worker with a (long) timeout of 1500ms.

#### `worker_default:`
Python worker with a timeout of 300ms.
