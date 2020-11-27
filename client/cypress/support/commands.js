// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (userType, options = { clear: true }) => {
    // create the user first in the DB
    cy.request('POST', 'http://localhost:3001/api/test/users', { userType, options })
        .its('body')
        .then((body) => {
            // assuming the server sends back the user details
            // including a randomly generated password
            //
            // we can now login as this newly created user
            cy.request({
                url: 'http://localhost:3001/api/login',
                method: 'POST',
                body: {
                    email: body.email,
                    password: body.password,
                }
            })
        });
})

Cypress.Commands.add('db', (param) => {
    switch (param) {
        case 'clear':
            cy.request('POST', 'http://localhost:3001/api/test/clear');
            break;
        default:
    }
})