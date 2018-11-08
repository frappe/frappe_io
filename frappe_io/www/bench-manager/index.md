
<section class='top-section'>
	<h1>Bench Manager</h1>
	<p class='lead'>
		Bench Manager is a graphical user interface to emulate the functionalities of Frappe Bench. Like the command line utility it helps you install apps, manage multiple sites, update apps and much more.
	</p>
	<img src="https://raw.githubusercontent.com/wiki/frappe/bench_manager/images/fa-gamepad.svg?sanitize=true" width="250">
</section>


## Installation

Create a new site called bench-manager.local and install Bench Manager on the site.

```
$ bench new-site bench-manager.local
$ bench get-app bench_manager https://github.com/frappe/bench_manager
$ bench --site bench-manager.local install-app bench_manager
```
## Update Bench Manager

In frappe-bench directory execute:
```
$ bench update
```

## Features

#### What can you do using this app ?
- Update bench
- Backup your sites
- Install/Uninstall apps on your site
- Restore Backups on either existing sites or new sites
- Create new apps and sites

#### App Catalogue

There are 5 main doctypes associated with this app.

1. [Bench Settings](/bench-manager/docs/bench-settings)
2. [Site](/bench-manager/docs/site)
3. [Site Backup](/bench-manager/docs/site-backup)
4. [Bench Manager Command](/bench-manager/docs/bench-manager-command)
5. [App](/bench-manager/docs/app)

#### License

MIT

