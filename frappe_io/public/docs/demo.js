import Vue from "../lib/vue.esm.browser";
import { getDemoVue } from "../lib/demoBuilder.js";

import { Chart } from "../../www/charts/frappe-charts.min.esm";
import { data as chartsData } from "../../www/charts/data";

frappe.projectDemos = {
	charts: {
		lib: Chart,
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
		}
	}
}

let dataPath = document.querySelector("body").getAttribute("data-path");
let projectName = dataPath.slice(0, dataPath.indexOf('/'))

if(projectName in frappe.projectDemos
	&& document.querySelectorAll(frappe.demoVue.name).length) {

	let project = frappe.projectDemos[projectName];

	Vue.component(...Object.values(
		getDemoVue(project.lib, project.getDemoConfig)
	));

	$(document).ready(function( ) {
		frappe.Vue = new Vue().$mount('.page_content');
	});
}
