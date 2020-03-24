import frappe
import requests

def get_context(context):
	country = get_country().get('countryCode')
	address = """<small>Frappe Technologies Pvt Ltd<br>
				D/324 Neelkanth Business Park,<br>
				Vidyavihar (W),<br>
				Mumbai 400086,<br>
				India</small>"""
	if country == "US":
		address = """<small>Frappe Technologies Pvt Ltd<br>
						300 Delaware Avenue<br>
						Suite 210<br>
						Wilmington, DE 19801</small>"""

	context.address = address


country_info = {}

def get_country(fields=None):
	global country_info
	ip = frappe.local.request_ip

	if not ip in country_info:
		fields = ['countryCode', 'country', 'regionName', 'city']
		res = requests.get('https://pro.ip-api.com/json/{ip}?key={key}&fields={fields}'.format(
			ip=ip, key=frappe.conf.get('ip-api-key'), fields=','.join(fields)))

		try:
			country_info[ip] = res.json()

		except Exception:
			country_info[ip] = {}

	return country_info[ip]