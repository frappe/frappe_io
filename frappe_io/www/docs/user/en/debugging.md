---
base_template: frappe_io/www/frappe/frappe_base.html
add_breadcrumbs: 1
title: Debugging
image: /assets/frappe_io/images/frappe-framework-logo-with-padding.png
metatags:
 description: >
  Learn about debugging techniques while developing Frappe apps.
---

# Debugging

## Server

When you run the `bench start` command during development, the log from each
process of the Procfile is logged in the terminal window.

```sh
▶ bench start
14:55:17 system           | redis_cache.1 started (pid=4085)
14:55:17 system           | redis_socketio.1 started (pid=4086)
14:55:17 system           | redis_queue.1 started (pid=4088)
14:55:17 system           | web.1 started (pid=4089)
14:55:17 system           | socketio.1 started (pid=4090)
14:55:17 system           | watch.1 started (pid=4094)
14:55:17 system           | worker_short.1 started (pid=4096)
14:55:17 system           | schedule.1 started (pid=4095)
14:55:17 redis_queue.1    | 4088:C 22 May 14:55:17.257 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
14:55:17 redis_queue.1    | 4088:C 22 May 14:55:17.264 # Redis version=4.0.11, bits=64, commit=00000000, modified=0, pid=4088, just started
14:55:17 redis_queue.1    | 4088:C 22 May 14:55:17.264 # Configuration loaded
14:55:17 redis_queue.1    | 4088:M 22 May 14:55:17.265 * Increased maximum number of open files to 10032 (it was originally set to 4864).
14:55:17 redis_cache.1    | 4085:C 22 May 14:55:17.262 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
14:55:17 redis_cache.1    | 4085:C 22 May 14:55:17.268 # Redis version=4.0.11, bits=64, commit=00000000, modified=0, pid=4085, just started
14:55:17 redis_cache.1    | 4085:C 22 May 14:55:17.268 # Configuration loaded
14:55:17 redis_cache.1    | 4085:M 22 May 14:55:17.269 * Increased maximum number of open files to 10032 (it was originally set to 4864).
14:55:17 redis_socketio.1 | 4086:C 22 May 14:55:17.262 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
14:55:17 redis_socketio.1 | 4086:C 22 May 14:55:17.270 # Redis version=4.0.11, bits=64, commit=00000000, modified=0, pid=4086, just started
14:55:17 redis_socketio.1 | 4086:C 22 May 14:55:17.270 # Configuration loaded
14:55:17 redis_socketio.1 | 4086:M 22 May 14:55:17.272 * Increased maximum number of open files to 10032 (it was originally set to 4864).
14:55:17 redis_queue.1    | 4088:M 22 May 14:55:17.285 * Running mode=standalone, port=11002.
14:55:17 redis_queue.1    | 4088:M 22 May 14:55:17.285 # Server initialized
14:55:17 redis_queue.1    | 4088:M 22 May 14:55:17.286 * Ready to accept connections
14:55:17 redis_cache.1    | 4085:M 22 May 14:55:17.287 * Running mode=standalone, port=13002.
14:55:17 redis_cache.1    | 4085:M 22 May 14:55:17.292 # Server initialized
14:55:17 redis_cache.1    | 4085:M 22 May 14:55:17.292 * Ready to accept connections
14:55:17 redis_socketio.1 | 4086:M 22 May 14:55:17.294 * Running mode=standalone, port=12002.
14:55:17 redis_socketio.1 | 4086:M 22 May 14:55:17.294 # Server initialized
14:55:17 redis_socketio.1 | 4086:M 22 May 14:55:17.295 * Ready to accept connections
14:55:17 system           | worker_long.1 started (pid=4098)
14:55:17 system           | worker_default.1 started (pid=4100)
14:55:18 socketio.1       | listening on *: 9002
14:55:20 socketio.1       | { Error: connect ECONNREFUSED 0.0.0.0:8002
14:55:20 socketio.1       |     at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1191:14)
14:55:20 socketio.1       |   errno: 'ECONNREFUSED',
14:55:20 socketio.1       |   code: 'ECONNREFUSED',
14:55:20 socketio.1       |   syscall: 'connect',
14:55:20 socketio.1       |   address: '0.0.0.0',
14:55:20 socketio.1       |   port: 8002,
14:55:20 socketio.1       |   response: undefined }
14:55:24 web.1            |  * Running on http://0.0.0.0:8002/ (Press CTRL+C to quit)
14:55:24 web.1            |  * Restarting with fsevents reloader
14:55:24 watch.1          | yarn run v1.10.1
14:55:24 watch.1          | $ node rollup/watch.js
14:55:25 web.1            |  * Debugger is active!
14:55:25 web.1            |  * Debugger PIN: 321-355-865
14:55:26 watch.1          |
14:55:26 watch.1          | Rollup Watcher Started
14:55:26 watch.1          |
14:55:26 watch.1          | Watching...
14:55:26 watch.1          | Rebuilding frappe-web.css
14:55:27 watch.1          | Rebuilding frappe-web-b4.css
14:55:27 watch.1          | Rebuilding chat.js
14:55:28 web.1            |
14:55:28 web.1            | test print
```

