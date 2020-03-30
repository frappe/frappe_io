---
base_template: frappe_io/www/frappe/frappe_base.html
add_breadcrumbs: 1
title: Production Setup
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: Learn how to deploy Frappe based sites in production.
---

# Production Setup

[Bench](https://github.com/frappe/bench) is the CLI tool to manage deployments
for sites based on Frappe Framework. There are a couple of ways you can setup
a production instance:

 - Docker Setup
 - Easy Install

We recommend setting up a production instance using Docker Setup, as the docker builds
are reproducible and is the fastest way to get a production instance up and running.

## Setup Frappe using Docker

Deploying Frappe using Docker is as easy as running a few commands. Firstly, you will
need to clone the official docker repository:

```sh
$ git clone https://github.com/frappe/frappe_docker.git
$ cd frappe_docker
```

Copy the `env-example` file to `.env` and make changes to it:

```sh
$ cp installation/env-example installation/.env
```

Make a directory to host your sites:

```sh
$ mkdir installation/sites
```

Now, you may also choose to setup an NGINX Proxy for handling SSL Certificates, which
will take care of certificate auto-renewal for your production instance. We generally
recommend this for instances being accessed over the internet. Just make sure that the
DNS is correctly configured for this to work. To setup the proxy, run the following
commands:

```sh
$ git clone https://github.com/evertramos/docker-compose-letsencrypt-nginx-proxy-companion.git
$ cd docker-compose-letsencrypt-nginx-proxy-companion
$ cp .env.sample .env
$ ./start.sh
```

To get the Frappe instance running, run the following command:

```sh
$ docker-compose \
    --project-name <project-name> \
    -f installation/docker-compose-common.yml \
    -f installation/docker-compose-frappe.yml \
    -f installation/docker-compose-networks.yml \
    --project-directory installation up -d
```
Make sure to replace `<project-name>` with whatever you wish to call it. This should get
the instance running through docker. Now, to create a new site on the instance
you may run:

```sh
# Create ERPNext site
docker exec -it \
    -e "SITE_NAME=$SITE_NAME" \
    -e "DB_ROOT_USER=$DB_ROOT_USER" \
    -e "MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD" \
    -e "ADMIN_PASSWORD=$ADMIN_PASSWORD" \
    -e "INSTALL_APPS=yourapp" \ # optional, if you want to install any other apps
    <project-name>_erpnext-python_1 docker-entrypoint.sh new
```

Once this is done, you may access the instance at `$SITE_NAME`.

**Note:** The Docker Production setup does not contain, require, or use bench.
For a list of substitute commands, check out the
[Frappe/ERPNext Docker Site Operations](https://github.com/frappe/frappe_docker/#site-operations).

## Install Bench using Easy Install Method

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
