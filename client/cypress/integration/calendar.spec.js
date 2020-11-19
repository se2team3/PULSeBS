/// <reference types="cypress" />
import React from 'react';

describe('Calendar page', () => {
    let sharedTest =  function(){
        it('has header presence', () => {
            cy.contains("Nov 16 – 22, 2020");
        })

        it('has backward button working', () => {
            cy.get ("button").eq(1).click();
            cy.contains("Nov 16 – 22, 2020").should('not.exist');
            //cy.contains("ROOM4").should('not.exist');
            cy.get ("button").eq(2).click();
        })

        it('has forward button working', () => {
            
            cy.get ("button").eq(2).click();
            cy.contains("Nov 16 – 22, 2020").should('not.exist');
            //cy.contains("Aula 49").should('not.exist');
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
            cy.contains("November 21, 2020").should('exist');
            cy.get ("button").eq(4).click();
            
        })

        it('has month button working', () => {
            
            cy.get ("button").eq(6).click();
            cy.get(<div class="fc-daygrid-day-frame fc-scrollgrid-sync-inner"></div>)
            cy.get ("button").eq(4).click();
            
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
            cy.contains("Nov 16 – 22, 2020");
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
            cy.contains("Aula 20 free").click()
            cy.contains("Book").click()
            //cy.contains().click()    //to be enabled after login
           // cy.contains("Aula 20 free").should('not.exist');
        });

        checkboxesTest();

    });


   describe('calendar student interface with timeframe, real API',()=>{
        before('visit page', () => {
            cy.visit('/');
            cy.get('#username').focus().clear()
            .type('Elvino32@pulsebs.com');
            cy.get('#password').focus().clear()
            .type('z8mwdz9xqWgaLRf')
            .type('{enter}');
            
            
        });

        it('has toolbar', () => {
            cy.get(<div class="fc-header-toolbar fc-toolbar fc-toolbar-ltr"></div>)
            
        });
        sharedTest();

        

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
            cy.contains("Nov 16 – 22, 2020");
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
           
        })

        /* it('has lecture page', () => {
            cy.contains("beatae").click()
            cy.url().should('contain', '/lectures/33');
            
        }) */
    });

     /*   describe('calendar teacher interface with timeframe, mock API',()=>{
            before('visit page', () => {
                cy.route2('/api/teachers/1/lectures?from=2020-11-16&to=2020-11-22', { fixture: 'list_of_lectures.json' })
                cy.visit('/calendar');
            });
            sharedTest();
            

       } );*/
    
    
})