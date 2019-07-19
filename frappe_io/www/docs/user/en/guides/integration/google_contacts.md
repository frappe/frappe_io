<!-- base_template: frappe_io/www/frappe/frappe_base.html --><!-- add-breadcrumbs -->
# Google Contacts Integration

Frappe provides an integration with Google Contacts so that all users can synchronize their Contacts with Frappe Framework.


## Setup

In order to allow a synchronization with Google Contacts you need to authorize Frappe to get Contacts data from Google. Google Contacts Integration is set up in the following steps:

1. Create a new project on Google Cloud Platform and generate new OAuth 2.0 credentials.
<img class="screenshot" src="/docs/assets/img/google_contacts_project_reation.gif">
2. Add `https://{yoursite}` to Authorized JavaScript origins.
3. Add `https://{yoursite}?cmd=frappe.integrations.doctype.google_contacts.google_contacts.google_callback` as an authorized redirect URI.
<img class="screenshot" src="/docs/assets/img/google_contacts_project_oauth.gif">
4. Add your Client ID and Client Secret in the Google Settings in `Modules > Integrations > Google Settings`
5. Create a new Google Contacts Integration, enter the Google Account Email you want to sync and then save it. Now click on `Authorize Contacts Access` to authorize Frappe to get Contacts data from Google.
6. Once Authorized, you can manually sync Google Contacts or let Frappe sync Google Contacts daily.
