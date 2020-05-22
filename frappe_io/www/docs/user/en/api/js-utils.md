---
add_breadcrumbs: 1
title: Common Utilities - API
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  API methods for creating and managing controls in Frappe
---


# Common Utilities API

## frappe.get_route
`frappe.get_route()`

Returns the current route as an array.
```js
frappe.get_route()
// ["List", "Task", "List"]
```

## frappe.set_route
`frappe.set_route(route)`

Changes the current route to `route`.
```js
// route in parts
frappe.set_route('List', 'Task', 'List')

// route as array
frappe.set_route(['List', 'Task', 'Gantt'])

// route as string
frappe.set_route('List/Event/Calendar')

// route with options
frappe.set_route(['List', 'Task', 'Task'], { status: 'Open' })
```

## frappe.format
`frappe.format(value, df, options, doc)`

Format a raw value into user presentable format.

```js
frappe.format('2019-09-08', { fieldtype: 'Date' })
// "09-08-2019"

frappe.format('2399', { fieldtype: 'Currency', options: 'currency' }, { inline: true })
// "2,399.00"
```

## frappe.provide
`frappe.provide(namespace)`

Creates a namespace attached to the window object if it doesn't exist.

```js
frappe.provide('frappe.ui.form');

// has the same effect as
window.frappe = {}
window.frappe.ui = {}
window.frappe.ui.form = {}
```

## frappe.require
`frappe.require(asset_path, callback)`

Load a JS or CSS asset asynchronously. It is used for libraries that are not
used often.

```js
// load a single asset
frappe.require('/assets/frappe/chat.js', () => {
	// chat.js is loaded
})

// load multiple assets
frappe.require(['/assets/frappe/chat.js', '/assets/frappe/chat.css'], () => {
	// chat.js and chat.css are loaded
})
```
