<!-- base_template: frappe_io/www/frappe/frappe_base.html -->
<!-- add-breadcrumbs -->
# Desk

Frappe Framework comes with a rich admin interface called the Desk. It reads meta-data
from DocTypes and automatically builds list views, form views, report views, etc
for your DocTypes. Desk is to be used by users of the type "System User".

In this section we will discuss what views are provided by Desk and how to configure them.

## Desktop

When you login to the Desk, the first screen you see is called the Desktop. Each card
is organized based on related functionalities and their DocTypes.

![Desktop](/docs/assets/img/frappe-desktop.gif)
*Desktop*

## Awesomebar

Awesomebar helps you to navigate anywhere in the system, create new records, search in documents
and even perform math operations.

![Awesomebar](/docs/assets/img/awesomebar.png)
*Navigating ToDo using Awesomebar*

## List View

List View is generated for all DocTypes except which are Child Tables and Singles.

The List view is packed with features. Some of them are:

1. Filters
1. Sorting
1. Paging
1. Filter by tags
1. Switch view to Report, Calendar, Gantt, Kanban, etc.

![List View](/docs/assets/img/list-view.png)
*List View*

To customize the List View you must have a `{doctype}_list.js` file in the doctype directory.
Here are all the options that can be customized. This examples assumes the Note DocType.

```js
frappe.listview_settings['Note'] = {
	// add fields to fetch
	add_fields: ['title', 'public'],
	// set default filters
	filters: [
		['public', '=', 1]
	],
	hide_name_column: true, // hide the last column which shows the `name`
	onload(listview) {
		// triggers once before the list is loaded
	},
	before_render() {
		// triggers before every render of list records
	},
	get_indicator(doc) {
		// customize indicator color
		if(doc.public) {
			return [__("Public"), "green", "public,=,Yes"];
		} else {
			return [__("Private"), "darkgrey", "public,=,No"];
		}
	},
	primary_action() {
		// triggers when the primary action is clicked
	},
	get_form_link(doc) {
		// override the form route for this doc
	},
	// add a custom button for each row
	button: {
		show(doc) {
			return doc.reference_name;
		},
		get_label() {
			return 'View';
		},
		get_description(doc) {
			return __('View {0}', [`${doc.reference_type} ${doc.reference_name}`])
		},
		action(doc) {
			frappe.set_route('Form', doc.reference_type, doc.reference_name);
		}
	},
	// format how a field value is shown
	formatters: {
		title(val) {
			return val.bold();
		},
		public(val) {
			return val ? 'Yes' : 'No';
		}
	}
}
```

## Form View

Form view is used to view the records in a Form Layout. This view has a lot of things going on.
But the primary purpose of it is to view and edit records. A document can be
assigned to or shared with other users and it can have arbitrary attachments and tags, all of which
can be seen in the form sidebar.

![Form View](/docs/assets/img/form-view.png)
*Form View*

When you scroll down to the bottom of the form, you will see the form timeline.
The form timeline shows emails, comments, edits and other events in a reverse
chronological order.

![Form View](/docs/assets/img/form-timeline.png)
*Form Timeline*

## Report View

## Tree View

## Calendar View

## Gantt View

## Kanban View

## Query Reports
