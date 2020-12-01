/// <reference types="cypress" />

const setupIntercept = () => {
    cy.fixture('student1').as('student').then(function (student) {
        this.student = student;
        cy.intercept('/api/user', { statusCode: 200, body: student});
        cy.intercept('/api/login', student);
    });
    cy.intercept('/api/logout', { statusCode: 200 });
};
/*
 TODO:  here it seems that the beforeEach hook is not executed the first time.
        Try to make it work with a single hook
*/
beforeEach('intercept routes', function () {
    setupIntercept();
});
before('intercept routes', function () {
    setupIntercept();
});

describe('Check rendering', () => {
    before('visit the page', () => {
        cy.visit('/login');
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
    it('should be in invalid state when the email does not follow the pattern', function () {
        cy.get('@email').focus().type(this.student.email.split("@")[0]);
        cy.get('@password').focus();
        cy.get('input[type=email]:invalid').should('exist');
    });
    it('should complete the invalid email', function () {
        cy.get('@email').focus().type(`@${this.student.email.split("@")[1]}`);
        cy.get('@password').focus();
        cy.get('input[type=email]:invalid').should('not.exist');
    });
    it('should input a non visible password', () => {
        const pass = 'not_relevant_since_stubbed';
        cy.get('@password').focus().type(pass);
        cy.contains(pass).should('not.exist');
    });
});

describe('Login into the system', function () {
    it('should submit credentials', () => {
        cy.get('form').submit();
    });
    it('should redirect to the calendar page', () => {
        cy.url().should('include', '/calendar');
        cy.contains('Courses').should('exist');
    });
    it('should show the proper first name in the header', function () {
        cy.contains(this.student.name).should('exist');
    });
});

describe('Logout from the system', function () {
    it('should show logout button', () => {
        cy.contains('Logout').should('exist');
    });
    it('should redirect to the login page', () => {
        cy.contains('Logout').click();
        cy.url().should('include', '/login');
        cy.contains('Login').should('exist');
    });
});
