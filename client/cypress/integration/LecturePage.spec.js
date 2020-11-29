/// <reference types="cypress" />

describe('Lecture page', () => {
    describe('presence lecture with bookings',()=>{
        before('visit page', () => {
            cy.intercept('GET','/api/user', { fixture: 'teacher1.json'})
            cy.intercept('GET','/api/lectures/1/bookings', { fixture: 'lecture1bookings.json' })
            cy.intercept('GET','/api/lectures/1', { fixture: 'lecture1.json' })
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
            cy.intercept('GET','/api/user', { fixture: 'teacher1.json'})
            cy.intercept('GET','/api/lectures/1/bookings', { fixture: 'lecture1bookings.json' })
            
        });

        it('button visible more than one hour before', () => {
            cy.intercept('GET','/api/lectures/1', { fixture: 'lecture1.json' }).as('getLecture')
            cy.clock(Date.UTC(2020,10,19,6,0),['Date'])
            cy.visit('/lectures/1');
            cy.wait('@getLecture');
            cy.contains("Cancel lecture");
        })

        it('load lecture not cancelled', () => {
            cy.intercept('GET','/api/lectures/1', {fixture:'lecture1.json'}).as('getLecture')
            cy.clock(Date.UTC(2020,10,19,6,0),['Date'])
            cy.visit('/lectures/1');
            cy.wait(['@getLecture']);
        })

        it('button cancels lecture when clicked more than one hour before', () => {
            cy.intercept('DELETE','/api/lectures/1',{
                statusCode: 200,
                body: 'it worked!'
              }).as('deleteLecture');
            cy.intercept('GET','/api/lectures/1', {fixture:'lecture1deleted.json'}).as('getLectureAfterDelete');//FIXME cypress does not like this for some reason
            cy.contains("Cancel lecture").click();
            cy.wait('@deleteLecture');
            cy.wait('@getLectureAfterDelete');
            cy.contains('Cancel lecture').should('not.exist')
        })

        it('button is not visible less than one hour before', () => {
            cy.intercept('GET','/api/lectures/1', { fixture: 'lecture1.json' }).as('getLecture')
            cy.clock(Date.UTC(2020,10,19,7,0),['Date'])
            cy.visit('/lectures/1');
            cy.wait('@getLecture');
            cy.contains('Cancel lecture').should('not.exist');
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