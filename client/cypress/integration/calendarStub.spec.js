/// <reference types="cypress" />

describe('Student calendar', () => {
    /*
    before('Stub lecture\'s list', () => {
        cy.route2('/api/lectures', { fixture: 'list_of_lectures' });
    });
    */
    before('Clear test db', () => {
        cy.db('clear');
    });
    before('Login as a student', () => {
        cy.login('student');
    });
    before('Visit calendar page', () => {
       cy.visit('/calendar');
    });
    before('Aliases', () => {
        cy.wrap('button[aria-label="prev"]').as('prev');
        cy.wrap('button[aria-label="next"]').as('next');
        cy.contains('today').as('today');
        cy.contains('week').as('week');
        cy.contains('list').as('list');
        cy.contains('month').as('month');
    })
    describe('Check calendar rendering', () => {
        it('should contain navigation button', () => {
            cy.get ('@prev').should('exist');
            cy.get ('@next').should('exist');
            cy.get ('@today').should('exist');
            cy.get ('@week').should('exist');
            cy.get ('@list').should('exist');
            cy.get ('@month').should('exist');
        });
    });
});