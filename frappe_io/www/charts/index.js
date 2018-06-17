
var totalAnnualFireballData = {
	labels: ["2007", "2008", "2009", "2010", "2011", "2012",
		"2013", "2014", "2015", "2016", "2017"],

	yMarkers: [
		{
			label: "Average 100 reports/month",
			value: 1200,
			options: { labelPos: 'left' }
		}
	],

	datasets: [{
		"name": "Events",
		"values": [152, 222, 199, 287, 534, 709,
			1179, 1256, 1632, 1856, 1850]
	}]
};

var fireball_5_25 = [
	[4, 0, 3, 1, 1, 2, 1, 1, 1, 0, 1, 1],
	[2, 3, 3, 2, 1, 3, 0, 1, 2, 7, 10, 4],
	[5, 6, 2, 4, 0, 1, 4, 3, 0, 2, 0, 1],
	[0, 2, 6, 2, 1, 1, 2, 3, 6, 3, 7, 8],
	[6, 8, 7, 7, 4, 5, 6, 5, 22, 12, 10, 11],
	[7, 10, 11, 7, 3, 2, 7, 7, 11, 15, 22, 20],
	[13, 16, 21, 18, 19, 17, 12, 17, 31, 28, 25, 29],
	[24, 14, 21, 14, 11, 15, 19, 21, 41, 22, 32, 18],
	[31, 20, 30, 22, 14, 17, 21, 35, 27, 50, 117, 24],
	[32, 24, 21, 27, 11, 27, 43, 37, 44, 40, 48, 32],
	[31, 38, 36, 26, 23, 23, 25, 29, 26, 47, 61, 50],
];
var fireball_2_5 = [
	[22, 6, 6, 9, 7, 8, 6, 14, 19, 10, 8, 20],
	[11, 13, 12, 8, 9, 11, 9, 13, 10, 22, 40, 24],
	[20, 13, 13, 19, 13, 10, 14, 13, 20, 18, 5, 9],
	[7, 13, 16, 19, 12, 11, 21, 27, 27, 24, 33, 33],
	[38, 25, 28, 22, 31, 21, 35, 42, 37, 32, 46, 53],
	[50, 33, 36, 34, 35, 28, 27, 52, 58, 59, 75, 69],
	[54, 67, 67, 45, 66, 51, 38, 64, 90, 113, 116, 87],
	[84, 52, 56, 51, 55, 46, 50, 87, 114, 83, 152, 93],
	[73, 58, 59, 63, 56, 51, 83, 140, 103, 115, 265, 89],
	[106, 95, 94, 71, 77, 75, 99, 136, 129, 154, 168, 156],
	[81, 102, 95, 72, 58, 91, 89, 122, 124, 135, 183, 171],
];
var fireballOver25 = [
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
	[1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2],
	[3, 2, 1, 3, 2, 0, 2, 2, 2, 3, 0, 1],
	[2, 3, 5, 2, 1, 3, 0, 2, 3, 5, 1, 4],
	[7, 4, 6, 1, 9, 2, 2, 2, 20, 9, 4, 9],
	[5, 6, 1, 2, 5, 4, 5, 5, 16, 9, 14, 9],
	[5, 4, 7, 5, 1, 5, 3, 3, 5, 7, 22, 2],
	[5, 13, 11, 6, 1, 7, 9, 8, 14, 17, 16, 3],
	[8, 9, 8, 6, 4, 8, 5, 6, 14, 11, 21, 12]
];

var monthlyFireballData = {
	labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	datasets: [
		{
			name: "Over 25 reports",
			values: fireballOver25[9],
		},
		{
			name: "5 to 25 reports",
			values: fireball_5_25[9],
		},
		{
			name: "2 to 5 reports",
			values: fireball_2_5[9]
		}
	]
};

var lineComposite = {
    config: {
        title: "Fireball/Bolide Events - Yearly (reported)",
        data: totalAnnualFireballData,
        type: "line",
        height: 250,
        colors: ["green"],
        isNavigable: 1,
        valuesOverPoints: 1,

        lineOptions: {
            dotSize: 8
        }
    }
}

var barComposite = {
    config: {
        data: monthlyFireballData,
        type: "bar",
        height: 270,
        colors: ["violet", "light-blue", "#46a9f9"],
        valuesOverPoints: 1,
        axisOptions: {
            xAxisMode: "tick"
        },
        barOptions: {
            stacked: 1
        }
    }
}

if(document.querySelectorAll('#line-composite-1').length) {
	let lineCompositeChart = new frappeChart.Chart("#line-composite-1", lineComposite.config);
	let barCompositeChart = new frappeChart.Chart("#bar-composite-1", barComposite.config);

	lineCompositeChart.parent.addEventListener('data-select', (e) => {
		let i = e.index;
		barCompositeChart.updateDatasets([
			fireballOver25[i], fireball_5_25[i], fireball_2_5[i]
		]);
	});
}