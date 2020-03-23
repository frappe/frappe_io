---
base_template: frappe_io/www/frappe/frappe_base.html
add_breadcrumbs: 1
title: Web Views for DocType
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
  description: >
    Frappe framework supports automatic generation of web views for DocType records.
---

# Web Views for DocType

Frappe framework supports automatic generation of web views for DocType records.
These views can be for a collection of records in a list or detail view for a
single record.

## How to enable Web View for DocType

> You must enable developer mode to do this.

While creating a new DocType, add a field with the name **Route** which will
define the route for every document. Add another field of type **Check** which
will enable or disable the web view for that document. In our example, it is the
**Published** field.

![Fields for Web View](/docs/assets/img/web-view-for-doctype-fields.png)

Now, enable **Has Web View** at the bottom of form. Enter the **Route** that
should be used for the list view of Books. Add the name of the Check field you
added in the previous step in the **Is Published Field**. You can also enable
**Allow Guest to View** if your web view doesn't require login.

![Has Web View](/docs/assets/img/has-web-view-for-doctype.png)


- This generates a standard lists and views with the route `[doctype]/[name]`
  which are rendered based on permission.
- You can also define your own list view route in the `Route` field.
- Access to the view for the individual route can be controlled by defining a
  condition field in the `Is Published Field`section.

![DocType Web View](/docs/assets/img/doctype-web-views.png)
_DocType Web View_

### Default Web View

If you are logged in as the test user, go to `/article` and you should see the list of articles:

<img class="screenshot" alt="web list" src="/docs/assets/img/web-list.png">

If not, update the `.html` template files under `library_management/doctype/article/templates/` with respective fields as per requirement.

Click on one article and you will see the default web view.

<img class="screenshot" alt="web view" src="/docs/assets/img/web-view.png">

### Customizing List View

You can provide list context by defining get_list_context function in the .py file of the doctype.

You can define following parameters in the list view context that can allow you to change the structure of the web page.

- **show_sidebar:** display sidebar
- **show_search:** display search option
- **no_breadcrumbs:** removes breadcrumbs
- **title:** title of the web page
- **list_template:** define path of a fully customized list template

### Customizing Row Element

Now if you want to customize the grid element within the list template of default web view, a new file `<doctype>_row_template.html` is generated in the templates folder of the doctype. Here is an example file:

    {% raw %}<div class="row">
    	<div class="col-sm-4">
    		<a href="/Article/{{ doc.name }}">
    			<img src="{{ doc.image }}"
    				class="img-responsive" style="max-height: 200px">
    		</a>
    	</div>
    	<div class="col-sm-4">
    		<a href="/Article/{{ doc.name }}"><h4>{{ doc.article_name }}</h4></a>
    		<p>{{ doc.author }}</p>
    		<p>{{ (doc.description[:200] + "...")
    			if doc.description|len > 200 else doc.description }}</p>
    		<p class="text-muted">Publisher: {{ doc.publisher }}</p>
    	</div>
    </div>{% endraw %}

Here, you will get all the properties of the article in the `doc` object.

The updated list view looks like this!

<img class="screenshot" alt="new web list" src="/docs/assets/img/web-list-new.png">

{next}
