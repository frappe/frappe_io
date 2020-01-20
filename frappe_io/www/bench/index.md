<section class='top-section'>
	<h1>CLI to Manage Frappe Deployments</h1>
	<p class='lead'>
		bench is a command line tool that helps you install, setup, manage multiple sites and apps based on Frappe Framework.
	</p>
</section>

### Create a new Frappe Environment

You can have multiple sites running Frappe along with other Frappe based Apps (like ERPNext) on one bench and have different versions of Frappe (and Frappe apps) across multiple benches on the same server! Apart from this, most commands require to be run in the context of the respective bench directory.

```sh
bench init frappe-bench-dev
```

### Create and Manage Sites

Before running any more commands be sure to change working directory to your bench! For this instance, the root directory is _frappe-bench-dev_. bench will help you create new sites. Each site can hold installations of various combinations of Frappe apps.

```sh
# create a new site
bench new-site new-site1.local

# install erpnext in mysite.local
bench --site new-site1.local install-app erpnext

# backup the site
bench --site new-site1.local backup
```

### Manage Updates

You can update all your instances to the latest release versions by running the `update` command. This will download the latest version all the apps on bench, update dependencies, run patches, and also migrate the database schema. If executed outside a bench directory, it just updates the bench tool!

```sh
bench update
```

### Production Setup

Bench will also help you create config files for NGINX, Redis and Supervisor that will be production ready for your multi-site server.

```sh
bench setup production [user]
```

<section class='section-padding text-center'>
	<a href='https://github.com/frappe/bench#bench' class='btn btn-dark' target='_blank'>
		Read the full documentation on GitHub
	</a>
	<p class='text-muted mt-3'>Licensed under
		<a href='https://github.com/frappe/bench/blob/master/LICENSE.md' target='_blank'>
		GNU General Public License v3
		</a>
	</p>
</section>
