# Report Print Formats

<p class="lead">In version 4.1 we introduce Report Print Formats. These are HTML templates that you can use to format Query Report data for printing.</p>

### 1. Creating New Print Formats

To create a new Print Format, just drop in a `.html` file in the folder of the query report. For example, for the [General Ledger](https://github.com/frappe/erpnext/tree/develop/erpnext/accounts/report/general_ledger) report in ERPNext, you can drop in a file called `general_ledger.html` along side the `.js` and `.py` files.

##### Tree Of `erpnext/accounts/general_ledger`

	general_ledger/
	├── __init__.py
	├── general_ledger.html
	├── general_ledger.js
	├── general_ledger.json
	└── general_ledger.py


### 2. Templating

For templating, we use an adapted version of [John Resig's microtemplating script](http://ejohn.org/blog/javascript-micro-templating/). If you know Javascript, it is very easy to follow this templating language.

##### Here are some examples (from John Resig's Blog):

Example: Properities:

	<div id="<%=id%>" class="<%=(i % 2 == 1 ? " even" : "")%>">
		<div class="grid_1 alpha right">
			<img class="righted" src="<%=profile_image_url%>"/>
		</div>
		<div class="grid_6 omega contents">
			<p><b><a href="/<%=from_user%>">
				<%=from_user%></a>:</b> <%=text%></p>
		</div>
	  </div>

Example: Code structures, Loops

	<% for ( var i = 0; i < users.length; i++ ) { %>
		<li><a href="<%=users[i].url%>"><%=users[i].name%></a></li>
	<% } %>

> **Note**: It is important to note that you should not use single quotes (') in your template as the engine cannot handle them effectively.

### 3. Data

Data is available to the template as:

- `data`: this is a list of records, with each record as an object with slugified properties from labels. For example "Posting Date" becomes "posting_date"
- `filters`: filters set in the report
- `report`: reportview object

### 4. Example

Here is how the General Ledger Report is built:

	<h2 class="text-center">
		{%= __("Statement of Account") %}</h2>
	<h4 class="text-center">
		{%= filters.account || "General Ledger" %}</h3>
	<hr>
	<table class="table table-bordered">
		<thead>
			<tr>
				<th style="width: 10%">{%= __("Date") %}</th>
				<th style="width: 15%">{%= __("Ref") %}</th>
				<th style="width: 45%">{%= __("Party") %}</th>
				<th style="width: 15%">{%= __("Debit") %}</th>
				<th style="width: 15%">{%= __("Credit") %}</th>
			</tr>
		</thead>
		<tbody>
			{% for(var i=0, l=data.length; i<l; i++) { %}
				<tr>
				{% if(data[i].posting_date) { %}
					<td>{%= dateutil.str_to_user(data[i].posting_date) %}</td>
					<td>{%= data[i].voucher_no %}</td>
					<td>{%= data[i].account %}
						<br>{%= __("Against") %}: {%= data[i].account %}
						<br>{%= __("Remarks") %}: {%= data[i].remarks %}</td>
					<td style="text-align: right">
						{%= fmt_money(data[i].debit) %}</td>
					<td style="text-align: right">
						{%= fmt_money(data[i].credit) %}</td>
				{% } else { %}
					<td></td>
					<td></td>
					<td><b>{%= data[i].account || "&nbsp;" %}</b></td>
					<td style="text-align: right">
						{%= data[i].account && fmt_money(data[i].debit) %}</td>
					<td style="text-align: right">
						{%= data[i].account && fmt_money(data[i].credit) %}</td>
				{% } %}
				</tr>
			{% } %}
		</tbody>
	</table>
	<p class="text-right text-muted">
		Printed On {%= dateutil.get_datetime_as_string() %}</p>

Here is what the report looks like:

![General Ledger](/assets/frappe_io/images/how-to/general-ledger.png)

##### Comments:

1. [Bootstrap Stylesheet](http://getbootstrap.com) is pre-loaded.
1. You can use all global functions like `fmt_money` and dateutil.
1. Translatable strings should be written as `__("text")`
