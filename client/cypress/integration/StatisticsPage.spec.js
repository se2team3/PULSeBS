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

    it('has working month aggregation', () => {
        cy.contains("Aggregation level:").should('exist');

        // Test month
        cy.get('button[id="0"]').should('not.exist') // November 2020
        cy.get('button[id="1"]').should('not.exist') // December 2020
        cy.get('input[id="Month"]').should('exist').click();
        cy.contains('November 2020').should('exist') // Now it should exist
        cy.contains('December 2020').should('exist') // Now it should exist

        cy.get('button[id="0"]').should('exist').click() // November 2020
        cy.get('h1').contains('November 2020').should('exist')
        cy.get('h4').contains('You have selected 30 lectures').should('exist')
        cy.contains('Bookings statistics').should('exist')
        cy.contains('Free seats(avg)').should('exist')
        cy.contains('Bookings(avg)').should('exist')
        cy.get('button').contains('Bar chart').should('exist')

        // Switch view to scatter chart
        cy.get('button').contains('Scatter chart').should('exist').click()
        cy.contains('Bookings trends').should('exist') 
        cy.contains('Free seats(avg)').should('not.exist')
        cy.contains('Bookings(avg)').should('not.exist')
        cy.contains('% bookings/total number of seats').should('exist')

    })

    it('has working week aggregation', () => {

        // Test week
        cy.contains('Week 15/11/2020 - 21/11/2020').should('not.exist') // November 2020
        cy.contains('Week 22/11/2020 - 28/11/2020').should('not.exist') // December 2020
        cy.get('input[id="Week"]').should('exist').click();
        cy.contains('Week 15/11/2020 - 21/11/2020').should('exist') // November 2020
        cy.contains('Week 22/11/2020 - 28/11/2020').should('exist') // December 2020

        cy.get('button').contains('Week 22/11/2020 - 28/11/2020').click() // it contains all the lectures
        cy.get('h1').contains('Week 22/11/2020 - 28/11/2020').should('exist')
        cy.get('h4').contains('You have selected 22 lectures').should('exist')
        cy.get('svg').contains('Programming techniques').should('exist')

        cy.get('button').contains('Week 15/11/2020 - 21/11/2020').click() // it contains all the lectures
        cy.get('h1').contains('Week 15/11/2020 - 21/11/2020').should('exist')
        cy.get('h4').contains('You have selected 5 lectures').should('exist')
        cy.get('svg').contains('Programming techniques').should('not.exist')
        
    })
    
    it('has working lecture aggregation', () => {
        
        // Test lecture
        let numbers = Array.from(Array(12), (_,x) => x+19); // numbers from 19 to 30
        cy.get('input[id="Lecture"]').should('exist').click();
        numbers.forEach((n)=>cy.contains(`Lecture ${n} November 2020`).should('exist'));

        cy.get('button').contains('Lecture 19 November 2020').click() // it contains all the lectures
        cy.get('h1').contains('Lecture 19 November 2020').should('exist')
        cy.get('h4').contains('You have selected 2 lectures').should('exist')
        cy.get('button').contains('Bar chart').should('exist').click()
        
        cy.get('svg').contains('Chemistry').should('exist')
        cy.get('svg').contains('Computer Sciences').should('exist')
        cy.contains('To see lectures trend, please select a larger timeframe.').should('not.exist')
        cy.get('button').contains('Scatter chart').should('exist').click()
        cy.contains('To see lectures trend, please select a larger timeframe.').should('exist')

        
    })


    it('has working courses list', () => {
        
        // Test lecture
        cy.get('h2').contains('Courses').should('exist') // checl coruse header presence
        cy.contains('Analysis I').scrollIntoView().should('be.visible')
        cy.get('button').contains('Lecture 29 November 2020').should('exist')
        cy.get('input[id="check-24"]').click()  
        cy.get('button').contains('Lecture 29 November 2020').should('not.exist')
    })
    



});

