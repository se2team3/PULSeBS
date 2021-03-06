const setAndClick= function(){
    cy.intercept('/api/students/1/bookings', {
        statusCode: 201,
        body: 'it worked!'
      })
    cy.get('.fc').contains('Physics').click();
}

describe('Calendar modal to book a lecture or cancel a booking',()=>{
    before('visit page', () => {
        cy.clock(Date.UTC(2020,10,17),['Date'])
        cy.intercept('/api/user', { fixture: 'student1.json'})
        cy.intercept('/api/students/1/lectures', {fixture: 'lecturesCalendarModal.json'}).as('getLectures')
        cy.visit('/calendar');
        cy.wait('@getLectures');
    });
    //describe('book a lecture and then cancel it',()=>{
        it('find a free lecture', () => {
            cy.clock(Date.UTC(2020,10,17),['Date'])
            cy.get('.calendar').contains("FREE").click();
            cy.get('.modal-content').contains("available seats");
        })
        it('book a seat', () => {
            cy.clock(Date.UTC(2020,10,17),['Date'])
            cy.intercept('/api/students/1/lectures', {fixture: 'lecturesCalendarModalBooked.json'}).as('getAfterBooked')
            cy.intercept('/api/students/1/bookings', {
                statusCode: 201,
                body: 'it worked!'
              })
            cy.get('.modal-content').contains("Book a seat").should('exist');
            cy.get('.modal-content').contains("Book a seat").click();
            cy.wait('@getAfterBooked')
            cy.wait(1000)
            cy.get('.calendar').contains("Circuit Theory").click();
            cy.get('.modal-content').contains("You have booked a seat for this lecture")
            cy.get('.modal-content').contains("Cancel booking");
        })
        it('cancel booking', () => {
            cy.clock(Date.UTC(2020,10,17),['Date'])
            cy.intercept('/api/students/1/lectures', {fixture: 'lecturesCalendarModal.json'}).as('getAfterCancel')
            cy.intercept('/api/students/1/bookings', {
                statusCode: 200,
                body: 'it worked!'
              })
            cy.get('.modal-content').contains("Cancel booking").click();
            cy.wait('@getAfterCancel');
            cy.wait(1000)
            cy.get('.calendar').contains("Circuit Theory").click();
            cy.get('.modal-content').contains("available seats");
            cy.get('.modal-content').contains("Book a seat");
            cy.get('.modal-content').contains("Close").click();
        })
        it('join waiting list', () => {
            cy.clock(Date.UTC(2020,10,17),['Date'])
            cy.intercept('/api/students/1/lectures', {fixture: 'lecturesCalendarModalWaiting.json'}).as('getAfterWaiting')
            setAndClick();
            cy.get('.modal-body').contains("No available seats right now, you can enter the waiting list if you like. 10 are currently in the waiting list.");
            cy.get('.modal-content').contains("Join waiting list").click();
            cy.wait('@getAfterWaiting');
            cy.wait(1000)
        })
        it('exit waiting list', () => {
            cy.clock(Date.UTC(2020,10,17),['Date'])
            cy.intercept('/api/students/1/lectures', {fixture: 'lecturesCalendarModal.json'}).as('getAfterCancelWaiting')
            setAndClick();
            cy.get('.modal-body').contains("You are currently in the waiting list, there are 10 students before you.");
            cy.get('.modal-content').contains("Exit waiting list").click();
            cy.wait('@getAfterCancelWaiting');
            cy.wait(1000);
            cy.get('.calendar').contains('Physics').parent().contains('FULL');
        })
    //})
})