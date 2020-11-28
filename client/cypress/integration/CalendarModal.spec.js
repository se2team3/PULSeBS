describe('Calendar modal to book a lecture or cancel a booking',()=>{
    before('visit page', () => {
        cy.clock(Date.UTC(2020,10,17),['Date'])
        cy.intercept('/api/user', { fixture: 'student1.json'})
        cy.intercept('/api/students/1/lectures', {fixture: 'lecturesCalendarModal.json'})
        cy.visit('/calendar');
    });
    describe('book a lecture and then cancel it',()=>{
        it('find a free lecture', () => {
            cy.clock(Date.UTC(2020,10,17),['Date'])
            cy.contains("free").click();
            cy.contains("available seats");
        })
        it('book a seat', () => {
            cy.clock(Date.UTC(2020,10,17),['Date'])
            cy.intercept('/api/students/1/lectures', {fixture: 'lecturesCalendarModalBooked.json'}).as('getAfterBooked')
            cy.intercept('/api/students/1/bookings', {
                statusCode: 201,
                body: 'it worked!'
              })
            cy.contains("Book a seat").click();
            cy.wait('@getAfterBooked');
            cy.contains("Circuit Theory").click();
            cy.contains("You have booked a seat for this lecture")
            cy.contains("Cancel booking");
        })
        it('cancel booking', () => {
            cy.clock(Date.UTC(2020,10,17),['Date'])
            cy.intercept('/api/students/1/lectures', {fixture: 'lecturesCalendarModal.json'}).as('getAfterCancel')
            cy.intercept('/api/students/1/bookings', {
                statusCode: 200,
                body: 'it worked!'
              })
            cy.contains("Cancel booking").click();
            cy.wait('@getAfterCancel');
            cy.contains("Circuit Theory").click();
            cy.contains("available seats");
            cy.contains("Book a seat");
            cy.contains("Close").click();
        })
    })
})