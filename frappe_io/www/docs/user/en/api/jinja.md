---
add_breadcrumbs: 1
title: Jinja - API
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  API methods available in Jinja templates
---

# Jinja API

These are the whitelisted methods that frappe provides to use them in Jinja
Templates.

## frappe.format
`frappe.format(value, df, doc)`

Formats a raw value (stored in database) to a user presentable format.
For example, convert 2019-09-08 to 08-09-2019

Usage
{% raw %}
```html
<div>{{ frappe.format('2019-09-08', {'fieldtype': 'Date'}) }}</div>

<!-- output -->
<div>09-08-2019</div>
```
{% endraw %}

## frappe.format_date
`frappe.format_date(date_string)`

Formats date into a human readable long format.

Usage
{% raw %}
```html
<div>{{ frappe.format_date('2019-09-08') }}</div>

<!-- output -->
<div>September 8, 2019</div>
```
{% endraw %}

## frappe.get_url
`frappe.get_url()`

Returns the site url

Usage
{% raw %}
```html
<div>{{ frappe.get_url() }}</div>

<!-- output -->
<div>https://frappe.io</div>
```
{% endraw %}

## frappe.get_doc
`frappe.get_doc(doctype, name)`

Returns a document by its name.

Usage
{% raw %}
```html
<div>
	{% set doc = frappe.get_doc('Task', 'TASK00002') %}
	{{ doc.title }} - {{ doc.status }}
</div>

<!-- output -->
<div>
	Buy Eggs - Open
</div>
```
{% endraw %}

## frappe.get_all
`frappe.get_all(doctype, filters, fields, order_by, start, page_length)`

Returns a list of all records of a DocType.

Signature
```python
frappe.get_all(doctype, filters, fields, order_by, start, page_length)
```

Usage
{% raw %}
```html
<div>
	{% set tasks = frappe.get_all('Task', filters={'status': 'Open'}, fields=['title', 'due_date'], order_by='due_date asc') %}
	{% for task in tasks %}
	<div>
		<h3>{{ task.title }}</h3>
		<p>Due Date: {{ frappe.format_date(task.due_date) }}</p>
	</div>
	{% endfor %}
</div>

<!-- output -->
<div>
	<div>
		<h3>Redesign Website</h3>
		<p>Due Date: September 8, 2019</p>
	</div>
	<div>
		<h3>Add meta tags on websites</h3>
		<p>Due Date: September 22, 2019</p>
	</div>
</div>
```
{% endraw %}

## frappe.get_list
`frappe.get_list(doctype, filters, fields, order_by, start, page_length)`

Similar to `frappe.get_all` but will filter records for the current session user
based on permissions.

## frappe.db.get_value
`frappe.db.get_value(doctype, name, fieldname)`

Returns a single field value (or a list of values) from a document.

Usage
{% raw %}
```html
<div>
	<span>
		{% set company_abbreviation = frappe.db.get_value('Company', 'TennisMart', 'abbr') %}
		{{ company_abbreviation }}
	</span>
	<div>
		{% set title, description = frappe.db.get_value('Task', 'TASK00002', ['title', 'description']) %}
		<h3>{{ title }}</h3>
		<p>{{ description }}</p>
	</div>
</div>

<!-- output -->
<div>
	<span>TM</span>
</div>
```
{% endraw %}

## frappe.db.get\_single\_value
`frappe.db.get_single_value(doctype, fieldname)`

Returns a field value from a Single DocType.

Usage
{% raw %}
```html
<div>
	<span>
		{% set timezone = frappe.db.get_single_value('System Settings', 'time_zone') %}
		{{ timezone }}
	</span>
</div>

<!-- output -->
<div>
	<span>
		Asia/Kolkata
	</span>
</div>
```
{% endraw %}

## frappe.get\_system\_settings
`frappe.get_system_settings(fieldname)`

Returns a field value from System Settings.

Usage
{% raw %}
```html
<div>
	{% if frappe.get_system_settings('country') == 'India' %}
	<button>Pay via Razorpay</button>
	{% else %}
	<button>Pay via PayPal</button>
	{% endif %}
</div>

<!-- output -->
<div>
	<button>Pay via Razorpay</button>
</div>
```
{% endraw %}

## frappe.get_meta
`frappe.get_meta(doctype)`

Returns a doctype meta. It contains information like fields, title\_field,
image_field, etc.

Usage
{% raw %}
```html
<div>
	<span>
		{% set meta = frappe.get_meta('Task') %}
		Task has {{ meta.fields | len }} fields.
		{% if meta.get_field('status') %}
		It also has a Status field.
		{% endif %}
	</span>
</div>

<!-- output -->
<div>
	<span>
		Task has 18 fields. It also has a Status field.
	</span>
</div>
```
{% endraw %}

## frappe.get_fullname
`frappe.get_fullname(user_email)`

Returns the fullname of the user email passed. If user is not passed, assumes
current logged in user.

Usage
{% raw %}
```html
<div>
	<span>The fullname of faris@erpnext.com is {{ frappe.get_fullname('faris@erpnext.com') }}</span>
	<span>The current logged in user is {{ frappe.get_fullname() }}</span>
</div>

<!-- output -->
<div>
	<span>The fullname of faris@erpnext.com is Faris Ansari</span>
	<span>The current logged in user is John Doe</span>
</div>
```
{% endraw %}

## frappe.render_template
`frappe.render_template(template_name, context)`

Render a jinja template string or file with context.

Usage
{% raw %}
```html
<div>
	<!-- render a jinja template file -->
	{{ frappe.render_template('templates/includes/footer/footer.html', {}) }}

	<!-- render a jinja template string -->
	<p>{{ frappe.render_template('{{ foo }}', {'foo': 'bar'}) }}</p>
</div>

<!-- output -->
<div>
	<footer class="web-footer">
		<!-- full footer html -->
	</footer>
	<p>bar</p>
</div>
```
{% endraw %}

## frappe._
`frappe._(string)` or `_(string)`

Usage
{% raw %}
```html
<div>
	<p>{{ _('This string should get translated') }}</p>
</div>

<!-- output -->
<div>
	<p>इस तार का अनुवाद होना चाहिए</p>
</div>
```
{% endraw %}

## frappe.session.user

Returns the current session user

## frappe.session.csrf_token

Returns the current session's CSRF token

## frappe.form_dict

If the template is being evaluated in a web request, `frappe.form_dict` is a
dict of query parameters, else it is `None`.
