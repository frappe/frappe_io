<!-- base_template: frappe_io/www/frappe/frappe_base.html --><!-- add-breadcrumbs -->
# Making Users and Records

Now that we have created the models, we can directly start making records using Frappe Desk UI. You do not have to create views! Views in Frappe are automatically made based on the DocType properties.

### 4.1 Creating User

To make records, we will first create a User. To create a user, go to:

> Users and Permissions > User > New

Create a new User and set the email and first name. Then, click on edit in full page, go to **CHANGE PASSWORD** section and set a new password.

After the user is created, click on the user in the list view and go to **ROLES** section. Here, give the Librarian and Library Member Roles to this user

<img class="screenshot" alt="Add User Roles" src="/docs/assets/img/add_user_roles.png">

Now logout and login using the new user id and password.

### 4.2 Creating Records

You will now see an icon for the Library Management module. *If you do not* see an icon you will have to configure the desk. So go to the `config` folder (of the newly made app) and create a new file `library_management.py`. 

```
Directory Structure
apps/
├── frappe
└── library_management
    ├── MANIFEST.in
    ├── README.md
    ├── library_management
    │   ├── __init__.py
    │   ├── config
    │   │   ├── __init__.py
    │   │   ├── desktop.py
    │   │   ├── docs.py
    │   │   └── library_management.py   <--Here 
    │   ├── hooks.py
    │   ├── library_management
    │   │   ├── __init__.py
    │   │   └── doctype
    │   ├── modules.txt
    │   ├── patches.txt
    │   ├── public
    │   ├── templates
    │   └── www
```

Paste the following code to configure the desk in order to view the Module.

	from __future__ import unicode_literals
	from frappe import _
	
	def get_data():
		return [
          {
            "label":_("Library"),
            "icon": "octicon octicon-briefcase",
            "items": [
                {
                  "type": "doctype",
                  "name": "Article",
                  "label": _("Article"),
                  "description": _("Articles which members issue and return."),
                },
                {
                  "type": "doctype",
                  "name": "Library Member",
                  "label": _("Library Member"),
                  "description": _("People whohave enrolled for membership in the library."),
                },
                {
                  "type": "doctype",
                  "name": "Library Membership",
                  "label": _("Library Membership"),
                  "description": _("People who have taken membership for the library"),
                },
                {
                  "type": "doctype",
                  "name": "Library Transaction",
                  "label": _(""),
                  "description": _("Issuing an article or returning an article are the transactions taking place."),
                }
              ]
          }
      ]

Now save the script and reload the page. You should see the icon for the library management module.
Click on that icon and you will see the Module page:

<img class="screenshot" alt="Library Management Module" src="/docs/assets/img/lib_management_module.png">

Here you can see the DocTypes that we have created for the application. Let us start creating a few records.

First let us create a new Article:

<img class="screenshot" alt="New Article" src="/docs/assets/img/new_article_blank.png">

Here you will see that the DocType you had created has been rendered as a form. The validations and other rules will also apply as designed. Let us fill out one Article.

<img class="screenshot" alt="New Article" src="/docs/assets/img/new_article.png">

You can also add an image.

<img class="screenshot" alt="Attach Image" src="/docs/assets/img/attach_image.gif">

Now let us create a new member:

<img class="screenshot" alt="New Library Member" src="/docs/assets/img/new_member.png">

After this, let us create a new membership record for the member.

Here if you remember we had set the values of Member First Name and Member Last Name to be directly fetched from the Member records and as soon as you will select the member id, the names will be updated.

<img class="screenshot" alt="New Library Membership" src="/docs/assets/img/new_lib_membership.png">

As you can see that the date is formatted as year-month-day which is a system format. To set / change date, time and number formats, go to

> Settings > System Settings

You will find system settings under 'Core'. If you don't find system settings, log in through the administrator account.

<img class="screenshot" alt="System Settings" src="/docs/assets/img/system_settings.png">

{next}
