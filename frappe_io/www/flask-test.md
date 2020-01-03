<section class='top-section'>
<h1>Flask Hiring Test</h1>
</section>

### Why this test?

At Frappe, we build applications for the web, so understanding how web applications work, is a pre-requisite for any new engineer. Flask is one of the simplest and well written Python based web application frameworks and can easily be learned in a few hours.

If you have never worked on web applications before, this test will also help you evaluate whether this is something you are skilled at or can easily learn doing.

### Inventory Management Web Application

The goal is to create a web application using Flask framework to manage inventory of a list of products in respective warehouses. Imaging this application will be used in a shop or a warehouse that needs to keep track of various products and various locations

The application should cover following functionalities:

#### Database Tables:

- Product (`product_id`)
- Location (`location_id`)
- ProductMovement (`movement_id`, `timestamp`, `from_location`, `to_location`, `product_id`, `qty`)

Note: Any one, or both of `from_location` and `to_location` can be filled. If you want to move things *into* a location, `from_location` will be blank, if you want to move things *out*, then `to_location` will be blank.

#### Views:

- Add/Edit/View Product
- Add/Edit/View Location
- Add/Edit/View ProductMovement

#### Report:

- Balance quantity in each location

#### Use Cases:

- Create 3/4 Products
- Create 3/4 Locations
- Make ProductMovements
	- Move Product A to Location X
	- Move Product B to Location X
	- Move Product A from Location X to Location Y
	- (make 20 such movements)
- Get product balance in each Location in a grid view, with 3 columns: `Product`, `Warehouse`, `Qty`

### How to Submit

Once this application is ready, push your code to [GitHub](https://github.com) and add a `README.md` file in your repository. Add screenshots showing the screens and reports in your README.

After this, just drop in an email to the engineer who requested you for this test or at [hello@frappe.io](mailto:hello@frappe.io) saying that your project is done.

### Next Steps

After this, we will get in touch with you and you will have to walk us through your code. The evaluation is based on code quality, and the ui. We will then ask for a few changes or additional features that will help us evaluate how well you know your code base.

### Tips to Ace the Code Evaluation

- Build a good UI, with clean forms and reports
- Write concise SQL queries if not using an ORM
- Avoid code duplication, abstract out functions that can be reused

**A word of caution:** In the past, applicants have not done this test themselves and have completely failed to explain or make changes. We know it sounds dumb, but people do such things.

Feel free to ask for help from anyone or just look on the web. Do this project by yourself if you want to sustain a career in programming and technology!

All the best! 👍

### Links

- [http://flask.pocoo.org/docs/1.0/](http://flask.pocoo.org/docs/1.0/)
- [https://dev.mysql.com/doc/mysql-getting-started/en/](https://dev.mysql.com/doc/mysql-getting-started/en/)
- [https://www.python.org/about/gettingstarted/](https://www.python.org/about/gettingstarted/)
- [https://www.codecademy.com/learn/learn-python](https://www.codecademy.com/learn/learn-python)