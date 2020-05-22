<!-- add-breadcrumbs -->
# UI Integration Testing

You can write integration tests using [Cypress](https://cypress.io). It is a NodeJS based full-stack testing framework which doesn't rely on Selenium.

To write integration tests, create a `.js` file in the `cypress/integration` directory.

### Example

Here is an example of an integration test to check insertion of a To Do

```js
context('ToDo', () => {
	before(() => {
		cy.login('Administrator', 'admin');
		cy.visit('/desk');
	});

	it('creates a new todo', () => {
		cy.visit('/desk#Form/ToDo/New ToDo 1');
		cy.fill_field('description', 'this is a test todo', 'Text Editor').blur();
		cy.get('.page-title').should('contain', 'Not Saved');
		cy.get('.primary-action').click();
		cy.visit('/desk#List/ToDo');
		cy.location('hash').should('eq', '#List/ToDo/List');
		cy.get('.list-row').should('contain', 'this is a test todo');
	});
});
```

### Running Cypress Locally

Cypress uses any chromium based browser installed on your system to run tests. Every app has it's own cypress test suite.
For example, to run test for the `frappe` app, run the following commands

```sh
cd ~/frappe-bench/apps/frappe
yarn cypress:open
```

This will open the Cypress Electron shell where you can run any test manually or run all of the tests.

<img src="/docs/assets/img/running-cypress-tests.gif" class="screenshot">
