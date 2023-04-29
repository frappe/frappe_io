# -*- coding: utf-8 -*-
from __future__ import unicode_literals

app_name = "frappe_io"
app_title = "Frappe IO Website"
app_publisher = "Frappe"
app_description = "frappe.io"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "info@frappe.io"
app_version = "0.0.1"

hide_in_installer = True

fixtures = ["Contact Us Settings", "Web Form"]

website_redirects = [
        {"source": "/docs/bench", "target": "/docs/user/en/bench/resources/"},
        {"source": "/docs/bench/cheatsheet", "target": "/docs/user/en/bench/resources/bench-commands-cheatsheet.html"}
]

website_context = {
	"repo": "frappe/frappe_io",
	'logo_image_url': '/assets/frappe_io/images/frappe-logo.png',
	'brand_name': 'Frappe',
	"favicon": '/assets/frappe_io/images/frappe-logo.png',
}

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/frappe_io/css/frappe_io.css"
# app_include_js = "/assets/frappe_io/js/frappe_io.js"

# include js, css files in header of web template
web_include_css = "assets/frappe/css/hljs-night-owl.css"
look_for_sidebar_json = True

base_template_map = {
	r"charts/docs.*": "templates/doc.html",
	r"datatable/docs.*": "templates/doc.html",
	r"bench-manager/docs.*": "templates/doc.html",
	r"frappejs/docs.*": "templates/doc.html"
}

update_website_context = ['frappe_io.website_context.get_context']

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "frappe_io.install.before_install"
# after_install = "frappe_io.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "frappe_io.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"frappe_io.tasks.all"
# 	],
# 	"daily": [
# 		"frappe_io.tasks.daily"
# 	],
# 	"hourly": [
# 		"frappe_io.tasks.hourly"
# 	],
# 	"weekly": [
# 		"frappe_io.tasks.weekly"
# 	]
# 	"monthly": [
# 		"frappe_io.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "frappe_io.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "frappe_io.event.get_events"
# }
