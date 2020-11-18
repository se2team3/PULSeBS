/// <reference types="cypress" />
import React from 'react';

describe('Calendar page', () => {
  describe('calendar student basic interface, mock API',()=>{
        before('visit page', () => {
            cy.route2('/api/students/1/lectures', { fixture: 'list_of_lectures.json' })
            cy.visit('/calendar');
        });
        it('has header presence', () => {
            cy.contains("Nov 16 – 22, 2020");
        })
       
   
        it('has toolbar', () => {
            cy.get(<div class="fc-header-toolbar fc-toolbar fc-toolbar-ltr"></div>)
            
        });

        it('has events', () => {
            cy.get(<div class="fc-event-main"></div>)
            
        });

        it('has lecture presence', () => {
            cy.contains("Analysis II");
        })

        it('has well closing modal', () => {
            cy.contains("Analysis II").click()
            cy.contains("Close").click()
            cy.contains("Booking closed").should('not.exist');
        })

        it('can book a seat', ()=>{
            cy.contains("Circuit").click()
            cy.contains("Book").click()
            //cy.contains("Circuit").click()    //to be enabled after login
            //cy.contains("Book").should('not.exist');
        });

        it('has checkboxes ',() =>{
            cy.get (<div class="form-check"></div>)
        })

        it('has working checkboxes ',() =>{
            cy.get ("input").eq(1).click();
            cy.contains("ROOM3").should('not.exist');
            cy.contains("ROOM5").should('not.exist');
            cy.get ("input").eq(1).click();
            cy.contains("ROOM3").should('exist');
            cy.contains("ROOM5").should('exist');
        })

        

    });


    describe('calendar student interface with timeframe, mock API',()=>{
        before('visit page', () => {
            cy.route2('/api/students/1/lectures?from=2020-11-16&to=2020-11-22', { fixture: 'list_of_lectures.json' })
            cy.visit('/calendar');
        });

        it('has toolbar', () => {
            cy.get(<div class="fc-header-toolbar fc-toolbar fc-toolbar-ltr"></div>)
            
        });
        it('has header presence', () => {
            cy.contains("Nov 16 – 22, 2020");
        })

        it('has backward button working', () => {
            cy.get ("button").eq(1).click();
            cy.contains("Nov 16 – 22, 2020").should('not.exist');
            cy.contains("ROOM4").should('not.exist');
            cy.get ("button").eq(2).click();
        })

        it('has forward button working', () => {
            
            cy.get ("button").eq(2).click();
            cy.contains("Nov 16 – 22, 2020").should('not.exist');
            cy.contains("ROOM4").should('not.exist');
            cy.get ("button").eq(1).click();
        })

        it('has today button working', () => {
            
            cy.get ("button").eq(2).click();
            cy.get(<a class="fc-col-header-cell-cushion ">Wed 11/18</a>).should('not.be.visible')
            cy.get ("button").eq(3).click();
            cy.get(<a class="fc-col-header-cell-cushion ">Wed 11/18</a>)
        })

        it('has list button working', () => {
            
            cy.get ("button").eq(5).click();
            cy.contains("November 17, 2020").should('exist');
            cy.get ("button").eq(4).click();
            
        })

        it('has month button working', () => {
            
            cy.get ("button").eq(6).click();
            cy.get(<div class="fc-daygrid-day-frame fc-scrollgrid-sync-inner"></div>)
            cy.get ("button").eq(4).click();
            
        })

        

    }); 

   describe('calendar teacher basic interface, mock API',()=>{
        before('visit page', () => {
            cy.route2('/api/teachers/1/lectures', { fixture: 'list_of_lectures.json' })
            cy.visit('/calendar');
            /* cy.visit('/');
            cy.contains('Login').should('exist');
            cy.contains('Login').click();
            cy.url().should('contain', '/api/login');
            cy.get('#username').should('exist');
            cy.get('#password').should('exist');
            cy.get('.btn').contains('Login').should('exist');
            cy.get('#username').focus().clear()
            .type('Agnese_Ciavarella33@pulsebs.com');
            cy.get('#password').focus().clear()
            .type('Ymksb0EPfofb17m')
            .type('{enter}');
            cy.getCookie('token').should('exist');
            cy.url().should('match', '/') */;
        });
        it('has header presence', () => {
            cy.contains("Nov 16 – 22, 2020");
        })
        it('has correct number of lectures', () => {
            const rows = Cypress.$('tbody tr');
            expect(rows.length).to.equal(27);  
        }) 
        it('has lecture presence', () => {
            cy.contains("Analysis II");
        })
        
        

        it('has events', () => {
            cy.get(<div class="fc-event-main"></div>)
            
        });
         it('has checkboxes ',() =>{
            cy.get (<div class="form-check"></div>)
        })

        it('has working checkboxes ',() =>{
            cy.get ("input").eq(1).click();
            cy.contains("ROOM3").should('not.exist');
            cy.contains("ROOM5").should('not.exist');
            cy.get ("input").eq(1).click();
            cy.contains("ROOM3").should('exist');
            cy.contains("ROOM5").should('exist');
        })
        it('has lecture page', () => {
            cy.contains("Analysis II").click()
            cy.url().should('contain', '/lecture');
            
        })
    });

        describe('calendar teacher interface with timeframe, mock API',()=>{
            before('visit page', () => {
                cy.route2('/api/teachers/1/lectures?from=2020-11-16&to=2020-11-22', { fixture: 'list_of_lectures.json' })
               // cy.route2('/api/teachers/1/lectures', { fixture: 'list_of_lectures.json' })
                cy.visit('/calendar');
            });
            it('has header presence', () => {
                cy.contains("Nov 16 – 22, 2020");
            })

            it('has backward button working', () => {
            cy.get ("button").eq(1).click();
            cy.contains("Nov 16 – 22, 2020").should('not.exist');
            cy.contains("ROOM4").should('not.exist');
            cy.get ("button").eq(2).click();
        })

        it('has forward button working', () => {
            
            cy.get ("button").eq(2).click();
            cy.contains("Nov 16 – 22, 2020").should('not.exist');
            cy.contains("ROOM4").should('not.exist');
            cy.get ("button").eq(1).click();
        })

        it('has today button working', () => {
            
            cy.get ("button").eq(2).click();
            cy.get(<a class="fc-col-header-cell-cushion ">Wed 11/18</a>).should('not.be.visible')
            cy.get ("button").eq(3).click();
            cy.get(<a class="fc-col-header-cell-cushion ">Wed 11/18</a>)
        })

        it('has list button working', () => {
            
            cy.get ("button").eq(5).click();
            cy.contains("November 17, 2020").should('exist');
            cy.get ("button").eq(4).click();
            
        })

        it('has month button working', () => {
            
            cy.get ("button").eq(6).click();
            cy.get(<div class="fc-daygrid-day-frame fc-scrollgrid-sync-inner"></div>)
            cy.get ("button").eq(4).click();
            
        })
            

       } );
    
    
})