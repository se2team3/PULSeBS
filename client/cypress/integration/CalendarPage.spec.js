/// <reference types="cypress" />

describe('Lecture page', () => {
    describe('presence lecture with bookings, mock API',()=>{
        before('visit page', () => {
            cy.route2('/api/lectures/1/bookings', { fixture: 'lecture1bookings.json' })
            cy.route2('/api/lectures/1', { fixture: 'lecture1.json' })
            cy.visit('/calendar');
        });
        it('click on Physics lecture', () => {
            cy.contains("PhysicsROOM4 booked").click();
        })
        /*it('has correct number of bookings', () => {
            const rows = Cypress.$('tbody tr');
            expect(rows.length).to.equal(3);
        })*/
    })
})