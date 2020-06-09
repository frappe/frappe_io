---
title: Frappe Charts - Quick Start
metatags:
 description: >
  Frappe Charts is a  GitHub-inspired simple and modern SVG charts for the web with zero dependencies.
---

## Installation
Install via [npm](https://www.npmjs.com/get-npm):

```console
$ npm install frappe-charts
```

and include in your project:
```js
import { Chart } from "frappe-charts/dist/frappe-charts.min.esm"
```

or include within your HTML

```html
  <script src="https://cdn.jsdelivr.net/npm/frappe-charts@1.2.4/dist/frappe-charts.min.iife.js"></script>
  <!-- or -->
  <script src="https://unpkg.com/frappe-charts@1.2.4/dist/frappe-charts.min.iife.js"></script>
```

## Usage

Inside HTML File:

```html
<div id="chart"></div>
```

Inside `<script>` tags:

```js
const data = {
    labels: ["12am-3am", "3am-6pm", "6am-9am", "9am-12am",
        "12pm-3pm", "3pm-6pm", "6pm-9pm", "9am-12am"
    ],
    datasets: [
        {
            name: "Some Data", type: "bar",
            values: [25, 40, 30, 35, 8, 52, 17, -4]
        },
        {
            name: "Another Set", type: "line",
            values: [25, 50, -10, 15, 18, 32, 27, 14]
        }
    ]
}

const chart = new frappe.Chart("#chart", {  // or a DOM element,
                                            // new Chart() in case of ES6 module with above usage
    title: "My Awesome Chart",
    data: data,
    type: 'axis-mixed', // or 'bar', 'line', 'scatter', 'pie', 'percentage'
    height: 250,
    colors: ['#7cd6fd', '#743ee2']
})
```

## Demo
Here's a demo to try out yourself:
<iframe
    class="mt-3"
    src="https://codesandbox.io/embed/frappe-charts-demo-viqud?autoresize=1&codemirror=1&fontsize=14"
    style="width:100%; height:500px; border: 1px solid rgba(0, 0, 0, 0.125); border-radius: 4px; overflow:hidden;"
    title="frappe-charts-demo"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>