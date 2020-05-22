---
add_breadcrumbs: 1
title: Developer API
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  All of the Frappe API in one place
---

# Developer API

## Python

Frappe aims to achieve minimum cognitive load for its users. Hence, you can find
the most used methods and utilities in the `frappe` namespace itself. It's the
only import you need (most of the time) in a Python file.

1. [Document](/docs/user/en/api/document)
1. [Database](/docs/user/en/api/database)


## Javascript

Frappe attaches itself to the `window` object under the `frappe` namespace. You
will find most of the Client API under the `frappe` object. All of these methods
are only available inside the Desk. A good way to explore these APIs is from the
browser console.

1. [Form](/docs/user/en/api/form)
1. [Controls](/docs/user/en/api/controls)
1. [Page](/docs/user/en/api/page)
1. [Server Calls (AJAX)](/docs/user/en/api/server-calls)
1. [Common Utilities](/docs/user/en/api/js-utils)

## Other

1. [Dialog API](/docs/user/en/api/dialog)
1. [REST API](/docs/user/en/api/rest)
1. [Jinja API](/docs/user/en/api/jinja)
