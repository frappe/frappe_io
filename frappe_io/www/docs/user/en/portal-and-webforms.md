<!-- base_template: frappe_io/www/frappe/frappe_base.html -->
<!-- add-breadcrumbs -->
# Portal and Webforms

Frappe Framework not only provides a rich admin interface via the
[Desk](/docs/user/en/desk) which is an SPA but also static server rendered
web pages and forms. These pages are generally built for your website visitors.
They can be public or can require login.

## Portal Pages

Every frappe app including frappe comes with a `www` folder which directly maps
to website urls. Here is what the directory structure looks like:

```bash
frappe/www
├── about.html
├── about.py
├── contact.html
├── contact.py
├── desk.html
├── desk.py
├── login.html
├── login.py
├── me.html
└── me.py
```

This structure enables the routes `/about`, `/contact`, `/desk`, `/login` and
`/me`.

To add your own page, just add an HTML file in the `www` folder of your app.
There are multiple ways to organize these portal pages. For example,

```bash
custom_app/www
├── custom_page.html
└── custom_page.py
```
Will be rendered on the route `/custom_page`.

To add subpages you can convert your main page into a folder and add its content
in an index file. For example,

```bash
custom_app/www
└── custom_page
	├── index.html
	├── index.py
	├── subpage.html
	└── subpage.py

```
Will still be rendered on the route `/custom_page` and `/custom_page/subpage`
will also be available.

> You can write `.md` files instead of `.html` for simple static pages like
> documentation. The documentation you are reading is written as a markdown file.

### Templating

You can add dynamic content to Portal Pages using Jinja templates. All of the
portal pages extend from the base template `frappe/templates/web.html` which
itself extends from `frappe/templates/base.html`.

Here is what a sample page might look like:

{% raw %}
```html
<!-- about.html -->
{% extends "templates/web.html" %}

{% block title %}{{ _("About Us") }}{% endblock %}

{% block page_content %}
<h1>{{ _("About Us") }}</h1>
<div class="row">
    <div class="col-sm-6">
		We believe that great companies are driven by excellence,
		and add value to both its customers and society.
		You will find our team embibes these values.
    </div>
</div>
{% endblock %}
```
{% endraw %}

You can also omit the `extend` and `block` if you want to the use the default
base template.

{% raw %}
```html
<!-- about.html -->
<h1>{{ _("About Us") }}</h1>
<div class="row">
    <div class="col-sm-6">
		We believe that great companies are driven by excellence,
		and add value to both its customers and society.
		You will find our team embibes these values.
    </div>
</div>
```
{% endraw %}

### Context

Every portal page can have a python controller which will build `context` for
the page. The controller should have the same name as the `.html` or `.md` file
with a `.py` extension.

```bash
custom_app/www
├── custom_page.html
└── custom_page.py
```

The controller should have a `get_context` method which takes a `context` dict,
adds any data to it and then returns it. Here is what a sample page controller
might look like:

```py
# about.py
import frappe

def get_context(context):
	context.about_us_settings = frappe.get_doc('About Us Settings')
	return context
```

Usage in template

{% raw %}
```html
<!-- about.html -->
<h1>{{ _("About Us") }}</h1>
<div class="row">
    <div class="col-sm-6">
		We believe that great companies are driven by excellence,
		and add value to both its customers and society.
		You will find our team embibes these values.
	</div>

	{% if about_us_settings.show_contact_us %}
	<a href="/contact" class="btn btn-primary">Contact Us</a>
	{% endif %}
</div>
```
{% endraw %}

> Since Portal Pages are built using Jinja, frappe provides a standard
> [API](/docs/user/en/api/jinja) to use in jinja templates.
