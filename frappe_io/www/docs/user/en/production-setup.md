---
add_breadcrumbs: 1
title: Production Setup
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: Learn how to deploy Frappe based sites in production.
---

# Production Setup

[Bench](https://github.com/frappe/bench) is the CLI tool to manage deployments
for sites based on Frappe Framework. Here are steps to deploy your frappe based
sites on production.

## Install Bench

Deploying frappe sites is not too different from setting it up on your local
system. Install bench using the [Easy
Install](https://github.com/frappe/bench#easy-install) script if your server is
one of the supported linux distributions (Debian, Ubuntu, CentOS). Make sure you
pass the `--production` flag to the script.

```bash
sudo python install.py --production --user [frappe-user]
```

## Setup sites and apps

```bash
# change directory to frappe-bench
cd frappe-bench

# create a new site
bench new-site example.com

# download frappe apps or your custom-apps
bench get-app erpnext
bench get-app https://github.com/yourremote/yourapp.git

# install apps onto your site
bench --site example.com install-app erpnext yourapp
```

## Check supervisor

If everything is setup properly, you should see frappe processes as the
supervisor status output.

```
$ sudo supervisorctl status
frappe-bench-redis:frappe-bench-redis-cache                 RUNNING   pid 6467, uptime 10 days, 8:12:09
frappe-bench-redis:frappe-bench-redis-queue                 RUNNING   pid 6466, uptime 10 days, 8:12:09
frappe-bench-redis:frappe-bench-redis-socketio              RUNNING   pid 6468, uptime 10 days, 8:12:09
frappe-bench-web:frappe-bench-frappe-web                    RUNNING   pid 8856, uptime 10 days, 4:32:18
frappe-bench-web:frappe-bench-node-socketio                 RUNNING   pid 8858, uptime 10 days, 4:32:18
frappe-bench-workers:frappe-bench-frappe-default-worker-0   RUNNING   pid 8823, uptime 10 days, 4:32:19
frappe-bench-workers:frappe-bench-frappe-long-worker-0      RUNNING   pid 8824, uptime 10 days, 4:32:19
frappe-bench-workers:frappe-bench-frappe-schedule           RUNNING   pid 8822, uptime 10 days, 4:32:19
frappe-bench-workers:frappe-bench-frappe-short-worker-0     RUNNING   pid 8825, uptime 10 days, 4:32:19
```

If you own `example.com` and it is mapped to the IP Address of your server, your
site should be live on `example.com`.

## Updating

To update your sites, just run the following command. It will update all of your
apps (`git pull`), run patches on all sites, build JS and CSS assets and restart
supervisor.

```bash
# update everything
bench update

# update apps
bench update --pull

# run patches only
bench update --patch

# build assets only
bench update --build

# update bench (the cli)
bench update --bench

# update python packages and node_modules
bench update --requirements
```
