<!-- base_template: frappe_io/www/frappe/frappe_base.html --><!-- add-breadcrumbs -->
# Google Contacts Integration

Frappe provides an integration with Google Contacts in order for all users to synchronize their contacts.


## Setup

In order to allow a synchronization with Google Contacts you need to connect to your application in Google Cloud Platform and then create an account for each of your users:

1. Create a new project on Google Cloud Platform and generate new OAuth 2.0 credentials
<img class="screenshot" src="/docs/assets/img/google_contacts_project_reation.gif">
2. Add `https://{yoursite}` to Authorized JavaScript origins
3. Add `https://{yoursite}?cmd=frappe.integrations.doctype.google_contacts.google_contacts.google_callback` as an authorized redirect URI
<img class="screenshot" src="/docs/assets/img/google_contacts_project_oauth.gif">
4. Add your Client ID and Client Secret in the Google Contacts Integration: in "Modules>Integrations>Google Contacts"
<img class="screenshot" src="/docs/assets/img/google_contacts_sync.gif">

Once this step is successfully completed, allow Contacts access by clicking 'Allow Contacts Access'.
You will be requested to authorize your Google application to access their Contacts information..


## Features

1. Creation of a Contacts in Frappe from Google Contacts
	- All the Contacts present in Google Contacts will be synchronised in Frappe Framework.
	- If any of the Google Contact have multiple Email Ids associated with them, new Contact will be created in Frappe for each Email Id.


The synchronization module follows ERPNext's authorization rule: An event will be only synchronized if it is public or if the user is the owner.
