const {
	columns,
	data
} = getSampleData();

// Hero
let el = document.querySelector('.example-1')
let datatable = new frappe.DataTable(el, {
	columns,
	data,
	checkboxColumn: true,
	inlineFilters: true,
	layout: 'fluid'
});

let el1 = document.querySelector('.demo-target-1');
let dt1 = new frappe.DataTable(el1, {
	columns: ['Framework', 'Built By', 'GitHub Stars', 'License', 'Contributors', 'Age','Project Home', 'Project Link'],
	data: [
		['React', 'Facebook', 149017, 'MIT', 1385, '7 Years', 'https://reactjs.org', 'https://github.com/facebook/react'],
		['Angular', 'Google', 61263, 'MIT', 1119, '5 Years', 'https://angular.io', 'https://github.com/angular/angular'],
		['Vue', 'Evan You', 164408, 'MIT', 293, '4 Years', 'https://vuejs.org', 'https://github.com/vuejs/vue'],
		['Svelte', 'Rich Harris', 33865, 'MIT', 298, '3 Years', 'https://svelte.dev', 'https://github.com/sveltejs/svelte/'],
		['Stencil', 'Ionic Team', 7749, 'MIT', 132, '3 Years', 'https://stenciljs.com', 'https://github.com/ionic-team/stencil'],
	]
});

let el2 = document.querySelector('.demo-target-2');
let dt2 = new frappe.DataTable(el2, {
	columns: [
		{ name: 'Framework' },
		{ name: 'Built By' },
		{ name: 'GitHub Stars', format: value => `${value} ⭐️`},
		{ name: 'License' },
		{ name: 'Contributors' },
		{ name: 'Age', format: value => `${value} Years` },
		{ name: 'Project Home', format: value => `<a class="text-primary" href="${value}">${value}</a>` },
		{ name: 'Project Link', format: value => `<a class="text-primary" href="${value}">${value}</a>` }
	],
	data: [
		['React', 'Facebook', 149017, 'MIT', 1385, 7, 'https://reactjs.org', 'https://github.com/facebook/react'],
		['Angular', 'Google', 61263, 'MIT', 1119, 5, 'https://angular.io', 'https://github.com/angular/angular'],
		['Vue', 'Evan You', 164408, 'MIT', 293, 4, 'https://vuejs.org', 'https://github.com/vuejs/vue'],
		['Svelte', 'Rich Harris', 33865, 'MIT', 298, 3, 'https://svelte.dev', 'https://github.com/sveltejs/svelte/'],
		['Stencil', 'Ionic Team', 7749, 'MIT', 132, 3, 'https://stenciljs.com', 'https://github.com/ionic-team/stencil'],
	]
});

let el3 = document.querySelector('.demo-target-3');
let dt3 = new frappe.DataTable(el3, {
	columns: [
		{ name: 'Files', width: 300, format: formatFileName },
		{ name: 'Size', width: 150, align: 'right' },
		{ name: 'Last Updated', width: 200, align: 'right', default: "A Month Ago"},
	],
	data: [
		{
			'Files': 'Documents',
			'Size': '2M',
			'Last Updated': '',
			'indent': 0
		},
		{
			'Files': 'project.pdf',
			'Size': '1M',
			'Last Updated': 'Yesterday',
			'indent': 1
		},
		{
			'Files': 'my-face.png',
			'Size': '500k',
			'Last Updated': '2018-04-09',
			'indent': 1
		},
		{
			'Files': 'Projects',
			'Size': '77M',
			'Last Updated': '',
			'indent': 0
		},
		{
			'Files': 'frappe-gantt',
			'Size': '23M',
			'Last Updated': '',
			'indent': 1
		},
		{
			'Files': 'dist',
			'Size': '50k',
			'Last Updated': '2018-06-01',
			'indent': 2
		},
		{
			'Files': 'package.json',
			'Size': '5k',
			'Last Updated': '2018-06-01',
			'indent': 2
		},
		{
			'Files': 'frappe-datatable',
			'Size': '54M',
			'Last Updated': '',
			'indent': 1
		},
		{
			'Files': 'src',
			'Size': '53k',
			'Last Updated': 'A few seconds ago',
			'indent': 2
		},
	],
	treeView: true
});

