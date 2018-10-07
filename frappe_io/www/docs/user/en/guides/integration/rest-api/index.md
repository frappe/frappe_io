<!-- add-breadcrumbs -->

# Introduction

Frappe ships with an HTTP API. There are that could be classified into *Remote Procedure Calls* (RPC, call whitelisted methods) and REST (manipulate resources).

The base URL is `https://{your frappe instance}/api`. A request to an endpoint `/method/dotted.path.to.function` will call a whitelisted python function. 

GET **/method/sample_app.ping**

Response:

```json
{
  "message": "pong"
}
```

All documents in Frappe are available via a RESTful API with prefix `/resource/`. You can perform all CRUD operations on them:

* Create

	You can create a document by sending a `POST` request to the url, `/resource/{doctype}`.

* Read

	You can get a document by its name using the url, `/resource/{doctype}/{name}`

* Update

	You can create a document by sending a `PUT` request to the url, `/resource/{doctype}/{name}`. This acts like a `PATCH` HTTP request in which you do not have to send the whole document but only the parts you want to change.

* Delete

	You can delete a document by its name by sending a `DELETE` request to the url, `/resource/{doctype}/{name}`.

# Table of Contents

{{index}}

Authors: Rushabh Mehta (rushabh@erpnext.com), Raffael Meyer (raffael@alyf.de)
