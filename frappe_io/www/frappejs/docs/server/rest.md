# REST API

You can directly access documents at `/api/resource/:doctype`.

### Create:

- URL: `/api/resource/:doctype`.
- Method: `POST`.
- Data: document properties.

	##### Example:

	- URL: `/api/resource/ToDo.`
	- Method: `POST`.

	##### Data:

	```json
	{
		"subject": "test",
		"description": "test description"
	}
	```

### Read:

- URL: `/api/resource/:doctype/:name`.
- Method: `GET`.

	##### Example:

	- URL: `/api/resource/ToDo/uig7d1v12`.

	##### Response:

	```json
	{
		"name": "uig7d1v12",
		"owner": "guest",
		"modified_by": "guest",
		"creation": "2018-01-01T12:08:19.482Z",
		"modified": "2018-01-01T12:08:19.482Z",
		"docstatus": 0,
		"subject": "test 1",
		"description": "description 1",
		"status": "Open"
	}
	```

### List:

- URL: `/api/resource/:doctype/`.
- Method: `GET`.
- Params (optional):
	 - `start`: Page start.
	 - `limit`: Page limit.

	##### Example:

	- URL: `/api/resource/ToDo`.

	##### Response:

	```json
	[
		{
			"name": "r4qxyki0i6",
			"subject": "test 1"
		},
		{
			"name": "efywwvtwcp",
			"subject": "test 1"
		},
		{
			"name": "9ioz05urgp",
			"subject": "test 1"
		}
	]
	```
