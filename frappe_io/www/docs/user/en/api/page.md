---
base_template: frappe_io/www/frappe/frappe_base.html
add_breadcrumbs: 1
title: Page - API
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  API methods for creating and managing pages in Frappe
---

# Page API

Every screen inside the Desk is rendered inside a `frappe.ui.Page` object.

## frappe.ui.make\_app\_page

Creates a new Page and attaches it to parent.

```js
let page = frappe.ui.make_app_page({
	title: 'My Page',
	parent: wrapper // HTML DOM Element or jQuery object
	single_column: true // create a page without sidebar
})
```

![New Page](/docs/assets/img/new-page.png)
*New Page*

## Page methods
This section lists out the common methods available on the page instance object.

## page.set_title

Set the page title along with the document title. The document title is shown in
browser tab.

```js
page.set_title('My Page')
```

![Page Title](/docs/assets/img/page-set-title.png)
*Page Title*

## page.set\_title\_sub

Set the secondary title of the page. It is shown on the right side of the page
header.

```js
page.set_title_sub('Subtitle')
```

![Page Subtitle](/docs/assets/img/page-set-title-sub.png)
*Page Subtitle*

## page.set_indicator

Set the indicator label and color.

```js
page.set_indicator('Pending', 'orange')
```

![Page Indicator](/docs/assets/img/page-set-indicator.png)
*Page Indicator*

## page.clear_indicator

Clear the indicator label and color.

```js
page.clear_indicator()
```

## page.set\_primary_action

Set the primary action button label and handler. The third argument is the icon
class which will be shown in mobile view.

```js
let $btn = page.set_primary_action('New', () => create_new(), 'octicon octicon-plus')
```

![Page Primary Action](/docs/assets/img/page-primary-action.png)
*Page Primary Action*

## page.clear\_primary_action

Clear primary action button and handler.

```js
page.clear_primary_action()
```

## page.set\_secondary_action

Set the secondary action button label and handler. The third argument is the
icon class which will be shown in mobile view.

```js
let $btn = page.set_secondary_action('Refresh', () => refresh(), 'octicon octicon-sync')
```

![Page Secondary Action](/docs/assets/img/page-secondary-action.png)
*Page Secondary Action*

## page.clear\_secondary_action

Clear secondary action button and handler.

```js
page.clear_secondary_action()
```

## page.add\_menu_item

Add menu items in the Menu dropdown.

```js
// add a normal menu item
page.add_menu_item('Send Email', () => open_email_dialog())

// add a standard menu item
page.add_menu_item('Send Email', () => open_email_dialog(), true)
```

![Page Menu Dropdown](/docs/assets/img/page-menu-dropdown.png)
*Page Menu Dropdown*

## page.clear_menu

Remove Menu dropdown with items.

```js
page.clear_menu()
```

## page.add\_action_item

Add menu items in the Actions dropdown.

```js
// add a normal menu item
page.add_menu_item('Delete', () => delete_items())
```

![Page Actions Dropdown](/docs/assets/img/page-actions-dropdown.png)
*Page Actions Dropdown*

## page.clear\_actions_menu

Remove Actions dropdown with items.

```js
page.clear_actions_menu()
```

## page.add\_inner_button

Add buttons in the inner toolbar.

```js
// add a normal inner button
page.add_inner_button('Update Posts', () => update_posts())
```

![Page Inner Button](/docs/assets/img/page-inner-button.png)
*Page Inner Button*

```js
// add a dropdown button in a group
page.add_inner_button('New Post', () => new_post(), 'Make')
```

![Page Inner Button Group](/docs/assets/img/page-inner-button-group.png)
*Page Inner Button Group*

## page.remove\_inner_button

Remove buttons in the inner toolbar.

```js
// remove inner button
page.remove_inner_button('Update Posts')

// remove dropdown button in a group
page.remove_inner_button('New Posts', 'Make')
```

## page.clear\_inner_toolbar

Remove the inner toolbar.

```js
page.remove_inner_toolbar()
```

## page.add_field

Add a form control in the page form toolbar.

```js
let field = page.add_field({
	label: 'Status',
	fieldtype: 'Select',
	fieldname: 'status',
	options: [
		'Open',
		'Closed',
		'Cancelled'
	],
	change() {
		console.log(field.get_value());
	}
});
```

![Page Form Toolbar](/docs/assets/img/page-add-field.png)
*Page Form Toolbar*

## page.get\_form_values

Get all form values from the page form toolbar in an object.

```js
let values = page.get_form_values()
// { status: 'Open', priority: 'Low' }
```

## page.clear_fields

Clear all fields from the page form toolbar.

```js
page.clear_fields()
```

