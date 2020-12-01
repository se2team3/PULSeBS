/// <reference types="cypress" />

describe('Header tests', () => {
    before('visit the page', () => {
        cy.visit('/');
    });
    before('clear the cookie', () => {
        cy.clearCookie('token', { log: true });
    });
    it('should be unlogged', () => {
        cy.contains('Login').should('exist');
    });
    it('should move to the login page', () => {
        cy.contains('Login').click();
        let regex = new RegExp('\\/login')
        cy.url().should('match', regex);
    });
    it('should display login modal', () => {
        cy.get('#username').should('exist');
        cy.get('#password').should('exist');
        cy.get('.btn').contains('Login').should('exist');
    });
    it('should be focused on email field', () => {
        cy.get('input').first().focus();
        cy.focused().should('have.attr', 'id','username');
    });
    it('should be in invalid state when the email does not follow the pattern', () => {
        cy.focused().type('mypartial');
        cy.get('#password').focus();
        cy.get('#username:invalid').should('exist');
    });
    it('should complete the invalid email', () => {
        cy.get('#username').focus().type('@email.com');
        cy.get('#password').focus();
        cy.get('#username:invalid').should('not.exist');
    });
    it('should input a non visible password', () => {
        const pass = 'my_password?!';
        cy.get('#password').focus().type(pass);
        cy.contains(pass).should('not.exist');
    });
    it('should properly login with valid credentials', () => {
        cy.get('#username').focus().clear()
            .type('valid@email.com');
        cy.get('#password').focus().clear()
            .type('valid_password')
            .type('{enter}');
        cy.getCookie('token');
        // cy.getCookie('token').should('exist');
        let regex = new RegExp('\\/calendar')
        cy.url().should('match', regex);
    });
});
