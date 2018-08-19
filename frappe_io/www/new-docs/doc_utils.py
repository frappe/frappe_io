import frappe, io, json, os
from os.path import join as path_join

@frappe.whitelist(allow_guest=True)
def get_edit_link(docs_path):
    config_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'docs.json')
    config = frappe._dict(frappe.get_file_json(config_path))

    github_url = path_join(config.github_url, 'tree', config.github_branch)
    doc_file_path = get_doc_file_path(docs_path)
    root_app_path = os.path.abspath(frappe.get_app_path('frappe_io', '..'))

    return doc_file_path.replace(root_app_path, github_url)

def get_doc_file_path(docs_path):
    app_path = frappe.get_app_path('frappe_io')
    og_path = path_join(app_path, 'www', docs_path)
    path = None

    tests = ['.md', '/index.md', '.html', '/index.html']
    for test in tests:
        path = og_path + test
        if os.path.exists(path):
            break
        else:
            path = None
    return path
