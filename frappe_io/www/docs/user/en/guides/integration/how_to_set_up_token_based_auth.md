# Token based authentication

Token-based authentication is a security technique that authenticates the users who attempt to gain access to a server. It is available starting with v11.0.3. The service validates the security token and processes the user request.

## How does it work?

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
  `/api/method/frappe.core.doctype.user.user.generate_keys?user="user_name"`
- Command:
  `bench execute frappe.core.doctype.user.user.generate_keys --args ['user_name']`
- Web:
  `User -> Api Access -> Generate Keys`

Check `Guides / Integrations / Rest Api / Token Based Authentication` to see how to use the token in an API request.

**Note:**

1. Api key cannot be re-generated.
2. Only users with system manager role can generate keys.

{next}
