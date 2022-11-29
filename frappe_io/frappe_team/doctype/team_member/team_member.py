# -*- coding: utf-8 -*-
# Copyright (c) 2018, Frappe and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class TeamMember(Document):
	pass


@frappe.whitelist(allow_guest=True)
def get_team_data():
	return frappe.get_all(
		"Team Member",
		fields=[
			"name",
			"image",
			"social_label",
			"social_link",
			"role",
			"full_name",
			"employee",
		],
		filters={"enabled": 1},
		order_by="joining_date",
	)
