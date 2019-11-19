---
base_template: frappe_io/www/frappe/frappe_base.html
add_breadcrumbs: 1
title: Testing
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  Frappe provides some basic tooling to write automated tests. We use the standard
  library unittest provided by Python.
---

# Testing

Frappe provides some basic tooling to write automated tests. There are some
basic rules:

1. Test can be anywhere in your repository but must begin with `test_` and
   should be a `.py` file.
1. The test runner will automatically build test records for dependent DocTypes
   identified by the `Link` type field (Foreign Key).
1. For non-DocType tests, you can write simple unit tests and prefix your file
   names with `test_`.


## Writing Tests

When you create a new DocType (in developer mode), the boilerplate files also
contain the `test_{doctype}.py` file. The test file should handle creating
dependencies and cleaning them up.

Here is a sample test file referred from `test_event.py`.

```py
import frappe
import unittest

def create_events():
	if frappe.flags.test_events_created:
		return

	frappe.set_user("Administrator")
	doc = frappe.get_doc({
		"doctype": "Event",
		"subject":"_Test Event 1",
		"starts_on": "2014-01-01",
		"event_type": "Public"
	}).insert()

	doc = frappe.get_doc({
		"doctype": "Event",
		"subject":"_Test Event 3",
		"starts_on": "2014-01-01",
		"event_type": "Public"
		"event_individuals": [{
			"person": "test1@example.com"
		}]
	}).insert()

	frappe.flags.test_events_created = True


class TestEvent(unittest.TestCase):
	def setUp(self):
		create_events()

	def tearDown(self):
		frappe.set_user("Administrator")

	def test_allowed_public(self):
		frappe.set_user("test1@example.com")
		doc = frappe.get_doc("Event", frappe.db.get_value("Event",
			{"subject":"_Test Event 1"}))
		self.assertTrue(frappe.has_permission("Event", doc=doc))

	def test_not_allowed_private(self):
		frappe.set_user("test1@example.com")
		doc = frappe.get_doc("Event", frappe.db.get_value("Event",
			{"subject":"_Test Event 2"}))
		self.assertFalse(frappe.has_permission("Event", doc=doc))
```

## Running Tests

Run the following command to run all your tests. It will build all
the test dependencies once and run your tests. You should run tests from
`frappe_bench` folder.

```bash
# run all tests
bench --site [sitename] run-tests

# run tests for only frappe app
bench --site [sitename] run-tests --app frappe

# run tests for the Task doctype
bench --site [sitename] run-tests --doctype "Task"

# run a test using module path
bench --site [sitename] run-tests --module frappe.tests.test_api

# run a specific test from a test file
bench --site [sitename] run-tests --module frappe.tests.test_api --test test_insert_many

# run tests without creating test records
bench --site [sitename] run-tests --skip-test-records --doctype "Task"

# profile tests and show a report after tests execute
bench --site [sitename] run-tests --profile --doctype "Task"
.
----------------------------------------------------------------------
Ran 1 test in 0.010s

OK

9133 function calls (8912 primitive calls) in 0.011 seconds

Ordered by: cumulative time

ncalls  tottime  percall  cumtime  percall filename:lineno(function)
	2    0.000    0.000    0.008    0.004 /home/frappe/frappe-bench/apps/frappe/frappe/model/document.py:187(insert)
	1    0.000    0.000    0.003    0.003 /home/frappe/frappe-bench/apps/frappe/frappe/model/document.py:386(_validate)
	13   0.000    0.000    0.002    0.000 /home/frappe/frappe-bench/apps/frappe/frappe/database.py:77(sql)
	255  0.000    0.000    0.002    0.000 /home/frappe/frappe-bench/apps/frappe/frappe/model/base_document.py:91(get)
	12   0.000    0.000    0.002    0.000


# verbose log level for tests
bench --site [sitename] --verbose run-tests
```
