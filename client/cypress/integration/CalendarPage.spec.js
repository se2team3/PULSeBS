describe('Calendar page',()=>{
    describe('Calendar single event box',()=>{
        before('visit page', () => {
            cy.clock(Date.UTC(2020,10,17),['Date'])
            cy.intercept('/api/user', { fixture: 'student1.json'})
            cy.intercept('/api/students/1/lectures', {fixture: 'lecturesOneFreeOneCancelled.json'}).as('getLectures')
            cy.visit('/calendar');
            cy.wait('@getLectures');
        });
        it('has appropriate styling when cancelled', () => {
            cy.clock(Date.UTC(2020,10,17),['Date'])
            cy.contains('.canceled',"Circuit Theory")
        })
        it('has appropriate styling when not cancelled', () => {
            cy.clock(Date.UTC(2020,10,17),['Date'])
            cy.contains('.canceled',"Chemistry").should('not.exist');
        })
    })
})