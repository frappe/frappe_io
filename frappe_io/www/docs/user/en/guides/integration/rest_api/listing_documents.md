<!-- add-breadcrumbs -->

Base URL: https://{your frappe instance}**/api**

Example: https://demo.erpnext.com/api

# Listing documents

To list documents, make a GET request to `/resource/{doctype}`.

GET **/resource/Person**

> All listings are returned paginated by 20 items. To change the page size, you can pass the query parameter `limit_page_length`. To request succesive pages, pass `limit_start`.

The response is returned as JSON Object and the listing is an array in with the key `data`. 

Response:

```json
{
   "data": [
	  {
		 "name": "000000012"
	  },
	  {
		 "name": "000000008"
	  }
   ]
}
```

By default, only the `name` field is included in the listing. To add more fields, you can pass the `fields` parameter with your GET request. `fields` has to be a JSON array containing the fieldnames.

GET **/resource/Person/?fields=["name","first_name"]**

Response:

```json
{
   "data": [
	  {
		 "first_name": "Jane",
		 "name": "000000012"
	  },
	  {
		 "first_name": "John",
		 "name": "000000008"
	  }
   ]
}
```

You can filter the listing using SQL-conditions by passing the query parameter `filters`. `filters` has to be a JSON array containing one or multiple filters. Each condition is an array of the format, [{doctype}, {field}, {operator}, {operand}].

For example, get the name (id) of all persons with firstname "Jane":

GET **/resource/Person?filters=[["Person","first_name","=","Jane"]]**

Response:

```json
 { "data": [ { "name": "000000012" } ] }
```

Authors: Rushabh Mehta (rushabh@erpnext.com), Raffael Meyer (raffael@alyf.de)

{{next}}