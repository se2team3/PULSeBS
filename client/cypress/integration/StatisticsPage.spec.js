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
        cy.intercept({ pathname: /\/api\/teachers/ }, bookings);
    });

    // user info
}


const setupInterceptBookingManager = function () {
    // lectures info
    cy.fixture('bookingManager').as('bm').then(function (bm) {
        this.bm = bm;
        cy.intercept('/api/user', { statusCode: 200, body: bm });
        cy.intercept('/api/login', bm);
    });
    cy.fixture('bookingManagerLectures').as('bookings').then(function (bookings) {
        this.bookings = bookings;
        cy.intercept({ pathname: /\/api\/lectures/ }, bookings);
    });

    // user info
}

describe('Statistics tests', () => {

    const settings = function (role) {
        cy.clock(Date.UTC(2020, 11, 17), ['Date']);
        cy.visit('/statistics');
    }

    testStatistics('teacher');
    testStatistics('booking manager');

    function testStatistics(role){
    
        describe(`${role} statistics`, () => {

            before('intercept routes', function () {
                setupInterceptTeacher();
                if(role==='teacher')setupInterceptTeacher()
                else setupInterceptBookingManager();
                settings();
            });

            it('has working time frame elements', () => {

                cy.contains("Time frame").should('exist');
                cy.get('input[aria-label="Start Date"]').should('exist');
                cy.get('input[value="10/12/2020"]').should('exist'); // Current start date is 10/12
                cy.get('input[value="17/12/2020"]').should('exist'); // Current end date is 10/12
        
                cy.get('div[aria-label="Calendar"]').should('not.exist'); // Calendar is closed
                cy.get('input[aria-label="Start Date"]').click(); // Opens calendar
                cy.get('div[aria-label="Calendar"]').should('exist')
        
                // selects time frame from calendar (22 Dec - 29 Dec)
                cy.get('td[aria-label="Choose Tuesday, December 22, 2020 as your check-in date. It’s available."]').should('exist').click()
                cy.get('td[aria-label="Choose Tuesday, December 29, 2020 as your check-out date. It’s available."]').should('exist').click()
        
                // verify time frame has been changed
                cy.get('input[value="10/12/2020"]').should('not.exist'); // Current start date is 10/12
                cy.get('input[value="17/12/2020"]').should('not.exist'); // Current end date is 10/12
                cy.get('input[value="22/12/2020"]').should('exist'); // Current start date is 10/12
                cy.get('input[value="29/12/2020"]').should('exist'); // Current end date is 10/12
        
                cy.contains('All-time').should('exist').click();
            })

            it('has working month aggregation', () => {
                cy.contains("Aggregation level").should('exist');
        
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
        
                if(role==='booking manager') cy.contains('Cancellations(avg)').should('not.exist') // BM only
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
                numbers.forEach((n)=>cy.contains(`Lecture ${n}/11/20`).should('exist'));
        
                cy.get('button').contains('Lecture 19/11/20 16:00 Computer Sciences').click() // it contains all the lectures
                cy.get('h1').contains('Lecture 19/11/20 16:00 Computer Sciences').should('exist')
                cy.get('h4').contains('You have selected 1 lectures').should('not.exist')
                cy.get('button').contains('Bar chart').should('exist').click()
                
                cy.get('svg').contains('Computer Sciences').should('exist')
                cy.contains('To see lectures trend, please select a larger timeframe.').should('not.exist')
                cy.get('button').contains('Scatter chart').should('exist').click()
                cy.contains('To see lectures trend, please select a larger timeframe.').should('exist')
                
            })
        
        
            it('has working courses list', () => {
                
                // Test lecture
                cy.contains('Courses').should('exist') // checl coruse header presence
                cy.contains('Analysis I').scrollIntoView().should('be.visible')
                cy.get('button').contains('Lecture 29/11/20 17:30 Analysis I').should('exist')
        
                cy.get('input[id="check-24"]').click()  // clicks on Analysis I checkbox
                cy.get('button').contains('Lecture 29/11/20 17:30 Analysis I').should('not.exist')
            })
            
            it('deletes from graph unchecked courses',()=>{
                 // Test lecture
                 cy.get('button').contains('Bar chart').should('exist').click()
                 cy.contains('You have selected 1 lectures').should('not.exist')
                 cy.get('svg').contains('Computer Sciences').should('exist')
        
                 cy.get('fieldset > .form-group').contains("Week").click();
                 cy.contains("Week 22/11/2020 - 28/11/2020").click();
                 
                 // Cancels data about Computer Sciences 
                 cy.get('input[id="check-33"]').click()  // clicks on Computer Sciences checkbox
                 cy.get('svg').contains('Computer Sciences').should('not.exist')
                 cy.get('h4').contains('You have selected 14 lecture').should('exist')
        
                 // Cancels data about Chemistry
                 cy.get('input[id="check-18"]').click()  // clicks on Chemistry checkbox
                 cy.get('svg').contains('Chemistry').should('not.exist')
                 cy.get('h4').contains('You have selected 18 lectures').should('not.exist')
                 cy.get('h4').contains('You have selected 14 lectures').should('not.exist')
                 cy.get('h4').contains('You have selected 9 lecture').should('exist')
        
                 // Restore Computer Sciences and Chemistry
                 cy.get('input[id="check-33"]').click()
                 cy.get('input[id="check-18"]').click()
                 cy.get('svg').contains('Computer Sciences').should('exist')
                 cy.get('svg').contains('Chemistry').should('exist')
                 cy.get('h4').contains('You have selected 18 lectures').should('exist')
            })

            if(role==='booking manager'){

                it('has working search bar',()=>{
        
                    cy.get('input[id="check-33"]').should('exist') // Computer Science checkbox should exist before filtering
                    cy.get('input[id="check-49"]').should('exist') // Programming techniques checkbox should exist before filtering
                    cy.get('input[placeholder="Search for course.."]').should('exist').type('pro')
                    cy.get('input[id="check-33"]').should('not.exist') // Computer Science checkbox should NOT exist after filtering
                    cy.get('input[id="check-49"]').should('exist') // Programming techniques checkbox should exist after filtering
                    cy.get('input[placeholder="Search for course.."]').should('exist').clear()
                    cy.get('input[id="check-33"]').should('exist') // Computer Science checkbox should exist again 
               })
            
               it('has SELECT ALL / DESELECT ALL button working',()=>{
                   cy.get('button').contains('Select All').should('not.exist')
                   cy.get('button').contains('Deselect All').should('exist').click()
            
                   cy.get('button').contains('Deselect All').should('not.exist')
                   cy.get('h4').contains('You have selected 0 lectures').should('exist')
                   cy.get('svg').contains('Computer Sciences').should('not.exist')
                   cy.get('svg').contains('Chemistry').should('not.exist')
            
                   cy.get('button').contains('Select All').should('exist').click()
                   cy.get('h4').contains('You have selected 18 lectures').should('exist')
                   cy.get('svg').contains('Computer Sciences').should('exist')
                   cy.get('svg').contains('Chemistry').should('exist')
                   
               })
            }



        })
    }
});

    // SOME GENERIC FUNCTIONS


    /* before('intercept routes', function () {
        // setupInterceptTeacher();
        setupInterceptBookingManager();
        settings();
    });

    it('has working time frame elements', () => {

        cy.contains("Time frame:").should('exist');
        cy.get('input[aria-label="Start Date"]').should('exist');
        cy.get('input[value="10/12/2020"]').should('exist'); // Current start date is 10/12
        cy.get('input[value="17/12/2020"]').should('exist'); // Current end date is 10/12

        cy.get('div[aria-label="Calendar"]').should('not.exist'); // Calendar is closed
        cy.get('input[aria-label="Start Date"]').click(); // Opens calendar
        cy.get('div[aria-label="Calendar"]').should('exist')

        // selects time frame from calendar (22 Dec - 29 Dec)
        cy.get('td[aria-label="Choose Tuesday, December 22, 2020 as your check-in date. It’s available."]').should('exist').click()
        cy.get('td[aria-label="Choose Tuesday, December 29, 2020 as your check-out date. It’s available."]').should('exist').click()

        // verify time frame has been changed
        cy.get('input[value="10/12/2020"]').should('not.exist'); // Current start date is 10/12
        cy.get('input[value="17/12/2020"]').should('not.exist'); // Current end date is 10/12
        cy.get('input[value="22/12/2020"]').should('exist'); // Current start date is 10/12
        cy.get('input[value="29/12/2020"]').should('exist'); // Current end date is 10/12

        cy.contains('All-time').should('exist').click();
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

        cy.get('input[id="check-24"]').click()  // clicks on Analysis I checkbox
        cy.get('button').contains('Lecture 29 November 2020').should('not.exist')
    })
    
    it('deletes from graph unchecked courses',()=>{
         // Test lecture
         cy.get('button').contains('Bar chart').should('exist').click()
         cy.get('h4').contains('You have selected 2 lectures').should('exist')
         cy.get('svg').contains('Computer Sciences').should('exist')

         // Cancels data about Computer Sciences
         cy.get('input[id="check-33"]').click()  // clicks on Computer Sciences checkbox
         cy.get('svg').contains('Computer Sciences').should('not.exist')
         cy.get('h4').contains('You have selected 2 lectures').should('not.exist')
         cy.get('h4').contains('You have selected 1 lecture').should('exist')

         // Cancels data about Chemistry
         cy.get('input[id="check-18"]').click()  // clicks on Chemistry checkbox
         cy.get('svg').contains('Chemistry').should('not.exist')
         cy.get('h4').contains('You have selected 2 lectures').should('not.exist')
         cy.get('h4').contains('You have selected 1 lecture').should('not.exist')
         cy.get('h4').contains('You have selected 0 lecture').should('exist')

         // Restore Computer Sciences and Chemistry
         cy.get('input[id="check-33"]').click()
         cy.get('input[id="check-18"]').click()
         cy.get('svg').contains('Computer Sciences').should('exist')
         cy.get('svg').contains('Chemistry').should('exist')
         cy.get('h4').contains('You have selected 2 lectures').should('exist')
    })




    
}); */
