// https://stackoverflow.com/a/29325222
function getRandomBias(min, max, bias, influence) {
	const range = max - min;
	const biasValue = range * bias + min;
	var rnd = Math.random() * range + min,		// random in range
		mix = Math.random() * influence;		// random mixer
	return rnd * (1 - mix) + biasValue * mix;	// mix full range and bias
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} array An array containing the items.
 */
function shuffle(array) {
	// Awesomeness: https://bost.ocks.org/mike/shuffle/
	// https://stackoverflow.com/a/2450976/6495043
	// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array?noredirect=1&lq=1

	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
}

let updateDataAllLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue",
	"Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri",
	"Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];

const baseLength = 10;
const fullLength = 30;

let getRandom = () => Math.floor(getRandomBias(-40, 60, 0.8, 1));
let updateDataAllValues = Array.from({length: fullLength}, getRandom);

// We're gonna be shuffling this
let updateDataAllIndices = updateDataAllLabels.map((d,i) => i);

let getUpdateArray = (sourceArray, length=10) => {
	let indices = updateDataAllIndices.slice(0, length);
	return indices.map((index) => sourceArray[index]);
};

let currentLastIndex = baseLength;

const NO_OF_MILLIS = 1000;
const SEC_IN_DAY = 86400;

function clone(date) {
	return new Date(date.getTime());
}

function timestampToMidnight(timestamp, roundAhead = false) {
	let midnightTs = Math.floor(timestamp - (timestamp % SEC_IN_DAY));
	if(roundAhead) {
		return midnightTs + SEC_IN_DAY;
	}
	return midnightTs;
}

function timestampSec(date) {
	return date.getTime()/NO_OF_MILLIS;
}

function addDays(date, numberOfDays) {
	let newDate = clone(date);
	newDate.setDate(newDate.getDate() + numberOfDays);
	return newDate;
}

function getHeatmapData() {
	let today = new Date();
	let start = clone(today);
	start = addDays(start, 4);
	let end = clone(start);
	start.setFullYear( start.getFullYear() - 2 );
	end.setFullYear( end.getFullYear() - 1 );

	let dataPoints = {};

	let startTs = timestampSec(start);
	let endTs = timestampSec(end);

	startTs = timestampToMidnight(startTs);
	endTs = timestampToMidnight(endTs, true);

	while (startTs < endTs) {
		dataPoints[parseInt(startTs)] = Math.floor(getRandomBias(0, 5, 0.2, 1));
		startTs += SEC_IN_DAY;
	}

	return {
		dataPoints: dataPoints,
		start: start,
		end: end
	};
}

export const methods = {
	getUpdateData() {
		shuffle(updateDataAllIndices);
		let value = getRandom();
		let start = getRandom();
		let end = getRandom();
		currentLastIndex = baseLength;

		return {
			labels: updateDataAllLabels.slice(0, baseLength),
			datasets: [{
				values: getUpdateArray(updateDataAllValues)
			}],
			yMarkers: [
				{
					label: "Altitude",
					value: value,
					type: 'dashed'
				}
			],
			yRegions: [
				{
					label: "Range",
					start: start,
					end: end
				},
			],
		};
	},

	getAddUpdateData() {
		if(currentLastIndex >= fullLength) return;

		// TODO: Fix update on removal
		currentLastIndex++;
		let c = currentLastIndex -1;

		return [updateDataAllLabels[c], [updateDataAllValues[c]]];

		// updateChart.addDataPoint(
		// 	updateDataAllLabels[index], [updateDataAllValues[index]]
		// );
	}
}

