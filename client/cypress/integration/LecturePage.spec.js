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
        it('has waiting state column working properly', () => {
            cy.get('thead > tr > :nth-child(4)').contains('Waiting list');
            cy.get('tbody > :nth-child(1) > :nth-child(4)').contains('No');
            cy.get('tbody > :nth-child(3) > :nth-child(4)').contains('Yes');
        })
    })

    // FROM HERE
    /* describe('cancel lecture',()=>{
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

        it('has no red alert if not cancelled', () => {
            cy.contains('This lecture has been cancelled!').should('not.exist');
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

        it('cancelled lecture has red alert', () => {
            cy.contains('This lecture has been cancelled!');
        })

        // TO HERE
        it('button is not visible less than one hour before', () => {
            cy.intercept('GET','/api/lectures/1', { fixture: 'lecture1.json' }).as('getLecture')
            cy.clock(Date.UTC(2020,10,19,7,0),['Date'])
            cy.visit('/lectures/1');
            cy.wait('@getLecture');
            cy.contains('Cancel lecture').should('not.exist');
        })
    }) */

    testCancelAndRemote('cancel');
    testCancelAndRemote('remote');
    // AND FROM HERE
    /* describe('change to remote lecture',()=>{
        beforeEach('visit page', () => {
            cy.intercept('GET','/api/user', { fixture: 'teacher1.json'})
            cy.intercept('GET','/api/lectures/1/bookings', { fixture: 'lecture1bookings.json' })
            
        });

        it('button visible more than 30 minutes before', () => {
            cy.intercept('GET','/api/lectures/1', { fixture: 'lecture1.json' }).as('getLecture')
            cy.clock(Date.UTC(2020,10,19,6,0),['Date'])
            cy.visit('/lectures/1');
            cy.wait('@getLecture');
            cy.contains("Change to distance lecture");
        })

        it('has no yellow alert if not remote', () => {
            cy.contains('REMOTE LECTURE').should('not.exist');
        })

        it('load lecture not remote', () => {
            cy.intercept('GET','/api/lectures/1', {fixture:'lecture1.json'}).as('getLecture')
            cy.clock(Date.UTC(2020,10,19,6,0),['Date'])
            cy.visit('/lectures/1');
            cy.wait(['@getLecture']);
        })

        it('button changes lecture to remote when clicked more than 30 minutes before', () => {
            cy.intercept('PATCH','/api/lectures/1',{
                statusCode: 200,
                body: ''
              }).as('patchLecture');
            cy.intercept('GET','/api/lectures/1', {fixture:'lecture1remote.json'}).as('getLectureAfterRemote');//FIXME cypress does not like this for some reason
            cy.contains("Change to distance lecture").click();
            cy.wait('@patchLecture');
            cy.wait('@getLectureAfterRemote');
            cy.contains('Change to distance lecture').should('not.exist')
        })

        it('cancelled lecture has yellow alert', () => {
            cy.contains('REMOTE LECTURE');
        })

        // TO HERE
        it('text for bookings changed', () => {
            cy.contains("This lecture has been changed from 'presence' to `remote`. There were 3 bookings out of 35 available seats.");
        })

        it('button is not visible less than 30 minutes before', () => {
            cy.intercept('GET','/api/lectures/1', { fixture: 'lecture1.json' }).as('getLecture')
            cy.clock(Date.UTC(2020,10,19,7,30),['Date'])
            cy.visit('/lectures/1');
            cy.wait('@getLecture');
            cy.contains('Change to distance lecture').should('not.exist');
        })
    }) */

    function testCancelAndRemote(status){
        describe(status==='cancel'? 'cancel lecture':'change to remote lecture',()=>{
            beforeEach('visit page', () => {
                cy.intercept('GET','/api/user', { fixture: 'teacher1.json'})
                cy.intercept('GET','/api/lectures/1/bookings', { fixture: 'lecture1bookings.json' })
                
            });
    
            it(`button visible more than ${status==='cancel'?'one hour':'30 minutes'} before`, () => {
                cy.intercept('GET','/api/lectures/1', { fixture: 'lecture1.json' }).as('getLecture')
                cy.clock(Date.UTC(2020,10,19,6,0),['Date'])
                cy.visit('/lectures/1');
                cy.wait('@getLecture');
                cy.contains(`${status==='cancel'?'Cancel lecture':'Change to distance lecture'}`);
            })
    
            if(status==='cancel'){
                it('has no red alert if not cancelled', () => {
                cy.contains('This lecture has been cancelled!').should('not.exist');
            })
            }
            if(status==='remote'){
                it('has no yellow alert if not remote', () => {
                    cy.contains('REMOTE LECTURE').should('not.exist');
                })
            }
            
    
            it(`load lecture not ${status==='cancel'? 'cancelled':'remote'}`, () => {
                cy.intercept('GET','/api/lectures/1', {fixture:'lecture1.json'}).as('getLecture')
                cy.clock(Date.UTC(2020,10,19,6,0),['Date'])
                cy.visit('/lectures/1');
                cy.wait(['@getLecture']);
            })
    

            it(`${status==='cancel'?'button cancels lecture when clicked more than one hour before':
            'button changes lecture to remote when clicked more than 30 minutes before'}`, () => {
                if(status==='cancel'){
                    cy.intercept('DELETE','/api/lectures/1',{
                    statusCode: 200,
                    body: 'it worked!'
                  }).as('deleteLecture');
                cy.intercept('GET','/api/lectures/1', {fixture:'lecture1deleted.json'}).as('getLectureAfterDelete');//FIXME cypress does not like this for some reason
                cy.contains("Cancel lecture").click();
                cy.wait('@deleteLecture');
                cy.wait('@getLectureAfterDelete');
                cy.contains('Cancel lecture').should('not.exist')
                }
                else if(status==='remote'){
                    cy.intercept('PATCH','/api/lectures/1',{
                        statusCode: 200,
                        body: ''
                      }).as('patchLecture');
                    cy.intercept('GET','/api/lectures/1', {fixture:'lecture1remote.json'}).as('getLectureAfterRemote');//FIXME cypress does not like this for some reason
                    cy.contains("Change to distance lecture").click();
                    cy.wait('@patchLecture');
                    cy.wait('@getLectureAfterRemote');
                    cy.contains('Change to distance lecture').should('not.exist')
                }
                
            })
    
            it(`${status==='cancel'? 'cancelled lecture has red alert' :'remote lecture has yellow alert' }`, () => {
                cy.contains(`${status==='cancel'? 'This lecture has been cancelled!' : 'REMOTE LECTURE' }`);
            })
    })}
    
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