let datatableThemedElement = document.querySelector('.demo-target-4');
window.datatableThemed = new frappe.DataTable(datatableThemedElement, {
	columns: [
		{ name: 'Framework' },
		{ name: 'Built By' },
		{ name: 'GitHub Stars', format: value => `${value} ⭐️`},
		{ name: 'License' },
		{ name: 'Contributors' },
		{ name: 'Age', format: value => `${value} Years` },
		{ name: 'Project Home', format: value => `<a class="text-primary" href="${value}">${value}</a>` },
		{ name: 'Project Link', format: value => `<a class="text-primary" href="${value}">${value}</a>` }
	],
	data: [
		['React', 'Facebook', 149017, 'MIT', 1385, 7, 'https://reactjs.org', 'https://github.com/facebook/react'],
		['Angular', 'Google', 61263, 'MIT', 1119, 5, 'https://angular.io', 'https://github.com/angular/angular'],
		['Vue', 'Evan You', 164408, 'MIT', 293, 4, 'https://vuejs.org', 'https://github.com/vuejs/vue'],
		['Svelte', 'Rich Harris', 33865, 'MIT', 298, 3, 'https://svelte.dev', 'https://github.com/sveltejs/svelte/'],
		['Stencil', 'Ionic Team', 7749, 'MIT', 132, 3, 'https://stenciljs.com', 'https://github.com/ionic-team/stencil'],
	]
});


function formatFileName(value, row, column, cell) {
	if (!row.meta.isLeaf) {
		return `<b>${value}</b>`;
	}

	return `<i class="fa fa-file mr-2 text-muted"></i>${value}`;
}

