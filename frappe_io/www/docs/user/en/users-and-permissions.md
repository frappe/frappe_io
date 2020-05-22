---
add_breadcrumbs: 1
title: Users and Permissions
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  Frappe comes with a user authentication system. It handles user accounts, role
  based permissions and cookie based user sessions.
---

# Users and Permissions

Frappe comes with a user authentication system. It handles user accounts, role
based permissions and cookie based user sessions.

User authentication system in Frappe comes with a lot of features out of the
box:

1. User
1. Role
1. DocType Permissions
1. Permission Level
1. Role Permission Manager
1. User Permissions
1. Restricting Views and Forms
1. Password Hashing
1. Password strength checking
1. Throttling of login attempts
1. Third party authentication like OAuth, Google, Facebook, etc

## User and Role

A User record represents an authenticated user who can perform authorized
actions in the system. A User can have multiple roles assigned to it. A Role
describes what actions a User can perform on a DocType.

![User Roles](/docs/assets/img/user-roles.png)
*User Roles*

For example, the role **Blogger** has read, write and create permission on the
doctype **Blog Post**, but only read permission on **Blog Category**.

![Role Blogger](/docs/assets/img/role-blogger.png)
*Role Blogger*

## DocType Permissions

DocTypes can have a default set of Roles applied when you install your app. To
configure roles for a DocType you must add them in the Permissions table in
DocType.

![DocType Permissions](/docs/assets/img/doctype-permissions.png)
*DocType Permissions*

If you expand the row, you will see many more options that can be configured.
![DocType Permissions Row](/docs/assets/img/doctype-permissions-detail.png)
*DocType Permissions*


Here is a list of them with their explanation:

Option	| Explanation
--------|-------
Level	| [Permission Level](#permission-level) assigned to this role
If the user is owner | The restrictions will apply only if the user is the one who created that document
Read	| Allow read access to the document
Write	| Allow edit access to the document
Create	| Allow create access to the document
Delete	| Allow user to delete the document
Submit	| Allow user to submit the document
Cancel	| Allow user to cancel the document
Amend	| Allow user to amend the document
Report	| Allow user to view the report view
Export	| Allow user to export records in Excel/CSV
Import	| Allow user to import records using the Data Import Tool
Set User Permissions | Allow user to apply user permissions for other users
Share	| Allow user to share the document with other users
Print	| Allow user to print the document or generate PDF
Email	| Allow user to send emails for that document

## Permission Level

Permission Levels can be used to group fields in a document and apply separate
roles to each level. By default all fields have permlevel set as 0.

![Permission Level](/docs/assets/img/permission-level.png)
*Permission Level*

## Role Permissions Manager

Role Permissions Manager is a user tool to manage role permissions. The default
set of permissions show up here and can be overridden.

![Role Permissions Manager](/docs/assets/img/role-permissions-manager.gif)

## User Permissions

User Permissions are another set of rules that can be applied per user basis. It
can be used to restrict documents which contain a specific value for a Link
field.

For example, to restrict the User John such that he can only view **Blog Post**s
that were created by him, i.e, Blogger **John**. A user permission record with
the following values should be created.

![User Permissions Example](/docs/assets/img/user-permissions-example-1.png)
*User Permission Record*

After creating the user permission configuration, when the User logs in to see
the Blog Post list, he will have a restricted view of blog posts that were
created by him.

![Restricted Blog Post List](/docs/assets/img/user-permissions-example-2.png)
*Restricted Blog Post List*

## Restricting Views and Forms

Frappe Framework allows you to configure what modules, doctypes and views are
visible to the user. To configure which modules are shown to a user go to the
**Allow Modules** section of the User form.

![Allow Modules in User](/docs/assets/img/allow-modules-in-user.png)

To hide a doctype from a User, remove the read permission from a Role using the
[Role Permissions Manager](#role-permissions-manager).

To control permissions for Pages and Reports, use the **Role Permission for Page
and Report** tool.

![Role Permission for Page and Report](/docs/assets/img/role-permission-for-page-and-report.png)

## Password Hashing

Frappe handles password hashing out of the box. They are encrypted and saved in
a separate database table named `__Auth`.

```mariadb
MariaDB [_baa0f26509a564b6]> select * from __Auth;
+---------+------------------+-----------+-----------------------------------------------
| doctype | name             | fieldname | password
+---------+------------------+-----------+-----------------------------------------------
| User    | Administrator    | password  | $pbkdf2-sha256$29000$Xss5pxSC8F5rDSHEOEdo7Q$in
| User    | test@erpnext.com | password  | $pbkdf2-sha256$29000$y7mXMoZQau09RwiBsLaWsg$h.
+---------+------------------+-----------+-----------------------------------------------
```

## Password Policy

Frappe also supports password strength checking. It can be enabled from **System
Settings** in the Security section. The Minimum Password Score field validates how
strong the password should be.

![Password Policy](/docs/assets/img/password-policy.png)
*Password Policy*

## Login Attempts

Frappe allows you to configure how many consecutive login attempts should be
allowed before locking the account for a set time period.

![Login Attempts](/docs/assets/img/login-attempts.png)

## Third Party Authentication

Frappe supports third party login providers. To setup a login provider you need
to setup a **Social Login Key**. Learn more about it [here](/docs/user/en/guides/integration/social_login_key).
