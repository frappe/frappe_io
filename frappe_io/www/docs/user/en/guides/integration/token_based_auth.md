# Token Based Authentication
Token-based authentication is a security technique that authenticates the users who attempt to gain access to a server. The service validates the security token and processes the user request.

## How Does Token Authentication Work?
Authentication is the process by which an application confirms user identity. Applications have traditionally persisted identity through session cookies, relying on session IDs stored server-side. This forces developers to create session storage that is either unique to each server, or implemented as a totally separate session storage layer.

Token authentication is a more modern approach and it is designed to solve problems that session IDs storage mechanism on server-side can’t. Using tokens in place of session IDs can lower your server load.

## Token CRUD
As a developer, you can use tokens for full CRUD operations.
Once an Token is generated, the token can be used to authorize individual requests made by your users as they are passed to your application. Your application will validate the token sent along with each request. 

An combination of API Key and API Secret forms a token which is then used to authenticate you with your application and can be used to authenticate both RPC and REST API.

# Generate a Token
For every user you can generate an api-key and api-secret which together form a token.

- api-key: identifies the user.
- api-secret: validates the request.

Api-key and api-secret can be generated from the web interface, from the command line or by remote procedure call (RPC):

- RPC: 
  `/api/method/frappe.core.doctype.user.user?user="user_name"`
- Command: 
  `bench execute frappe.core.doctype.user.user --args ['user_name']`
- Web: 
  `User -> Api Access -> Generate Keys`
  
###### Note: 
1. Api key cannot be re-generated.
2. Only users with system manager role can generate keys.

# Authentication
The HTTP Authorization request header contains the credentials to authenticate a user with a server. It consits of the authorization type (`token` or `Basic`) and the corresponding token.

```http
Authorization: <type> <token>
```

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

### Further ressources
* [Authorization Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)
