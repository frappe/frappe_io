# Site

* The Site doctype shows a list of all the sites in the current bench instance.
* Inside each individual docname of the Site doctype one can find 3 clickable buttons.
  1. Migrate
      * This button emulates the ```bench migrate``` command.
      * It applies schema changes and data migrations if any.
      * Migrate should be run after you pull updates from any Frappe app.
  2. Backup Site
      * This button backs up the site with all the files ie. it emulates ``` bench update ```
      * By default the sites are backed up with all the files
  3. Install App
      * On clicking this button a ui-dialog pops up where one can select and install any app onto the site.
  4. Uninstall App
      * Lets you uninstall an app from the site.

* Want to delete a site? :(

<img src="https://github.com/frappe/bench_manager/wiki/images/site-drop_site.gif" width="600">

* Install app on site

<img src="https://github.com/frappe/bench_manager/wiki/images/site-install_app.gif" width="600">

* Uninstall app from site

<img src="https://github.com/frappe/bench_manager/wiki/images/site-uninstall_app.gif" width="600">

* Backup a site

<img src="https://github.com/frappe/bench_manager/wiki/images/site-backup.gif" width="600">

* Migrate a site

<img src="https://github.com/frappe/bench_manager/wiki/images/site-migrate.gif" width="600">

* Reinstall a site

<img src="https://github.com/frappe/bench_manager/wiki/images/site-reinstall.gif" width="600">

