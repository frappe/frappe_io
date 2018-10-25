<!-- add-breadcrumbs -->

Base URL: https://{your frappe instance}

Example: https://demo.erpnext.com

# OAuth2

Use the header `Authorizaton: Bearer <access_token>` to perform authenticated requests. You can receive a [bearer token](https://tools.ietf.org/html/rfc6750) by combining the following two requests.

## POST /api/method/frappe.integrations.oauth2.authorize

Get an authorization code from the user to access ERPNext on his behalf. 

Params (in body):

* client_id (string)

	ID of your OAuth2 application

* state (string)

	Arbitrary value used by your client application to maintain state between the request and callback. The authorization server includes this value when redirecting the user-agent back to the client. The parameter should be used for preventing [cross-site request forgery](https://tools.ietf.org/html/rfc6749#section-10.12).

* response_type (string)

	"code"

* scope (string)
	
	The scope of access that should be granted to your application.

* redirect_uri (string)

	Callback URI that the user will be redirected to, after the application is authorized. The authorization code can then be extracted from the params.

Content-Type: application/x-www-form-urlencoded

Example:

```bash
curl -X POST https://{your frappe instance}/api/method/frappe.integrations.oauth2.authorize \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -H 'Accept: application/json' \
     -d 'client_id=511cb2ac2d&state=444&response_type=code&scope=all
  	     &redirect_uri=https%3A%2F%2Fapp.getpostman.com%2Foauth2%2Fcallback'
```

For **testing purposes** you can also pass the parameters in the URL, like this (and open it in the browser):

`https://{your frappe instance}/api/method/frappe.integrations.oauth2.authorize?client_id=511cb2ac2d&state=444&response_type=code&scope=all&redirect_uri=https%3A%2F%2Fapp.getpostman.com%2Foauth2%2Fcallback`


Returns:

* HTTP Code: 200
* text/html
	
	This will open the authorize page which then redirects you to the `redirect_uri`.

If the user clicks 'Allow', the redirect URI will be called with an authorization code in the query parameters:

`https://{redirect uri}?code=plkj2mqDLwaLJAgDBAkyR1W8Co08Ud`

If user clicks 'Deny' you will receive an error:

`https://{redirect uri}?error=access_denied`


## POST /api/method/frappe.integrations.oauth2.get_token

Trade the authorization code (obtained above) for an access token.

Params (in body):

* grant_type (string)

	"authorization_code"

* code (string)

	Authorization code received in redirect URI.

* client_id (string)

	ID of your OAuth2 application

* redirect_uri (string)

Content-Type: application/x-www-form-urlencoded

Example:

```bash
curl -X POST https://{your frappe instance}/api/method/frappe.integrations.oauth2.get_token \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -H 'Accept: application/json' \
     -d 'grant_type=authorization_code&code=wa1YuQMff2ZXEAu2ZBHLpJRQXcGZdr
         &redirect_uri=https%3A%2F%2Fapp.getpostman.com%2Foauth2%2Fcallback&client_id=af615c2d3a'
```
For **testing purposes** you can also pass the parameters in the URL like this (and open it in the browser):

`https://{your frappe instance}/api/method/frappe.integrations.oauth2.get_token?grant_type=authorization_code&code=A1KBRoYAN1uxrLAcdGLmvPKsRQLvzj&client_id=511cb2ac2d&redirect_uri=https%3A%2F%2Fapp.getpostman.com%2Foauth2%2Fcallback`

Returns:
	
```json
	{
	    "access_token": "pNO2DpTMHTcFHYUXwzs74k6idQBmnI",
	    "token_type": "Bearer",
	    "expires_in": 3600,
	    "refresh_token": "cp74cxbbDgaxFuUZ8Usc7egYlhKbH1",
	    "scope": "all"
	}
```


## POST /api/method/frappe.integrations.oauth2.revoke_token

Revoke token endpoint.

Params:

* token

	Access token to be revoked.

Returns:
	
```json
	{
		"message": "success"
	}
```

## Further Reading

Please check `Guides / Integration / How To Set Up Oauth` to see how to create a new oAuth2 client.

* [Content-Type Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type),
* [Authorization Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization),
* [oAuth2 Specification](https://tools.ietf.org/html/rfc6749),
* [Bearer token](https://tools.ietf.org/html/rfc6750).

Author: Raffael Meyer (raffael@alyf.de)

{next}