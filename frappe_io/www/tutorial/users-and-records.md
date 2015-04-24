# Making Users and Records

Now that we have created the models, we can directly start making records using Frappe Desk UI. You do not have to create views! Views in Frappe are automatically made based on the DocType properties.

### 4.1 Creating User

To make records, we will first create a User. To create a user, go to:

> Setup > Users > User > New

Create a new User and set the name and first name and new password.

Also give the Librarian and Library Member Roles to this user

<img class="screenshot" alt="Add User Roles" src="/assets/frappe_io/images/add_user_roles.png">

Now logout and login using the new user id and password.

### 4.2 Creating Records

You will now see an icon for the Library Management module. Click on that icon and you will see the Module page:

![Module](/assets/frappe_io/images/guide/14-module.png)

Here you can see the DocTypes that we have created for the application. List us start creating a few records.

First let us create a new Article:

![New Article](/assets/frappe_io/images/guide/15-new-article.png)

Here you will see that the the DocType you had created has been rendered as a form. The validations and other rules will also apply as designed. Let us fill out one Artilce.

![Add Attachment](/assets/frappe_io/images/guide/16-add-attachment.png)

You can also add an attachment

![Image Field](/assets/frappe_io/images/guide/17-image-field.png)

View it as an image.

Now let us create a new member:

![New Member](/assets/frappe_io/images/guide/18-new-member.png)

After this, let us create a new membership record for the member.

![New Membership](/assets/frappe_io/images/guide/19-new-membership.png)

Here if you remember we had set the values of Member First Name and Member Last Name to be directly fetched from the Member records and as soon as you will select the member id, the names will be updated.

![After Fetch](/assets/frappe_io/images/guide/20-after-fetch.png)

As you can see that the date is formatted as year-month-day which is a system format. To set / change date, time and number formats, go to

> Setup > System Settings

![After Fetch](/assets/frappe_io/images/guide/21-system-settings.png)

{next}
