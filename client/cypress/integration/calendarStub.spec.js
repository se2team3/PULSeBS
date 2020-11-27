/// <reference types="cypress" />

describe('Student calendar', () => {
    before('Stub lecture\'s list', () => {
        cy.route2('/api/lectures', { fixture: 'list_of_lectures' });
    });
    before('Clear test db', () => {
        cy.db('clear');
    });
    before('Login as a student', () => {
        cy.login('student');
    });
    before('Visit calendar page', () => {
       cy.visit('/calendar');
    });
    describe('Check calendar rendering', () => {
        it('should contain navigation button', () => {
            cy.get ('button[aria-label="prev"]').should('exist');
        });
    });
});