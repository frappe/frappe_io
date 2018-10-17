<section class='section-padding text-center'>
	<h1>Frappe Security Bulletin</h1>
	<p class="lead">
		This security bulletin contains detailed information about vulnerabilities affecting Frappe.
	</p>
</section>

### Disclaimer

* The following list of vulnerabilities and exploits have been patched in all currently supported versions of Frappe.
* This list may be considered inexhaustive and is complete to our best knowledge.
	* If any of the fixed issues haven't been added to the list, please [submit an issue][1] or a [pull request][2] regarding the same.
	* If you find any vulnerability in the system that needs to be fixed, please [report it][3] to us.


### Security Vulnerabilities

#### v11

* [CVE-2018-5713][4] - **Search Field Sanitization.**
	* Sanitize search fields to avoid SQL injection.
* [CVE-2018-5721][5] - **Filter Field Sanitization.**
	* Sanitize `filter` and `or_filter` fields to avoid SQL injection.
* [CVE-2018-5800][6] - **Enhancement to CVE-2018-5713**
	* Tighten criteria to prevent SQL injection in search fields.
* [CVE-2018-5785][7] - **Prevent Brute Force on Login Page.**
	* Disallow user to login and lock user account after a certain number of bad password attempts.
* [CVE-2018-4942][8] - **Prevent direct access to Python files.**
	* Disallow direct user access to Python files.


#### v10

* [CVE-2017-2784][9] - **Prevent SQL injection.**
	* Validate `GROUP BY` and `ORDER BY` clause in queries to prevent SQL injection.
* [CVE-2016-2481][10] - **Fix User Permissions.**
	* Disallow access shared files to users with no permissions.


[1]: https://github.com/frappe/frappe_io/issues
[2]: https://github.com/frappe/frappe_io/pulls
[3]: https://github.com/frappe/frappe/issues
[4]: https://github.com/frappe/frappe/pull/5713
[5]: https://github.com/frappe/frappe/pull/5721
[6]: https://github.com/frappe/frappe/pull/5800
[7]: https://github.com/frappe/frappe/pull/5785
[8]: https://github.com/frappe/frappe/pull/4942
[9]: https://github.com/frappe/frappe/pull/2784
[10]: https://github.com/frappe/frappe/pull/2481