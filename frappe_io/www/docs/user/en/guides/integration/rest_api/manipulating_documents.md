<!-- base_template: frappe_io/www/frappe/frappe_base.html -->Base URL: https://{your frappe instance}

Example: https://demo.erpnext.com

# Manipulating DocTypes

A DocTypes is a specific type of document, for example: Customer, Employee or Item.

A DocumentName is the unique ID of a Document, for example: CUST-00001, EMP-00001 or ITEM-00001.

Authentication is missing in the following examples. See [Basic Authentication] and [OAuth2] for more.

## GET /api/resource/{DocType}

Get a list of documents of this DocType.

Params (in path):

* DocType (string)

	The DocType you'd like to receive. For example, 'Customer'.

Params (in query):

* fields []

	By default, only the 'name' field will be returned. To add more fields, you can pass the *fields* parameter. For example, fields=["name","country"]

* filters [[(string)]]

	You can filter the listing using SQL conditions by passing them in the *filters* parameter. Each condition is an array of the format, [{doctype}, {field}, {operator}, {value}]. For example, filters=[["Customer", "country", "=", "India"]]

* limit_page_length (int)

	All listings will be paginated. With this parameter you can change the page size (how many items are teturned at once). Default: 20.

* limit_start (int)

	To request successive pages, pass a multiple of your limit_page_length as limit_start. For example, to request the second page, pass limit_start as 20.

Example:

*Get at most 20 Names (IDs) of all Customers whose phone number is 4915227058038.*

```bash
curl -X GET https://{your frappe instance}/api/resource/Customer?fields=["name"]\
            &filters=[["Customer","phone","=","4915227058038"]]
```

Returns:

```json
	{
	  "data": [
	    {
	      "name": "CUST-00001"
	    },
	  ]
	}
```

## POST /api/resource/{DocType}

Create a new document of this DocType.

Params (in path):

* DocType (string)

	The DocType you'd like to create. For example, 'Customer'.

Content-Type: application/json

Request Body: `{"fieldname": value}`

Example:

*Create a new Lead named Mustermann.*

```bash
curl -X POST https://{your frappe instance}/api/resource/Lead \
     -H 'Content-Type: application/json' \
     -H 'Accept: application/json' \
     -d '{"lead_name":"Mustermann"}'
```

## GET /api/resource/{DocType}/{DocumentName}

Retrieve a specific document by name (ID).

Params (in path):

* DocType (string)

	The type of the document you'd like to get. For example, 'Customer'.

* DocumentName (string)

	The name (ID) of the document you'd like to get. For example, 'EMP-00001'.

Example:

*Get the Customer with Name (ID) CUST-00001.* 

```bash
curl -X GET https://{your frappe instance}/api/resource/Customer/CUST-00001
```

## PUT /api/resource/{DocType}/{DocumentName}

Update a specific document. This acts like a `PATCH` HTTP request in which you do not have to send the whole document but only the parts you want to change.

Params (in path):

* DocType (string)

	The type of the document you'd like to update. For example, 'Customer'.

* DocumentName (string)

	The name (ID) of the document you'd like to update. For example, 'EMP-00001'.

Content-Type: application/json

Request Body: `{"fieldname": value}`

Example:

*Update Next Contact Date.*

```bash
curl -X PUT https://{your frappe instance}/api/resource/Lead/LEAD-00001 \
     -H 'Accept: application/json' \
     -H 'Content-Type: application/json' \
     -d '{"contact_date":"2018-10-08"}'
```

Returns:

```json
{
    "data": {
        "doctype": "Lead",
        "name": "LEAD-00001",
        "contact_date": "2018-10-08",
        "...": "..."
    }
}
```

## DELETE /api/resource/{DocType}/{DocumentName}

Params (in path):

* DocType (string)

	The type of the document you'd like to delete. For example, 'Customer'.

* DocumentName (string)

	The name (ID) of the document you'd like to delete. For example, 'EMP-00001'.

# Further Reading

HTTP Headers:

* [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
* [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept)
* [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)

Author: Raffael Meyer (raffael@alyf.de)

{next}