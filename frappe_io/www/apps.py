import frappe

def get_context(context):
	context.apps = frappe.get_all("Frappe App", fields="*", order_by="idx asc")
