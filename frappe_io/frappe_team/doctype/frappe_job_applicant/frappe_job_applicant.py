# Copyright (c) 2015, Frappe and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class FrappeJobApplicant(Document):
	def before_insert(self):
		'''don't accept if applying in 30 days'''
		if frappe.db.sql('''select name from `tabFrappe Job Applicant`
			where email=%s and creation > adddate(curdate(), interval -30 day)''', self.email):
			frappe.throw('We have already recived your application. You can apply again after 30 days!')
