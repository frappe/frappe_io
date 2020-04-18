<!-- base_template: frappe_io/www/frappe/frappe_base.html --><!-- add-breadcrumbs -->
# Social Login Key

Add social login providers like Facebook, Frappe, Github, Google, Microsoft, etc and enable social login.

#### Setup Social Logins

To add Social Login Key go to

> Integrations > Authentication > Social Login Key

Social Login Key

<img class="screenshot" src="/docs/assets/img/social_login_key.png">

1. Select the Social Login Provider or select "Custom"
2. If required for provider enter "Base URL"
3. To enable check "Enable Social Login" to show Icon on login screen
4. Also add Client ID and Client Secret as per provider.

e.g. Social Login Key

- **Social Login Provider** : `Frappe`
- **Client ID** : `ABCDEFG`
- **Client Secret** : `123456`
- **Enable Social Login** : `Check`
- **Base URL** : `https://erpnext.org` (required for some providers)

#### Generating Client ID and Client Secret for providers

- <a href="https://developers.google.com/identity/sign-in/web/devconsole-project">Creating a Google API Console project and client ID</a>
- <a href="https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow">Manually Build a Login Flow for Facebook</a>
- <a href="https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/">Creating an OAuth App for GitHub</a>
- <a href="https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-protocols-openid-connect-code">Authorize access to web applications using OpenID Connect and Azure Active Directory</a>
- <a href="https://help.salesforce.com/articleView?id=connected_app_create.htm">Create a Connected App on Salesforce</a>

#### Additional fields required for custom providers

**Redirect URL** :

If Social Login Key other than provided by default is added, set its Redirect URL field to `/api/method/frappe.integrations.custom/<provider>`, where `<provider>` is replaced by name of `Social Login Key` doctype instance. Name of doctype is slug of `Provider Name` field.

e.g. If `Redhat Keycloak` is the Provider Name of custom Social Login Key, its redirect uri should be set to `/api/method/frappe.integrations.custom/redhat_keycloak`.

If custom logic at the point of custom social login is needed, custom app can be added and Redirect URL field can be set to whitelisted function in custom app.

For standard OAuth 2.0 Authorization Code Flow > Userinfo Endpoint based Social Login Key there is no need for custom app.

**User ID Property** :

Optionally set the `User ID Property` field used by Custom Provider. Refer https://openid.net/specs/openid-connect-core-1_0.html#UserInfoResponse for more. Defaults to `sub`.
