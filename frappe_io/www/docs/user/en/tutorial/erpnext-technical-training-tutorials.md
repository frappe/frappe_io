<!-- add-breadcrumbs -->
# ERPNext Technical Training tutorials

1. Environment setup for ERPNext.

To manually install frappe/erpnext here are the steps:

#### 1. Install Pre-requisites:

Python 2.7
MariaDB 10+
Nginx (for production)
Nodejs (Latest Version)
Redis
cron (crontab is required)
wkhtmltopdf with patched Qt (for pdf generation)

sudo apt-get update && sudo apt-get install mariadb-server nginx redis-server python-dev libmysqlclient-dev

#### 2. Installing the Bench Repo

git clone https://github.com/frappe/bench bench-repo
sudo pip install -e bench-repo

### 3. Installing the Frappe Bench

bench init frappe-bench --frappe-branch text (master, development and production)
cd frappe-bench

#### 4. Create new site

bench new-site demo.dev

#### 5. Add ERPNext apps using get-app command

bench get-app erpnext https://github.com/frappe/erpnext --branch master

#### 6. Install ERPNext apps

bench --site demo.dev install-app erpnext

#### 7. Set developer mode

bench --site demo.dev set-config developer_mode 1

#### 8. Set site (If using multiple site)

bench use demo.dev


#### 9. Bench start

Now, execute the bench start command and go to localhost:8000 you can see below screen

http://localhost:8000

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/main_desk.png">

---

Example:

2. Make a school management application:

To create our application (frappe-bench folder) execute the command 
bench new-app {app_name} and follow instructions. 

The command creates a school management application for you:

bench new-app school_management

App Title (default: School Management): School Management

App Description: These modules are designed to provide specific functional in the context of school management.

App Publisher: frappe.io

App Email: hello@frappe.io

App Icon (default 'octicon octicon-file-directory'): octicon octicon-file-directory

App Color (default 'grey'): grey

App License (default 'MIT'): MIT

'school_management' created at /home/workspace/ERPNext/frappe-bench/apps/school_management
INFO:bench.app:installing school_management
INFO:bench.utils:./env/bin/pip install -q  -e ./apps/school_management --no-cache-dir

---

3. After that install school management app using below command.

bench --site demo.dev install-app school_management
./env/bin/pip install -q  -e ./apps/school_management

bench migrate
bench clear-cache
bench build
bench start

We can see our school management application in below snapshot.

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/app_icon.png">

---

4. We are going to build a simple School Management application. In that application will contents below models:

#### 1. Student Management
#### 2. Fee Management
#### 3. Faculty Management
#### 4. Subject Management

Go to Developer menu > Navigate the documents link > Doctype
Click on “New” button and Create a Student Management doctype 

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/stud_doctype.png">


Go to Developer menu > Navigate the documents link > Doctype
Click on “New” button and Create a Fee Management doctype

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/fee_doctype.png">

Go to Developer menu > Navigate the documents link > Doctype
Click on “New” button and Create a Faculty Management doctype 

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/faculty_doctype.png">

Go to Developer menu > Navigate the documents link > Doctype
Click on “New” button and Create a Subject Management doctype 

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/subject_doctype.png">

---
5. User can access docType or we can say our application from there main menu see the below screen shot.

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/doctype_list.png">


User can access student management form while click on Student Management menu.

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/stud_form.png">

---

6. Doctype Linking

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/doctype_linking.png">

---

7. Doctype Naming

DocTypes named defined in four ways:
1. Series 
2. Field
3. By controller (code)
4. Prompt

1. Series: : Series by prefix (Seprate by dot) 
For example: STUD.####


User can set Naming Series in Auto Name field:

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/naming_series.png">

2. Field:  By Field

Syntax: field:<<field name>>
For example: field:name1

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/naming_field.png">

---

8. Set Mandatory field

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/mandatory_field.png">

---

9. Set list view option

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/listview_img.png">

Field detail is shown in list view. See the below screen shot.

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/listview_display.png">


---


10. App Directory Structure

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/app_directory.png">


---

11. Creating Users
We can create user from the menu setup > User > Click on new button

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/user.png">

---

12. Creating Roles
Go to setup > Role > Click on new button 

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/role.png">

---

13. Setting Roles : Go to setup > User 
We can allocate role for particular user by check the role. See the below screen shot.

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/setting_role.png">

---

14. Permissions

We can apply permissions for specific role using “Role Permissions Manager”.
Goto setup > Role Permissions Manager

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/permission.png">

---

15. Show or Hide Desktop Icon

User can show or hide module icon by check/uncheck option.
Go to > Setup > Show/Hide Modules

<img class="screenshot" alt="Training Tutorials" src="/docs/assets/img/show_hide_menu.png">

---

