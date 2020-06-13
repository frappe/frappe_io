# Copyright (c) 2020, Frappe Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt

from __future__ import unicode_literals
import frappe


def get_context(context):
	path = frappe.request.path

	if path.startswith("/"):
		path = path[1:]

	if path.startswith("frappejs/docs"):
		context.update(
			{
				"docs_search_scope": "frappejs/docs",
				"docs_navbar_items": [
					{"label": "GitHub", "url": "https://github.com/frappe/frappejs"}
				],
			}
		)

	if path.startswith("charts/docs"):
		context.update(
			{
				"docs_search_scope": "charts/docs",
				"docs_navbar_items": [
					{"label": "GitHub", "url": "https://github.com/frappe/charts"}
				],
			}
		)

	if path.startswith("datatable/docs"):
		context.update(
			{
				"docs_search_scope": "datatable/docs",
				"docs_navbar_items": [
					{"label": "GitHub", "url": "https://github.com/frappe/datatable"}
				],
			}
		)

	if path.startswith("bench-manager/docs"):
		context.update(
			{
				"docs_search_scope": "bench-manager/docs",
				"docs_navbar_items": [
					{"label": "GitHub", "url": "https://github.com/frappe/bench_manager"}
				],
			}
		)
