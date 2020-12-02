/// <reference types="cypress" />
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

    const settings= function(role){
        if (role==='student')setupInterceptStudent();
        else setupInterceptTeacher();
        cy.clock(Date.UTC(2020, 10, 17), ['Date']);
        cy.visit('/calendar');
    }

    const checkboxCourse_on_off =function (lectures){
        cy.contains('Courses').parent().find('[type="checkbox"]').first().uncheck();
        cy.get('.calendar').contains(lectures[0].course_name).should('not.exist');
        cy.contains('Courses').parent().find('[type="checkbox"]').first().check();
        cy.get('.calendar').contains(lectures[0].course_name).should('exist');
    }

    

    const seeCheckedLectures= function(value,status,role){ 
        cy.contains(value).parent().find('[type="checkbox"]').should('exist').check();
        const list=['CANCELED','REMOTE','CLOSED','FULL','FREE']
        for (let l of list){
            if (status!==l) cy.get('.calendar').contains(l).should('not.exist');
        }
        if(status!=="BOOKED" && role==="student") cy.get('.calendar').contains('BOOKED').should('not.exist');
    }



    const seeAllLectures= function (value,role){
        const status = ['CANCELED','REMOTE','CLOSED','FULL','FREE']
        cy.contains(value).parent().find('[type="checkbox"]').should('exist').uncheck();
        status.forEach((stat)=>cy.get(`[data-cy=booking_status]:contains(${stat})`).should('have.length',stat==='FREE'?2:1))
        /* cy.get('[data-cy=booking_status]:contains(CANCELED)').should('have.length', 1);
        cy.get('[data-cy=booking_status]:contains(REMOTE)').should('have.length', 1);
        cy.get('[data-cy=booking_status]:contains(CLOSED)').should('have.length', 1);
        cy.get('[data-cy=booking_status]:contains(FULL)').should('have.length', 1); */
        // cy.get('[data-cy=booking_status]:contains(FREE)').should('have.length', 2);
        if (role=='student')cy.get('[data-cy=booking_status]:contains(BOOKED)').should('have.length', 1);
    }

    const styling= function (){
        cy.contains('.canceled',"Circuit Theory")
        cy.contains('.canceled',"Chemistry").should('not.exist');
        cy.contains('.remote',"Programming").should('exist');
    }

    // CALENDAR SETUP
    describe('General calendar tests', () => {
        before('settings', function () {
            settings('student')
        });
        beforeEach('intercept routes', function () {
            setupInterceptStudent();
        }); 

        it('has header presence', () => {
            cy.contains("Nov 16 – 22, 2020");
        })
        it('has backward button working', () => {
            cy.get ("button").eq(1).click();
            cy.contains("Nov 9 – 15, 2020").should('exist');
            cy.get ("button").eq(2).click();
        })

        it('has forward button working', () => {

            cy.get ("button").eq(2).click();
            cy.contains("Nov 23 – 29, 2020").should('exist');
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
    /* describe('Student calendar', () => {
        before('settings', function () {
            settings('student')
        });
        beforeEach('intercept routes', function () {
            setupInterceptStudent();
        });

        it('should hide course\'s lectures and then restore', function () {
           checkboxCourse_on_off(this.lectures);
        });

        it('see if booking checkbox works', function () {
            seeCheckedLectures('Booked','BOOKED','student')
            cy.get('[data-cy=booking_status]:contains(BOOKED)').should('have.length', 1);
            seeAllLectures('Booked','student')
        });

        it('see if remote checkbox works', function () {
            seeCheckedLectures('Remote','REMOTE','student')
            cy.get('[data-cy=booking_status]:contains(REMOTE)').should('have.length', 1);
            seeAllLectures('Remote','student')
        });

        it('has appropriate styling variants', () => {
            styling();
        })
        
    }); */

    // STUDENT
    testCalendar('student');
    
    // TEACHER
    testCalendar('teacher');


    // TEACHER CALENDAR INTERFACE
    /* describe('Teacher calendar', () => {
        before('settingsTeacher', function () {
            settings('teacher');
        });
        beforeEach('intercept routes for teacher', function () {
            setupInterceptTeacher();
        });
       
        it('should hide course\'s lectures and then restore for teacher', function () {
            checkboxCourse_on_off(this.lectures);
         });

         it('see if remote checkbox works for teacher', function () {
            seeCheckedLectures('Remote','REMOTE','teacher')
            cy.get('[data-cy=booking_status]:contains(REMOTE)').should('have.length', 1);
            seeAllLectures('Remote','Teacher')
        });

        it('see if cancelled checkbox works for teacher', function () {
            seeCheckedLectures('Cancelled','CANCELED','teacher')
            cy.get('[data-cy=booking_status]:contains(CANCELED)').should('have.length', 1);
            seeAllLectures('Cancelled','Teacher')
        });

        it('has appropriate styling variants for teacher', () => {
            styling();
        })
        
    }); */

    function testCalendar(role){
    
        describe(`${role} calendar`, () => {
            before('settings', function () {
                settings(role)
            });
            beforeEach('intercept routes', function () {
                role==='student'? setupInterceptStudent() : setupInterceptTeacher();
            });
    
            it(`should hide course\'s lectures and then restore for ${role}`, function () {
               checkboxCourse_on_off(this.lectures);
            });
    
            if(role==='student') {
                it(`see if booking checkbox works for student`, function () {
                seeCheckedLectures('Booked','BOOKED','student')
                cy.get('[data-cy=booking_status]:contains(BOOKED)').should('have.length', 1);
                seeAllLectures('Booked','student')
            });
            }
    
            it(`see if remote checkbox works for ${role}`, function () {
                seeCheckedLectures('Remote','REMOTE',role)
                cy.get('[data-cy=booking_status]:contains(REMOTE)').should('have.length', 1);
                seeAllLectures('Remote',role)
            });
    
            if(role === 'teacher'){
                it('see if cancelled checkbox works for teacher', function () {
                    seeCheckedLectures('Cancelled','CANCELED','teacher')
                    cy.get('[data-cy=booking_status]:contains(CANCELED)').should('have.length', 1);
                    seeAllLectures('Cancelled','Teacher')
                });
            }
            it('has appropriate styling variants', () => {
                styling();
            })
            
        });
    }   

    
});




