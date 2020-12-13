/// <reference types="cypress" />
import React from 'react'

const setupInterceptTeacher = function () {
    // lectures info
    cy.fixture('teacher1').as('teacher').then(function (teacher) {
        this.teacher = teacher;
        cy.intercept('/api/user', { statusCode: 200, body: teacher });
        cy.intercept('/api/login', teacher);
    });
    cy.fixture('bookingsExample').as('bookings').then(function (bookings) {
        this.bookings = bookings;
        cy.intercept({ pathname: /\/api\/bookings/ }, bookings);
    });

    // user info
}


describe('Statistics tests', () => {

    // SOME GENERIC FUNCTIONS

    const settings = function (role) {
        // if (role==='student')setupInterceptStudent(); BOOKING MANAGER
        cy.clock(Date.UTC(2020, 11, 17), ['Date']);
        cy.visit('/statistics');
    }

    before('intercept routes', function () {
        setupInterceptTeacher();
        settings();
    }); 

    it('has working time frame elements', () => {
        cy.contains("Time frame:").should('exist');
        // cy.get('input[value=""]').should('not.exist');
        // cy.get('input[value=""]').should('not.exist');
        cy.contains('All-time').should('exist').click();
        cy.get('input[value=""]').should('exist');
        cy.get('input[value=""]').should('exist');
    })


});

