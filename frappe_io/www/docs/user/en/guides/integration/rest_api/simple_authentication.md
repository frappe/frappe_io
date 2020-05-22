<!-- add-breadcrumbs -->
Base URL: https://{your frappe instance}

Example: https://demo.erpnext.com

# Simple Authentication

## POST /api/method/login

Content-Type: application/x-www-form-urlencoded

Params (in body):

* usr (string)

	Username

* pwd (string)

	Password

Example:

```bash
curl -X POST https://{your frappe instance}/api/method/login \
     -H 'Content-Type: application/json' \
     -H 'Accept: application/json' \
     -d '{"usr":"Administrator","pwd":"admin"}'
```

Returns:

* HTTP Code: 200
* application/json:

```json
	{
		"home_page": "/desk",
		"full_name": "Administrator",
		"message": "Logged in"
	}
```

* Cookie: `sid` (send this to authenticate future requests). [Expires in three days](https://github.com/frappe/frappe/blob/e551153ea0a5fb905f2d9508143a9d25ec74aa43/frappe/auth.py#L320).

```
	sid=05d8d46aaebff1c87a90f570a3ff1c0f570a3ff1c87a90f56bacd4;
	path=/;
	domain=.{your frappe instance};
	Expires=Sat, 29 Sep 2018 00:59:54 GMT;
```

Error:

* HTTP Code: 401
* text/html: Wrong password or username.

## GET /api/method/logout

Example:

```bash
	curl -X GET https://{your frappe instance}/api/method/logout
```

Returns:

* HTTP Code: 200
* application/json: `{}`

## GET /api/method/frappe.auth.get\_logged\_user

Get the ID of the currently authenticated user.

Example:

```bash
	curl -X GET https://{your frappe instance}/api/method/frappe.auth.get_logged_user
```

Returns:

* HTTP Code: 200
* application/json:

```json
	{
	  "message": "Administrator"
	}
```

Author: Raffael Meyer (raffael@alyf.de)

{next}
