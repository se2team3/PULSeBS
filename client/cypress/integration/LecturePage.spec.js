/// <reference types="cypress" />

describe('Lecture page', () => {
    describe('presence lecture with bookings',()=>{
        before('visit page', () => {
            cy.intercept('/api/user', { fixture: 'teacher1.json'})
            cy.intercept('/api/lectures/1/bookings', { fixture: 'lecture1bookings.json' })
            cy.intercept('/api/lectures/1', { fixture: 'lecture1.json' })
            cy.visit('/lectures/1');
        });
        it('has course name', () => {
            cy.contains("Lecture of Physics I");
        })
        it('has correct number of bookings', () => {
            const rows = Cypress.$('tbody tr');
            expect(rows.length).to.equal(3);
        })
    })

    describe('cancel lecture',()=>{
        beforeEach('visit page', () => {
            cy.intercept('/api/user', { fixture: 'teacher1.json'});
            cy.intercept('/api/lectures/1/bookings', { fixture: 'lecture1bookings.json' });
            cy.intercept('/api/lectures/1', { fixture: 'lecture1.json' }).as('getLecture');
        });

        it('button visible more than one hour before', () => {
            cy.clock(Date.UTC(2020,10,19,6,0),['Date'])
            cy.visit('/lectures/1');
            cy.wait('@getLecture');
            cy.contains("Cancel lecture");
        })

        it('button is not visible less than one hour before', () => {
            cy.clock(Date.UTC(2020,10,19,7,0),['Date'])
            cy.visit('/lectures/1');
            cy.wait('@getLecture');
            cy.contains('Cancel lecture').should('not.exist')
        })
    })
    
    /*describe('presence lecture with bookings, real API',()=>{
        before('visit page', () => {
            cy.visit('/lectures/1');
        });
        it('has course name', () => {
            cy.contains("Lecture of Physics I");
        })
        it('has correct number of bookings', () => {
            const rows = Cypress.$('tbody tr');
            expect(rows.length).to.equal(3);
        })
    })*/
})