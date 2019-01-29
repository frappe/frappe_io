<section class='top-section'>
	<h1>CLI to Manage Frappe Deployments</h1>
	<p class='lead'>
		Bench is a command line tool that helps you install, setup, manage multiple sites and apps based on Frappe Framework.
	</p>
</section>

### Create a new Frappe Environment

You can run multiple instances of frappe + erpnext on one server by creating multiple benches

```sh
bench init my-bench
```

### Create and Manage Sites

Bench will help you create new instances of ERPNext, called `sites` and also migrate and debug them.

```sh
# create a new site
bench new-site mysite.local

# install erpnext in mysite.local
bench --site mysite.local install-app erpnext

# backup the site
bench --site mysite.local backup
```

### Manage Updates

You can update all your instances to the latest release versions by running `bench update`. This will download the latest version of erpnext, update dependencies, run patches and also migrate the database schema.

```sh
bench update
```

### Production Setup

Bench will also help you create config files for NGINX, Redis and Supervisor that will be production ready for your multi-site server.

```sh
bench setup production
```

<section class='section-padding text-center'>
	<a href='https://github.com/frappe/bench' class='btn btn-dark' target='_blank'>
		Read the full documentation on GitHub
	</a>
	<p class='text-muted mt-3'>License: GNU General Public License</p>
</section>
