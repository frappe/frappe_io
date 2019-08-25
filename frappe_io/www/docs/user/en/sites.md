---
base_template: frappe_io/www/frappe/frappe_base.html
add_breadcrumbs: 1
title: Sites
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  Frappe Sites
---

# Sites

Frappe is a multitenant platform and each tenant is called a site.
Sites exist in a directory called `sites`, assumed as the current
working directory when running a bench command.

Every site contains a `private` and `public` directory which stores private and
public files respectively. `common_site_config.json` is a configuration file
common to all sites. `site_config.json` is a configuration file specific to each
site and will override options from `common_site_config.json`.
