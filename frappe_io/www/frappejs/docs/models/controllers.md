
# Controllers

In Frappe.js you can extend the document class for a particular DocType which we call controllers.

You can write event handlers in controllers, by declaring a `.js` file in the `models/doctype/` folder along with the model file.

You must also bind the controller to the model file by the `documentClass` property.

## Document Controller:

You can bind events to the controller that will be called when an action is completed on a document or its property.

The document controller represents a single record and is subclassed from the `frappe.document.Document` class.

```js
const frappe = require('frappejs');

// extend the document and add event handlers
class ToDo extends frappe.document.Document {
	validate() {
		if (!this.status) {
			this.status = 'Open';
		}
	}
}
```

## Controller Events:

Standard events on which you can bind handlers are:

- `beforeInsert`
- `beforeUpdate`
- `validate` (called before any write)
- `afterInsert`
- `afterUpdate` (called after any write)
- `beforeSubmit`
- `afterSubmit`
- `beforeCancel`
- `afterCancel`
- `beforeDelete`
- `afterDelete`
