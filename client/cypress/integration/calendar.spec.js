/// <reference types="cypress" />
import React from 'react';

import moment from 'moment';
let headerOfCurrentWeek = moment().isoWeekday(1).format('MMM DD'); // 1=Monday -> first monday in this week
let headerOfPrevWeek = moment().isoWeekday(-6).format('MMM DD'); // ex Nov  27
let headerOfNextWeek = moment().isoWeekday(8).format('MMM DD'); // 1=Monday +7 = 8 -> next monday
let anyDayOfList = moment().isoWeekday(3).format('MMMM DD, YYYY'); // wednedsday of current weeek

describe('Calendar page', () => {
    let sharedTest =  function(){
        it('has header presence', () => {
            cy.contains(headerOfCurrentWeek);
        })

        it('has backward button working', () => {
            cy.get ('button[aria-label="prev"]').click();
            cy.contains(headerOfPrevWeek).should('exist');
            cy.contains(headerOfCurrentWeek).should('not.exist');
            cy.get ('button[aria-label="next"]').click(); // return to current week
        })

        it('has forward button working', () => {
            
            // GET LECTURES WEEK BY WEEK TEST
            let begin = moment().isoWeekday(8).format('YYYY-MM-DD'); // monday of next week
            let end = moment().isoWeekday(14).format('YYYY-MM-DD'); // sunday of next week

            cy.server();
            cy.route('GET', `/api/students/194/lectures?from=${begin}&to=${end}`).as('get')
            

            cy.get ('button[aria-label="next"]').click(); // go to next week
            cy.contains(headerOfNextWeek).should('exist');
            cy.wait('@get')
            cy.get('@get').then((res)=>{
                expect(res).to.have.property('status', 401)// unauthorized

                // if logged in
               /*  expect(res).to.have.property('status', 200)
                expect(res.response.body).to.be.a('array') */
            })
        })

        it('has today button working', () => {
            
            cy.get ("button").eq(2).click();
            cy.get(<a class="fc-col-header-cell-cushion ">Wed 11/18</a>).should('not.be.visible')
            cy.get ("button").eq(3).click();
            cy.get(<a class="fc-col-header-cell-cushion ">Wed 11/18</a>)
        })

        it('has list button working', () => {
            
            cy.get ("button").eq(5).click();
            cy.contains(anyDayOfList).should('exist');
            cy.get ("button").eq(4).click();
            
        })

        it('has month button working', () => {
            
            cy.get ("button").eq(6).click();
            cy.get(<div class="fc-daygrid-day-frame fc-scrollgrid-sync-inner"></div>)
            cy.get ("button").eq(4).click();
            
        })
        it('filters BOOKED lectures',()=>{
            cy.get ("input").eq(0).click();
            cy.contains("free").should('not.exist');
            cy.contains("closed").should('not.exist');
            cy.get ("input").eq(0).click();            
        })
    }

    let checkboxesTest = function(){
        it('has checkboxes ',() =>{
            cy.get (<div class="form-check"></div>)
        })

        it('has working checkboxes ',() =>{
            cy.get ("input").eq(0).click();
            cy.contains("Aula 49").should('not.exist');
            cy.get ("input").eq(0).click();
            cy.contains("Aula 49").should('exist');
           
        })
    }

  describe('calendar student basic interface, real API',()=>{
        before('visit page', () => {
            cy.visit('/');
            cy.contains('Login').should('exist');
            cy.contains('Login').click();
            cy.url().should('contain', '/login');
            cy.get('#username').should('exist');
            cy.get('#password').should('exist');
            cy.get('.btn').contains('Login').should('exist');
            cy.get('#username').focus().clear()
            .type('Elvino32@pulsebs.com');
            cy.get('#password').focus().clear()
            .type('z8mwdz9xqWgaLRf')
            .type('{enter}');
            
        });
        it('has header presence', () => {
            cy.contains(headerOfCurrentWeek);
        })
       
   
        it('has toolbar', () => {
            cy.get(<div class="fc-header-toolbar fc-toolbar fc-toolbar-ltr"></div>)
            
        });

        it('has events', () => {
            cy.get(<div class="fc-event-main"></div>)
            
        });

        it('has lecture presence', () => {
            cy.contains("quod ad");
        })

        it('has well closing modal', () => {
            cy.contains("quod ad").click()
            cy.contains("Close").click()
            cy.contains("available").should('not.exist');
        })

        it('can book a seat', ()=>{
            
            /* cy.contains("free").click()
            cy.contains("Book").click() */
            //cy.contains().click()    //to be enabled after login
           // cy.contains("Aula 20 free").should('not.exist');
        });

        sharedTest();
        checkboxesTest();

    });


   describe('calendar teacher basic interface, real API',()=>{
        before('visit page', () => {
            cy.route2('/api/teachers/1/lectures', { fixture: 'list_of_lectures.json' })
            cy.visit('/');
            cy.contains('Login').should('exist');
            cy.contains('Login').click();
            cy.url().should('contain', '/login');
            cy.get('#username').should('exist');
            cy.get('#password').should('exist');
            cy.get('.btn').contains('Login').should('exist');
            cy.get('#username').focus().clear()
            .type('Renzo24@pulsebs.com');
            cy.get('#password').focus().clear()
            .type('Szi8qeikzhN_fge')
            .type('{enter}');
        });
        it('has header presence', () => {
            cy.contains(headerOfCurrentWeek);
        })
        it('has correct number of lectures', () => {
            const rows = Cypress.$('tbody tr');
            expect(rows.length).to.equal(27);  
        }) 
        it('has lecture presence', () => {
            cy.contains("beatae");
        })
        
        

        it('has events', () => {
            cy.get(<div class="fc-event-main"></div>)
            
        });
        it('has working checkboxes ',() =>{
            cy.get ("input").eq(0).click();
            cy.contains("Aula 37").should('not.exist');
            cy.get ("input").eq(0).click();
            cy.contains("Aula 37").should('exist');
           
        });

    })
    
    
})