# Token Based Authentication

> Available starting with v11.0.3

The HTTP Authorization request header contains the credentials to authenticate a user with a server. It consits of the authorization type (`token` or `Basic`) and the corresponding token.

```http
Authorization: <type> <token>
```

The token consists of `api-key` and `api-secret`, joined by a colon. Check `Guides / Integration / How To Set Up Token Based Auth` to see how to generate `api-key` and `api-secret`. 

There are two types of authorization: `token` and `Basic`:
  
## Token

HTTP header:

```http
Authorization: token <api_key>:<api_secret>
```

Example in python:

```python
import requests

url = "http://frappe.local:8000**/api/method/frappe.auth.get_logged_user**"
headers = {
    'Authorization': "token <api_key>:<api_secret>"
}
response = requests.request("GET", url, headers=headers)
```

## Basic

If the "Basic" authentication scheme is used, the credentials are a combination of api_key and api_secret and are constructed like this:

1. The username and the password are combined with a colon (api_key:api_secret).
  ```<api_key>:<api_secret>```
2. The resulting string is base64 encoded.
  ```base64encode(<api_key>:<api_secret>)```
  
HTTP header:

```http
Authorization: Basic base64encode(<api_key>:<api_secret>)
```

Example in python:

```python
import requests
import base64

url = "http://frappe.local:8000**/api/method/frappe.auth.get_logged_user**"
headers = {
    'Authorization': "Basic %s" % base64.b64encode(<api_key>:<api_secret>)
}
response = requests.request("GET", url, headers=headers)
```

## Further ressources

* [Authorization Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)

{next}