export const sampleData = {
	"0": {
		labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		datasets: [
			{ values: [18, 40, 30, 35, 8, 52, 17, -4] }
		]
	},
	"1": {
		labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		datasets: [
			{ name: "Dataset 1", values: [18, 40, 30, 35, 8, 52, 17, -4] },
			{ name: "Dataset 2", values: [30, 50, -10, 15, 18, 32, 27, 14] }
		]
	},
	"2": {
		labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"],
		datasets: [
			{ values: [300, 250, 720, 560, 370, 610, 690, 410,
				370, 480, 620, 260, 170, 510, 630, 710] }
		]
	},
	"3": {
		labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		datasets: [
			{ values: [300, 250, 720, 560, 370, 610, 690, 410,
				370, 480, 620, 260, 170, 510, 630, 710, 560, 370, 610, 260, 170] }
		]
	},
	"trends-data": {
		labels: [1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976,
			1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986,
			1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996,
			1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006,
			2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016] ,
		datasets: [
			{
				values: [132.9, 150.0, 149.4, 148.0, 94.4, 97.6, 54.1, 49.2, 22.5, 18.4,
					39.3, 131.0, 220.1, 218.9, 198.9, 162.4, 91.0, 60.5, 20.6, 14.8,
					33.9, 123.0, 211.1, 191.8, 203.3, 133.0, 76.1, 44.9, 25.1, 11.6,
					28.9, 88.3, 136.3, 173.9, 170.4, 163.6, 99.3, 65.3, 45.8, 24.7,
					12.6, 4.2, 4.8, 24.9, 80.8, 84.5, 94.0, 113.3, 69.8, 39.8]
			}
		]
	},
	"ymarkers": {
		labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"],
		datasets: [
			{ values: [300, 250, 720, 560, 370, 610, 690, 410,
				370, 480, 620, 260, 170, 510, 630, 710] }
		],
		yMarkers: [
			{
				label: "Threshold",
				value: 650,
				options: { labelPos: 'left' }
			}
		]
	},

	"yregions": {
		labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"],
		datasets: [
			{ values: [300, 250, 720, 560, -370, 610, 690, 410,
				370, 480, 620, -260, 170, 430, 630, 210] }
		],
		yRegions: [
			{
				label: "Optimum Value",
				start: 100,
				end: 600,
				options: { labelPos: 'right' }
			}
		]
	},

	"mixed-1": {
		labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		datasets: [
		  {
			name: "Dataset 1",
			values: [18, 40, 30, 35, 8, 52, 17, -4],
			chartType: 'bar'
		  },
		  {
			name: "Dataset 2",
			values: [30, 50, -10, 15, 18, 32, 27, 14],
			chartType: 'line'
		  }
		]
	},

	"mixed-2": {
		labels: ["12am-3am", "3am-6am", "6am-9am", "9am-12pm",
			"12pm-3pm", "3pm-6pm", "6pm-9pm", "9pm-12am"],

		datasets: [
			{
				name: "Some Data",
				values: [18, 40, 30, 35, 8, 52, 17, -4],
				chartType: 'bar'
			},
			{
				name: "Another Set",
				values: [30, 50, -10, 15, 18, 32, 27, 14],
				chartType: 'bar'
			},
			{
				name: "Yet Another",
				values: [15, 20, -3, -15, 58, 12, -17, 37],
				chartType: 'line'
			}
		]
	},

	"all-inclusive": {
		labels: ["12am-3am", "3am-6am", "6am-9am", "9am-12pm",
		  "12pm-3pm", "3pm-6pm", "6pm-9pm", "9pm-12am"],

		datasets: [
		  {
			name: "Some Data", chartType: 'bar',
			values: [25, 40, 30, 35, 8, 52, 17, -4]
		  },
		  {
			name: "Another Set", chartType: 'bar',
			values: [25, 50, -10, 15, 18, 32, 27, 14]
		  },
		  {
			name: "Yet Another", chartType: 'line',
			values: [15, 20, -3, -15, 58, 12, -17, 37]
		  }
		],

		yMarkers: [{ label: "Marker", value: 70,
		  options: { labelPos: 'left' }}],
		yRegions: [{ label: "Region", start: -10, end: 50,
		  options: { labelPos: 'right' }}]
	},

	"get-update-data": methods.getUpdateData,

	"heatmap-data": getHeatmapData
}
