/// <reference types="cypress" />

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
        cy.url().should('contains', '/login');
    });
    it('should display login modal', () => {
        cy.get('@email').should('exist');
        cy.get('@password').should('exist');
        cy.get('.btn').contains('Login').should('exist');
    });
    it('should be in invalid state when the email does not follow the pattern', function () {
        cy.get('@email').focus().type('sasdsa');
        cy.get('@password').focus();
        cy.get('input[type=email]:invalid').should('exist');
    });
    it('should complete the invalid email', function () {
        cy.get('@email').focus().type('@pulitu.it');
        cy.get('@password').focus();
        cy.get('input[type=email]:invalid').should('not.exist');
    });
    it('should input a non visible password', () => {
        const pass = 'not_relevant_since_stubbed';
        cy.get('@password').focus().type(pass);
        cy.contains(pass).should('not.exist');
    });
});

describe('Wrong credentials feedback', function () {
    beforeEach('alias form input fields', () => {
        cy.get('input[type=email]').as('email');
        cy.get('input[type=password]').as('password');
    });
    it('should submit wrong credentials', () => {
        cy.intercept('/api/user', { statusCode: 401, body: {} });
        cy.intercept('/api/login', { statusCode: 400, body: { message: "Wrong credentials" } });
        cy.get('@email').focus().clear().type('s123456@pulsebs.com');
        const pass = 'not_relevant_since_stubbed';
        cy.get('@password').focus().clear().type(pass);
        cy.get('form').submit();
    });
    it('should stay on login page', () => {
        cy.url().should('include', '/login');
        cy.contains('Login').should('exist');
    });
    it('should show error alert', function () {
        cy.contains("Wrong credentials")
    });
});

function checkCannotAccess(path){
    it(`should not be able to access ${path}`, () => {
        cy.visit(path);
        cy.contains('Something went wrong');
    })
}

describe('Login into the system as a student', function () {

    before('alias form input fields', () => {
        cy.get('input[type=email]').as('email');
        cy.get('input[type=password]').as('password');
    });
    beforeEach('intercepts', () => {
        cy.intercept('/api/user', { statusCode: 200, fixture: 'student1.json' });
        cy.intercept('/api/login', { statusCode: 200, fixture: 'student1.json' });
    });
    it('should submit credentials', () => {
        cy.get('@email').focus().type('s123456@pulsebs.com');
        const pass = 'not_relevant_since_stubbed';
        cy.get('@password').focus().type(pass);
        cy.get('form').submit();
    });
    it('should redirect to the calendar page', () => {
        cy.url().should('include', '/calendar');
        cy.contains('Courses')
    });
    it('should show the proper first name in the header', function () {
        cy.contains("Mario")
    });

    checkCannotAccess('/statistics');
    checkCannotAccess('/setup');
    checkCannotAccess('/lectures/1');
});

describe('Logout from the system', function () {
    it('should show logout button', () => {
        cy.contains('Logout')
    });
    it('should redirect to the login page', () => {
        cy.intercept('/api/logout', { statusCode: 200 });
        cy.contains('Logout').click();
        cy.url().should('include', '/login');
        cy.contains('Login')
    });
});

describe('Login a teacher', function () {
    before('visit the page', () => {
        cy.visit('/login');
    });
    beforeEach('setup intercept', () => {
        cy.intercept('/api/user', { fixture: "teacher1.json" });
        cy.intercept('/api/login', { fixture: "teacher1.json" });
    });
    it('should complete login', function () {
        cy.get('input[type=email]').focus().type(`s123456@pulsebs.com`);
        cy.get('input[type=password]').focus().type('password');
        cy.get('form').submit();
    });
    it('should redirect to calendar', () => {
        cy.url().should('include', '/calendar');
        cy.contains("Courses");
    });
    it('should show the proper first name in the header', function () {
        cy.contains("Mario");
    });
    it('should be able to access statistics', () => {
        cy.visit('/statistics');
        cy.contains('Time frame');
    })
    checkCannotAccess('/setup');
    it('should be able to access lecture page', () => {
        cy.intercept('GET', '/api/lectures/1/bookings', { fixture: 'lecture1bookings.json' })
        cy.intercept('GET', '/api/lectures/1', { fixture: 'lecture1.json' })
        cy.visit('/lectures/1');
        cy.contains("Lecture of Physics I");
    })
});

describe('Login a booking manager', function () {
    before('visit the page', () => {
        cy.visit('/login');
        cy.intercept('/api/user', { fixture: "manager1.json" });
        cy.intercept('/api/login', { fixture: "manager1.json" });
    });
    it('should complete login', function () {
        cy.get('input[type=email]').focus().type(`bm042@pulsebs.com`);
        cy.get('input[type=password]').focus().type('password');
        cy.get('form').submit();
    });
    it('should redirect to statistics', () => {
        cy.url().should('include', '/statistics'); //FIXME should we redirect to setup?
        cy.contains("Time frame");
    });
    it('should show the proper first name in the header', function () {
        cy.contains("Guido").should('exist');
    });
});

describe('Login an officer', function () {
    before('visit the page', () => {
        cy.visit('/login');
        cy.intercept('/api/user', { fixture: "officer1.json" });
        cy.intercept('/api/login', { fixture: "officer1.json" });
    });
    it('should complete login', function () {
        cy.get('input[type=email]').focus().type(`officer966@pulsebs.com`);
        cy.get('input[type=password]').focus().type('password');
        cy.get('form').submit();
    });
    it('should redirect to setup?', () => {
        cy.url().should('include', '/setup'); //FIXME should we redirect to setup?
        cy.contains("Setup");
    });
    it('should show the proper first name in the header', function () {
        cy.contains("Matteo").should('exist');
    });
    checkCannotAccess('/statistics');
});