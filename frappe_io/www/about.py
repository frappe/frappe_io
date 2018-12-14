import frappe

def get_context(context):
    context.team_members = frappe.get_all('Team Member',
		fields=['*'], order_by='joining_date')