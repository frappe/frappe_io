import Vue from "../lib/vue.esm.browser";
import { getDemoVue, COMPONENT_NAME } from "../lib/demoBuilder.js";

import { Chart } from "../../www/charts/frappe-charts.min.esm";
import { sampleData as chartsData, methods as chartsMethods } from "../../www/charts/data";

frappe.projectDemos = {
	charts: {
		lib: Chart,
		methods: chartsMethods,
		getDemoConfig: (vueContext) => {
			let config = vueContext.config;
			let data = chartsData[vueContext.data];

			config.data = data;
			if(typeof data === "function") {
				config.data = data();
			}

			return {
				config: config,
				options: vueContext.options,
				actions: vueContext.actions
			};
		},
	}
}

let dataPath = document.querySelector("body").getAttribute("data-path");
let projectName = dataPath.indexOf('/') >= 0
	? dataPath.slice(0, dataPath.indexOf('/'))
	: dataPath;

if(projectName in frappe.projectDemos
	&& document.querySelectorAll(COMPONENT_NAME).length) {

	let project = frappe.projectDemos[projectName];

	Vue.component(...Object.values(
		getDemoVue(project.lib, project.getDemoConfig)
	));

	Vue.mixin({
		methods: project.methods
	})

	$(document).ready(function( ) {
		frappe.Vue = new Vue().$mount('.page_content');
	});
}