When you write any print statements in your python code, it will show up in the
`web:` process log if it is a request/response, or in one of `worker_` processes
if the code runs in a background job.

> If you are a VSCode user, you can debug right in your editor by setting
breakpoints in your code. Follow these
[steps](https://github.com/frappe/erpnext/wiki/VSCode-Debugging-for-Frappe-Python)
to set it up.

### Console

To play with Python API, bench provides an iPython shell. After you run the
following command, it will import frappe, initialize it and also connect to
database.

```sh
▶ bench --site [sitename] console

In [1]: frappe.get_doc('Task', 'TASK00004')
Out[1]: <erpnext.projects.doctype.task.task.Task at 0x10825d710>
```

> Learn more about the Python API [here](/docs/user/en/api/python).

### Profiling

Bench's `execute` command runs a dotted path to method and it also supports
profiling.

```sh
bench --site [sitename] --profile execute erpnext.projects.doctype.task.task.set_tasks_as_overdue
```

### Monitoring

Monitor logs request and job metadata. To enable this feature set `monitor: 1` in `site_config.json` or `common_site_config.json`.

Collected data is buffered in redis cache and periodically moved to `monitor.json.log` file in `logs` directory with a scheduled job `frappe.monitor.flush`.

```JSON
{
    "duration": 807142,
    "request": {
        "ip": "127.0.0.1",
        "method": "GET",
        "path": "/api/method/frappe.realtime.get_user_info",
        "response_length": 9687,
        "status_code": 500
    },
    "site": "frappe.local",
    "timestamp": "2020-03-05 09:37:17.397884",
    "transaction_type": "request",
    "uuid": "83be6a4c-27a1-497a-9ce6-c815bca4e420"
} 
```

```JSON
{
    "duration": 1364,
    "job": {
        "method": "frappe.ping",
        "scheduled": false,
        "wait": 90204
    },
    "site": "frappe.local",
    "timestamp": "2020-03-05 09:37:40.124682",
    "transaction_type": "job",
    "uuid": "8225ab76-8bee-462c-b9fc-a556406b1ee7"
}
```

## Client

Client side debugging is as simple as adding a `debugger` statement in your JS
file. You must open your DevTools in your browser for it to pause on the statement.

```js
frappe.db.get_value('Task', 'TASK00004', 'status')
	.then(values => {
		debugger
		console.log(values);
	})
```

### Console

To play with Client API, you can open your browser's console and use the
globally available `frappe` object to explore and run methods and access
properties.

![Browser Console](/docs/assets/img/client-side-debugging.png)
*Browser Console*

> Learn more about the Client API [here](/docs/user/en/api/javascript)
