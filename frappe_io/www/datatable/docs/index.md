<!-- add-next-prev-links -->

# Getting Started

The easiest way to get try Frappe DataTable is using this codesandbox demo.

<iframe
	src="https://codesandbox.io/embed/condescending-lederberg-0mkeg?autoresize=1&fontsize=14&theme=dark"
	style="width:100%; height:500px; border: 1px solid rgba(0, 0, 0, 0.125); border-radius: 4px; overflow:hidden;"
	title="frappe-datatable-demo"
	allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
	sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

## Example using CDN

```html
<!-- include styles -->
<link href="https://unpkg.com/frappe-datatable@0.0.5/dist/frappe-datatable.min.css" rel="stylesheet">

<!-- create the container element -->
<div id="datatable"></div>

<!-- include the dependencies -->
<script src="https://unpkg.com/sortablejs@1.7.0/Sortable.min.js"></script>
<script src="https://unpkg.com/clusterize.js@0.18.0/clusterize.min.js"></script>
<!-- include the lib -->
<script src="https://unpkg.com/frappe-datatable@0.0.5/dist/frappe-datatable.min.js"></script>

<!-- initialize DataTable -->
<script>
  const datatable = new DataTable('#datatable', {
    columns: ['Name', 'Position', 'Salary'],
    data: [
      ['Faris', 'Software Developer', '$1200'],
      ['Manas', 'Software Engineer', '$1400'],
    ]
  });
</script>
```

