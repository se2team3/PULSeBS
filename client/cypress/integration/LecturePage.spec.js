/// <reference types="cypress" />

describe('Lecture page', () => {
    describe('presence lecture with bookings',()=>{
        before('visit page', () => {
            cy.route2('/api/lectures/1/bookings', { fixture: 'lecture1bookings.json' })
            cy.route2('/api/lectures/1', { fixture: 'lecture1.json' })
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
})