function getSampleData(multiplier) {
	let columns = ['Name', 'Position', 'Office', {name: 'Extn.', width: 107}, 'Start Date', 'Salary'];
	let data = [
		['Tiger Nixon', 'System Architect', 'Edinburgh', 5421, '2011/04/25', '320,800'],
		['Garrett Winters', 'Accountant', 'Tokyo', 8422, '2011/07/25', '170,750'],
		['Ashton Cox', 'Junior Technical Author', 'San Francisco', 1562, '2009/01/12', '86,000'],
		['Cedric Kelly', 'Senior Javascript Developer', 'Edinburgh', 6224, '2012/03/29', '433,060'],
		['Airi Satou', 'Accountant', 'Tokyo', 5407, '2008/11/28', '162,700'],
		['Brielle Williamson', 'Integration Specialist', 'New York', 4804, '2012/12/02', '372,000'],
		['Herrod Chandler', 'Sales Assistant', 'San Francisco', 9608, '2012/08/06', '137,500'],
		['Rhona Davidson', 'Integration Specialist', 'Tokyo', 6200, '2010/10/14', '327,900'],
		['Colleen Hurst', 'Javascript Developer', 'San Francisco', 2360, '2009/09/15', '205,500'],
		['Sonya Frost', 'Software Engineer', 'Edinburgh', 1667, '2008/12/13', '103,600'],
		['Jena Gaines', 'Office Manager', 'London', 3814, '2008/12/19', '90,560'],
		['Quinn Flynn', 'Support Lead', 'Edinburgh', 9497, '2013/03/03', '342,000'],
		['Charde Marshall', 'Regional Director', 'San Francisco', 6741, '2008/10/16', '470,600'],
		['Haley Kennedy', 'Senior Marketing Designer', 'London', 3597, '2012/12/18', '313,500'],
		['Tatyana Fitzpatrick', 'Regional Director', 'London', 1965, '2010/03/17', '385,750'],
		['Michael Silva', 'Marketing Designer', 'London', 1581, '2012/11/27', '198,500'],
		['Paul Byrd', 'Chief Financial Officer (CFO)', 'New York', 3059, '2010/06/09', '725,000'],
		['Gloria Little', 'Systems Administrator', 'New York', 1721, '2009/04/10', '237,500'],
		['Bradley Greer', 'Software Engineer', 'London', 2558, '2012/10/13', '132,000'],
		['Dai Rios', 'Personnel Lead', 'Edinburgh', 2290, '2012/09/26', '217,500'],
		['Jenette Caldwell', 'Development Lead', 'New York', 1937, '2011/09/03', '345,000'],
		['Yuri Berry', 'Chief Marketing Officer (CMO)', 'New York', 6154, '2009/06/25', '675,000'],
		['Caesar Vance', 'Pre-Sales Support', 'New York', 8330, '2011/12/12', '106,450'],
		['Doris Wilder', 'Sales Assistant', 'Sidney', 3023, '2010/09/20', '85,600'],
		['Angelica Ramos', 'Chief Executive Officer (CEO)', 'London', 5797, '2009/10/09', '1,200,000'],
		['Gavin Joyce', 'Developer', 'Edinburgh', 8822, '2010/12/22', '92,575'],
		['Jennifer Chang', 'Regional Director', 'Singapore', 9239, '2010/11/14', '357,650'],
		['Brenden Wagner', 'Software Engineer', 'San Francisco', 1314, '2011/06/07', '206,850'],
		['Fiona Green', 'Chief Operating Officer (COO)', 'San Francisco', 2947, '2010/03/11', '850,000'],
		['Shou Itou', 'Regional Marketing', 'Tokyo', 8899, '2011/08/14', '163,000'],
		['Michelle House', 'Integration Specialist', 'Sidney', 2769, '2011/06/02', '95,400'],
		['Suki Burks', 'Developer', 'London', 6832, '2009/10/22', '114,500'],
		['Prescott Bartlett', 'Technical Author', 'London', 3606, '2011/05/07', '145,000'],
		['Gavin Cortez', 'Team Leader', 'San Francisco', 2860, '2008/10/26', '235,500'],
		['Martena Mccray', 'Post-Sales support', 'Edinburgh', 8240, '2011/03/09', '324,050'],
		['Unity Butler', 'Marketing Designer', 'San Francisco', 5384, '2009/12/09', '85,675'],
		['Howard Hatfield', 'Office Manager', 'San Francisco', 7031, '2008/12/16', '164,500'],
		['Hope Fuentes', 'Secretary', 'San Francisco', 6318, '2010/02/12', '109,850'],
		['Vivian Harrell', 'Financial Controller', 'San Francisco', 9422, '2009/02/14', '452,500'],
		['Timothy Mooney', 'Office Manager', 'London', 7580, '2008/12/11', '136,200'],
		['Jackson Bradshaw', 'Director', 'New York', 1042, '2008/09/26', '645,750'],
		['Olivia Liang', 'Support Engineer', 'Singapore', 2120, '2011/02/03', '234,500'],
		['Bruno Nash', 'Software Engineer', 'London', 6222, '2011/05/03', '163,500'],
		['Sakura Yamamoto', 'Support Engineer', 'Tokyo', 9383, '2009/08/19', '139,575'],
		['Thor Walton', 'Developer', 'New York', 8327, '2013/08/11', '98,540'],
		['Finn Camacho', 'Support Engineer', 'San Francisco', 2927, '2009/07/07', '87,500'],
		['Serge Baldwin', 'Data Coordinator', 'Singapore', 8352, '2012/04/09', '138,575'],
		['Zenaida Frank', 'Software Engineer', 'New York', 7439, '2010/01/04', '125,250'],
		['Zorita Serrano', 'Software Engineer', 'San Francisco', 4389, '2012/06/01', '115,000'],
		['Jennifer Acosta', 'Junior Javascript Developer', 'Edinburgh', 3431, '2013/02/01', '75,650'],
		['Cara Stevens', 'Sales Assistant', 'New York', 3990, '2011/12/06', '145,600'],
		['Hermione Butler', 'Regional Director', 'London', 1016, '2011/03/21', '356,250'],
		['Lael Greer', 'Systems Administrator', 'London', 6733, '2009/02/27', '103,500'],
		['Jonas Alexander', 'Developer', 'San Francisco', 8196, '2010/07/14', '86,500'],
		['Shad Decker', 'Regional Director', 'Edinburgh', 6373, '2008/11/13', '183,000'],
		['Michael Bruce', 'Javascript Developer', 'Singapore', 5384, '2011/06/27', '183,000'],
		['Donna Snider', 'Customer Support', 'New York', 4226, '2011/01/25', '112,000']
	];

	if (multiplier) {
		Array.from(new Array(multiplier - 1)).forEach(d => {
			data = data.concat(data);
		});
	}

	return {
		columns,
		data
	};
}

function escapeHtml(unsafe) {
	return unsafe
		 .replace(/&/g, "&amp;")
		 .replace(/</g, "&lt;")
		 .replace(/>/g, "&gt;")
		 .replace(/"/g, "&quot;")
		 .replace(/'/g, "&#039;");
}
