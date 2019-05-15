<!-- base_template: frappe_io/www/frappe/frappe_base.html -->
<!-- add-breadcrumbs -->
# Creating a Frappe App

To create a new Frappe app, run the following command from the `frappe-bench` directory.

```bash
frappe@frappe:~/frappe-bench$ bench new-app my-app
INFO:bench.app:creating new app my_app
App Title (default: My App):
App Description: App description
App Publisher: John Doe
App Email: app@email.com
App Icon (default 'octicon octicon-file-directory'):
App Color (default 'grey'):
App License (default 'MIT'):
'my_app' created at /home/frappe/frappe-bench/apps/my_app
INFO:bench.app:installing my_app
INFO:bench.utils:./env/bin/pip install -q  -e ./apps/my_app

frappe@frappe:~/frappe-bench$ ls apps
frappe  my_app
```

The `my_app` directory will now be created in the `apps` directory. It will also be added to `apps.txt`.

To install an app, you must have a site. To install this app to a site, run the following command.

```bash
frappe@frappe:~/frappe-bench$ bench --site site_name install-app my_app

Installing my_app...
frappe@frappe:~/frappe-bench$ bench --site site_name list-apps
frappe
my_app
frappe@frappe:~/frappe-bench$
```

Running the `list-apps` sub-command, you can verify if the app was installed correctly.
