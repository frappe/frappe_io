---
base_template: frappe_io/www/frappe/frappe_base.html
add_breadcrumbs: 1
title: Reports
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  Frappe framework is best suited for business applications and reporting is an
  important part of any business.
---

# Reports

Frappe framework is best suited for business applications and reporting is an
important part of any business. Frappe supports 3 different ways to build
reports depending on their complexity.

Let's discuss each type and how to build them using Frappe.

## Report Builder

Report Builder is the simplest type of Report and can be created without any
code. It will only show the records of single DocType as well as child records of
Child Tables.

#### Saving Reports

By default a Report View is generated for all DocTypes. The user can also save
multiple Reports based on different combination of filters, ordering, columns,
etc.

![Report Builder](/docs/assets/img/report-builder.gif)
*Report Builder*

#### Printing

Reports can be printed from the Menu.

![Report Builder Print](/docs/assets/img/report-builder-print.gif)
*Report Builder Print*

#### Group By

You can also apply group by clause on columns and use aggregate functions like Count, Sum and Average.

![Report Builder Group By](/docs/assets/img/report-builder-group-by.gif)
*Report Builder Group By*

#### Keyboard Navigation and Editing

Since report builder is a view of single DocType, they can also be edited.

![Report Builder Editing](/docs/assets/img/report-builder-editing.gif)
*Report Builder Editing*

## Query Report

Query Reports are reports that can be generated using a single SQL query. The
query can be simple or complex as long as it generates columns and records.
These reports can only be created by a System Manager and are stored in the database.

To create a Query Report, type "new report" in the awesomebar and hit enter.

1. Set Report Type as "Query Report"
1. Set the Reference DocType - Users that have access to the Reference DocType will have access to the report
1. Set the Module - The report will appear in the "Custom Reports" section of the module.
1. Write your query

> If you set Standard as "Yes" and Developer Mode is enabled, then a JSON file
> will be generated which you will have to check in to your version control. You
> should do this only if you want to bundle Query Reports with your app. The
> Module will decide where the JSON file will go.

![New Query Report](/docs/assets/img/query-report-example-1.png)

Here is what a query may look like:

```sql
SELECT
  `tabWork Order`.name as "Work Order:Link/Work Order:200",
  `tabWork Order`.creation as "Date:Date:120",
  `tabWork Order`.production_item as "Item:Link/Item:150",
  `tabWork Order`.qty as "To Produce:Int:100",
  `tabWork Order`.produced_qty as "Produced:Int:100",
  `tabWork Order`.company as "Company:Link/Company:"
FROM
  `tabWork Order`
WHERE
  `tabWork Order`.docstatus=1
  AND ifnull(`tabWork Order`.produced_qty,0) < `tabWork Order`.qty
  AND NOT EXISTS (SELECT name from `tabStock Entry` where work_order =`tabWork Order`.name)
```

If you notice there is a special syntax for each column, we use this information
to format the Report View.

For example: The first column `Work Order:Link/Work Order:200` will be rendered
as a Link Field with the DocType Work Order and the column width would be 200px.

![Query Report View](/docs/assets/img/query-report-example-2.png)
*Query Report View*

## Script Report

Anything that can't be achieved using Report Builder or Query Report can be
achieved using Script Reports. As the name suggests, these reports are built
using Python scripts. Since these reports give you unrestricted access via
Python scripts, they can only be created by Administrators. These reports are
meant to be written during development and be a part of your app.

> To create Script Reports you must enable Developer Mode.

To create a Script Report, type "new report" in the awesomebar and hit enter.

1. Set Report Type as "Script Report"
1. Set "Is Standard" as "Yes"
1. Select the Module in which you want to add this report
1. In the module folder (for example if it is Accounts in ERPnext the folder
   will be `erpnext/accounts/report/[report-name]`) you will see that templates
   for the report files will be created.
1. Write your python script in the generated `{report-name}.py` file.
1. You can add filters to your report by adding them to `{report-name}.js`

![New Script Report](/docs/assets/img/script-report-example-1.png)
*New Script Report*

#### Writing the script

The generated `.py` file comes with a boilerplate for your report. There is one
method named `execute` which takes `filters` and returns `columns` and `data`.
You can use any combination of python modules and SQL queries to generate your
report. The `execute` function looks like this

```python
from __future__ import unicode_literals
# import frappe

def execute(filters=None):
	columns, data = [], []
	return columns, data

```

The `execute` function is supposed to return the `columns` and the `data` to be shown in the report by default. A developer can optionally return a few paramters like `message`, `chart`, `report_summary`, `skip_total_rows`.

The following are the parameters that can be returned by the execute function

#### columns

This is a list of dictionaries. This holds all the columns that are to be displayed in the datatable in an order.

Example:
```python
columns = [
		{
			'fieldname': 'account',
			'label': _('Account'),
			'fieldtype': 'Link',
			'options': 'Account'
		},
		{
			'fieldname': 'currency',
			'label': _('Currency'),
			'fieldtype': 'Link',
			'options': 'Currency'
		},
		{
			'fieldname': 'balance',
			'label': _('Balance'),
			'fieldtype': 'Currency',
			'options': 'currency'
		}
	]
```

#### data
This can be a list of lists or a list of dictionaries. This holds the data to be displayed in the report

Example:
```python
data = [
		{
			'account': 'Application of Funds (Assets)',
			'currency': 'INR',
			'balance': '15182212.738'
		},
		{
			'account': 'Current Assets - GTPL',
			'currency': 'INR',
			'balance': '17117932.738'
		},
		...
	]
```

#### message
*The usage of this argument is deprecated.*

#### chart
Contains the configuration for the default chart to be shown in the report.

#### report_summary
This is a list of dictionaries that stores the important values in the report and is shown separately in the top section on the UI.

Example:
```python
[{
		"value": profit,
		"indicator": "Green" if profit > 0 else "Red",
		"label": _("Total Profit This Year"),
		"datatype": "Currency",
		"currency": "INR"
}]
```

> Note: These arguments are supposed to be returned in the specific order as follows

Here is a script report from ERPNext: [Balance Sheet](https://github.com/frappe/erpnext/blob/develop/erpnext/accounts/report/balance_sheet/balance_sheet.py)

#### Adding filters

To add filters in your report define the fields and their fieldtypes in the
`{report-name}.js` file. The filter values will be available in the `execute`
method as a dict.

```js
frappe.query_reports['Balance Sheet'] = {
	filters: [
		{
			fieldname: 'company',
			label: __('Company'),
			fieldtype: 'Link',
			options: 'Company',
			default: frappe.defaults.get_user_default('company')
		},
		{
			fieldname: 'periodicity',
			label: __('Periodicity'),
			fieldtype: 'Select',
			options: [
				'Monthly',
				'Quarterly',
				'Half-Yearly',
				'Yearly'
			],
			default: 'Yearly',
			depends_on: 'eval:doc.company=="Gadget Technologies Pvt. Ltd."'
		}
	]
}
```

Similar to the `depends_on` property that controls the display of fields, in
Version 13 we have introduced `depends_on` for Script Report filters. This can
be used to determine whether the filter will be visible based on the value of the
condition in `depends_on`.

![Balance Sheet](/docs/assets/img/script-report-example-2.png)
*Balance Sheet*

> *Protip*: To navigate directly to a Report of any of the above type, type its
> name in the awesomebar and hit enter.

## Query Report View

For both Query Reports and Script Reports the same UI view is used to render
them. So, both of them benefit from the UI features like Print, PDF, Export to
Excel/CSV, Auto Email Report, etc.

![Query Report Features](/docs/assets/img/query-report-view.png)
*Query Report Features*
