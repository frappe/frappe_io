# Bench Settings

- This is a single doctype whose main purpose is to peruse your bench instance and load all the necessary config onto the related doctypes such as App, Site and Site Backup.
- The Update button emulates the ``` bench update ``` command and updates all the installed apps.
- The Sync button does the following functions.
  - Reads your bench instance, greps and loads all the backups onto the Site Backup doctype.
  - Reads, greps and populates the Site doctype with all the existing sitse in the current bench instance.
  - Reads, greps and populates all the installed apps in the App doctype.
- The Bench setting doctype also displays all the config parameters in the common-site-config.json which is applicable to all
  the sites in your bench instance.

### Edit Common Site Config

<img src="https://github.com/frappe/bench_manager/wiki/images/bench_settings-overview.gif" width="600">

### Create a New Site

<img src="https://github.com/frappe/bench_manager/wiki/images/bench_settings-new_site.gif" width="600">

### Sync all your Sites.

<img src="https://github.com/frappe/bench_manager/wiki/images/bench_settings-sync.gif" width="600">

### Update Bench

<img src="https://github.com/frappe/bench_manager/wiki/images/bench_settings-update.gif" width="600">

