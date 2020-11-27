/// <reference types="cypress" />

describe('Login page', () => {
    before('visit the page', () => {
        cy.visit('/');
    });
    before('clear the cookie', () => {
        cy.clearCookie('token', {log: true});
    });
    beforeEach('alias form input fields', () => {
        cy.get('input[type=email]').as('email');
        cy.get('input[type=password]').as('password');
    });
    it('should be unlogged', () => {
        cy.contains('Login').should('exist');
    });
    it('should move to the login page', () => {
        cy.contains('Login').click();
        cy.url().should('contains', '/login');
    });
    it('should display login modal', () => {
        cy.get('@email').should('exist');
        cy.get('@password').should('exist');
        cy.get('.btn').contains('Login').should('exist');
    });
    it('should be in invalid state when the email does not follow the pattern', () => {
        cy.get('@email').focus().type('mypartial');
        cy.get('@password').focus();
        cy.get('input[type=email]:invalid').should('exist');
    });
    it('should complete the invalid email', () => {
        cy.get('@email').focus().type('@email.com');
        cy.get('@password').focus();
        cy.get('input[type=email]:invalid').should('not.exist');
    });
    it('should input a non visible password', () => {
        const pass = 'my_password?!';
        cy.get('@password').focus().type(pass);
        cy.contains(pass).should('not.exist');
    });
});

describe('Login with server interaction', () => {
    beforeEach(() => {
        // before each test, we can automatically preserve the
        // 'token' cookie. this means it will not be cleared before the NEXT test starts.
        Cypress.Cookies.preserveOnce('token');
    })
    before('clear the db', () => {
        cy.db('clear');
    });
    it('should properly login with valid credentials', () => {
        cy.login('student', { clear: false });
        cy.getCookie('token').should('exist');
    });
    it('should be able to visit protected page', () => {
        cy.visit('/calendar');
        cy.contains('today').should('exist');
    });

    describe('Login with different roles', () => {
        before('visit the page', () => {
            cy.visit('/');
        });
        before('clear the cookie', () => {
            cy.clearCookie('token', {log: true});
        });
        beforeEach('clear the db', () => {
            cy.db('clear');
        });
        it('should properly login as a student', () => {
            cy.login('student', { clear: false });
            cy.getCookie('token').should('exist');
        });
        it('should properly login as a teacher', () => {
            cy.login('teacher', { clear: false });
            cy.getCookie('token').should('exist');
        });
    });

});

