---
base_template: frappe_io/www/frappe/frappe_base.html
add_breadcrumbs: 1
title: Rate Limiting
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  Frappe framework has out of the box support for rate-limiting HTTP requests.
---

# Rate Limiting

Frappe framework has out of the box support for rate-limiting HTTP requests.

Frappe framework implements fixed window rate-limiting based on time consumed by requests. The limit is enforced on the sum of time taken by all HTTP requests made in the configured window. The cycle resets after every `window` seconds, for instance, setting `window` to 3600 seconds will reset the usage counter to 0 at the beginning of every hour based on site's timezone.

**Note:** Requests over limit are not processed and are sent HTTP `429` (Too Many Requests) response.

You can enable rate limiting on your site by adding configuration similar to the following in `site_config.json`:

```json
{
  "rate_limit": {
    "limit": 600,
    "window": 3600
  }
}
```

Key     | Description
------- | -----------
`limit`   | Maximum amount of time permitted to use in the rate limit window (in seconds).
`window`  | Size of the rate limit window (in seconds).


The returned HTTP headers of every HTTP request show the current rate limit status, e.g.

```
curl -i https://frappe.io/docs
HTTP/1.1 200 OK
X-RateLimit-Limit: 600000000
X-RateLimit-Remaining: 518060453
X-RateLimit-Reset: 3513
X-RateLimit-Used: 100560
```

In case of requests made after configured limits are exhausted, HTTP `429` response is returned along with the rate limit status:

```
curl -i https://frappe.io/docs
HTTP/1.1 429 TOO MANY REQUESTS
X-RateLimit-Limit: 600000000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1242
Retry-After: 1242
```

Header                | Description
--------------------- | -----------
Retry-After           | Time remaining till the current rate limit window resets (in seconds).
X-RateLimit-Limit     | Time permitted to use in a rate limit window (in microseconds).
X-RateLimit-Remaining | Time remaining (to be used) in the current rate limit window (in microseconds).
X-RateLimit-Reset     | Time remaining till the current rate limit window resets (in seconds).
X-RateLimit-Used      | Time used for processing the current request (in microseconds).

