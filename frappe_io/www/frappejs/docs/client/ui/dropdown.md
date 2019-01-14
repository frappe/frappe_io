<!-- base_template: frappe_io/www/frappejs/frappejs_base.html -->
# Dropdown

Creates a Dropdown button with JS events.

### API:

Methods:

- `add_item`.
- `float_right`.
- `expand`.
- `collapse`.
- `toggle`.

### Usage:

- <h4>Create:</h4>

	```js
	const Dropdown = require('frappejs/frappe/client/ui/dropdown');

	let dropdown = new Dropdown({label:'Actions', parent:this.toolbar});
	```

- <h4>Add Item:</h4>

	Add a new link to the dropdown.

	```js
	dropdown.add_item('Delete', async () => {
		this.show_alert('Deleted', 'success');
	});
	```

- <h4>Float Right</h4>

	Move the element to the right

	```js
	dropdown.float_right();
	```
