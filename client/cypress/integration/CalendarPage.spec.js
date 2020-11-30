/// <reference types="cypress" />
import moment from 'moment';
import React from 'react'

const setupInterceptStudent = function () {
    // lectures info
    cy.fixture('list_of_lectures').as('lectures').then(function (lectures) {
        this.lectures = lectures;
        cy.intercept({ pathname: /\/api\/students\/[0-9]+\/lectures/ }, lectures);
    });

    // user info
    cy.fixture('student1').as('student').then(function (student) {
        this.student = student;
        cy.intercept('/api/user', { statusCode: 200, body: student});
        cy.intercept('/api/login', student);
    });
}

const setupInterceptTeacher = function () {
    // lectures info
    cy.fixture('list_of_lecturesTeacher').as('lectures').then(function (lectures) {
        this.lectures = lectures;
        cy.intercept({ pathname: /\/api\/teachers\/[0-9]+\/lectures/ }, lectures);
    });

    // user info
    cy.fixture('teacher1').as('teacher').then(function (teacher) {
        this.teacher = teacher;
        cy.intercept('/api/user', { statusCode: 200, body: teacher});
        cy.intercept('/api/login', teacher);
    });
}




describe('Calendar tests', ()=>{
 
    // SOME GENERIC FUNCTIONS

    const checkboxCourse_on_off =function (lectures){
        cy.contains('Courses').parent().find('[type="checkbox"]').first().uncheck();
        cy.get('.calendar').contains(lectures[0].course_name).should('not.exist');
        cy.contains('Courses').parent().find('[type="checkbox"]').first().check();
        cy.get('.calendar').contains(lectures[0].course_name).should('exist');
    }

    const seeCheckedLectures= function(param){
        //param can be Booked, Remote or both
        cy.get('.calendar').contains('CANCELED').should('not.exist');
        cy.get('.calendar').contains('CLOSED').should('not.exist');
        cy.get('.calendar').contains('FULL').should('not.exist');
        cy.get('.calendar').contains('FREE').should('not.exist');
        if(param=='Booked') 
            cy.get('.calendar').contains('REMOTE').should('not.exist');
        else if(param=='RemoteStudent') 
            cy.get('.calendar').contains('BOOKED').should('not.exist');
        else if (param=='Both'){
            cy.get('.calendar').contains('REMOTE').should('not.exist');
            cy.get('.calendar').contains('BOOKED').should('not.exist');
        }
        else if(param=='RemoteTeacher'){}
    }

    const seeAllLectures= function (param){
        cy.get('[data-cy=booking_status]:contains(CANCELED)').should('have.length', 1);
        cy.get('[data-cy=booking_status]:contains(REMOTE)').should('have.length', 1);
        cy.get('[data-cy=booking_status]:contains(CLOSED)').should('have.length', 1);
        cy.get('[data-cy=booking_status]:contains(FULL)').should('have.length', 1);
        cy.get('[data-cy=booking_status]:contains(FREE)').should('have.length', 2);
        if (param=='student')cy.get('[data-cy=booking_status]:contains(BOOKED)').should('have.length', 1);
    }

    const styling= function (){
        cy.contains('.canceled',"Circuit Theory")
        cy.contains('.canceled',"Chemistry").should('not.exist');
        cy.contains('.canceled',"Programming").should('exist');
    }

    // CALENDAR SETUP
    describe('General calendar tests', () => {
        before('intercept routes', function () {
            setupInterceptStudent();
        });
        beforeEach('intercept routes', function () {
            setupInterceptStudent();
        });
        before('change date to a suitable one', () => {
            cy.clock(Date.UTC(2020, 10, 17), ['Date']);
        });

        before('Visit calendar page', () => {
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

        it('has month button working', () => {
        
            cy.get ("button").eq(6).click();
            cy.get(<div class="fc-daygrid-day-frame fc-scrollgrid-sync-inner"></div>)
            cy.get ("button").eq(4).click();
            
        })
        it('has list button working', () => {
    
                cy.get ("button").eq(5).click();
                cy.contains("November 17, 2020").should('exist');
                cy.contains("November 21, 2020").should('exist');
                cy.get ("button").eq(4).click();
    
            })
    });
    
    
            


    // STUDENT CALENDAR INTERFACE
    describe('Student calendar', () => {
        before('intercept routes', function () {
            setupInterceptStudent();
        });
        beforeEach('intercept routes', function () {
            setupInterceptStudent();
        });
        before('change date to a suitable one', () => {
            cy.clock(Date.UTC(2020, 10, 17), ['Date']);
        });

        before('Visit calendar page', () => {
            cy.visit('/calendar');
        });

        it('should hide course\'s lectures and then restore', function () {
           checkboxCourse_on_off(this.lectures);
        });

        it('should only show booked lectures', function () {
            cy.contains('Booked').parent().find('[type="checkbox"]').should('exist').check();
            seeCheckedLectures('Booked')
            cy.get('[data-cy=booking_status]:contains(BOOKED)').should('have.length', 1);
        });

        it('should show again all lectures after uncheck booked', function () {
            cy.contains('Booked').parent().find('[type="checkbox"]').should('exist').uncheck();
            seeAllLectures('student');
            
        });

        it('should only show remote lectures', function () {
            cy.contains('Remote').parent().find('[type="checkbox"]').should('exist').check();
            seeCheckedLectures('RemoteStudent')
            cy.get('[data-cy=booking_status]:contains(REMOTE)').should('have.length', 1);
        });

        it('should show again all lectures after unchecking remote', function () {
            cy.contains('Remote').parent().find('[type="checkbox"]').should('exist').uncheck();
            seeAllLectures('student');
        });

        it('should show nothing', function () {
            cy.contains('Booked').parent().find('[type="checkbox"]').should('exist').check();
            cy.contains('Remote').parent().find('[type="checkbox"]').should('exist').check();
            seeCheckedLectures('both')
        });
        it('should show again all lectures', function () {
            cy.contains('Booked').parent().find('[type="checkbox"]').should('exist').uncheck();
            cy.contains('Remote').parent().find('[type="checkbox"]').should('exist').uncheck();
            seeAllLectures('student');
        });
        it('has appropriate styling variants', () => {
            styling();
        })
    });




    // TEACHER CALENDAR INTERFACE
    describe('Teacher calendar', () => {
        before('intercept routes', function () {
            setupInterceptTeacher();
        });
        beforeEach('intercept routes', function () {
            setupInterceptTeacher();
        });
        before('change date to a suitable one', () => {
            cy.clock(Date.UTC(2020, 10, 17), ['Date']);
        });

        before('Visit calendar page', () => {
            cy.visit('/calendar');
        });

        it('should hide course\'s lectures and then restore', function () {
            checkboxCourse_on_off(this.lectures);
         });

        it('should only show remote lectures', function () {
            cy.contains('Remote').parent().find('[type="checkbox"]').should('exist').check();
            seeCheckedLectures('RemoteTeacher')
            cy.get('[data-cy=booking_status]:contains(REMOTE)').should('have.length', 1);
        });

        it('should show again all lectures after unchecking remote', function () {
            cy.contains('Remote').parent().find('[type="checkbox"]').should('exist').uncheck();
            seeAllLectures('teacher');
        });

        it('has appropriate styling variants', () => {
            styling();
        })
    });

});



