# -*- coding: utf-8 -*-
# Copyright (c) 2018, Frappe and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class TeamMember(Document):
	pass

@frappe.whitelist(allow_guest=True)
def get_team_data():
	return frappe.get_all('Team Member',
		fields=['*'], order_by='joining_date')