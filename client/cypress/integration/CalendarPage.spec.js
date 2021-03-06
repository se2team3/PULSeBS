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
        cy.intercept('/api/user', { statusCode: 200, body: student });
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
        cy.intercept('/api/user', { statusCode: 200, body: teacher });
        cy.intercept('/api/login', teacher);
    });
}




describe('Calendar tests', () => {

    // SOME GENERIC FUNCTIONS

    const settings = function (role) {
        if (role === 'student') setupInterceptStudent();
        else setupInterceptTeacher();
        cy.clock(Date.UTC(2020, 10, 17), ['Date']);
        cy.visit('/calendar');
    }


    const seeCheckedLectures = function (role, view) {
        let list = (role === 'student') ? ['Physics', 'Analysis I', 'Remote', 'Booked', 'Waiting'] : ['Physics', 'Analysis I', 'Remote', 'Cancelled']
        let blackStatus = (role === 'student') ? ['CANCELED'] : ['WAITING LIST', 'BOOKED']
        let whiteStatus = (role === 'student') ? ['WAITING LIST', 'BOOKED'] : ['CANCELED']
        let whiteList = []
        let blackList = []


        if (view === 'past') {
            blackList = ['Physics', 'Analysis I'];
            if (role === 'student') blackList = blackList.concat(['CLOSED'])
            whiteList = ['Chemistry'];
        }
        else if (view === 'normal' || view === 'future') {
            blackList = ['Physics', 'Analysis I']
            if (role === 'student') blackList = blackList.concat(['FULL', 'FREE']).concat(blackStatus)
            if (role === 'student' && view === 'normal') blackList = blackList.concat(['CLOSED'])
            whiteList = ['Chemistry', 'REMOTE']
            if (role === 'student') whiteList = whiteList.concat(whiteStatus)
        }
        else if (view === 'list' || view === 'month') {
            blackList = ['Physics', 'Analysis I']
            whiteList = ['Chemistry']
        }

        //apply filters - uncheck Physics and Analysis 1 lectures
        // Apply courses filters
        cy.get('.sidebar').contains('Physics').parent().parent().parent().find('[type="checkbox"]').uncheck(); // uncheck Physics
        cy.get('.calendar').contains('Physics').should('not.exist'); // Assert that Physics doesn't exist
        ['Chemistry', 'Analysis I'].forEach((l) => cy.get('.calendar').contains(l)); // Assert that other subjects exist

        cy.get('.sidebar').contains('Analysis I').parent().parent().parent().find('[type="checkbox"]').uncheck(); // uncheck Analysis

        // Check that Physics and Analysis I lecutres are not present inside the calendar
        ['Physics', 'Analysis I'].forEach((l) => cy.get('.calendar').contains(l).should('not.exist'));
        cy.get('.calendar').contains('Chemistry') // chemistry lecture should still be present

        list.filter(l => l!== 'Physics' && l !== 'Analysis I').forEach(l => cy.contains(l).parent().find('[type="checkbox"]').check())
        /* for (let l of list) {
            if (l === 'Physics' || l === 'Analysis I')
                cy.get('.sidebar').contains(l).parent().parent().parent().find('[type="checkbox"]').uncheck();
            else
                //
                cy.contains(l).parent().find('[type="checkbox"]').check();
        } */
        for (let l of blackList)
            cy.get('.calendar').contains(l).should('not.exist');
        for (let l of whiteList)
            cy.get('.calendar').contains(l);

        //restoring
        for (let l of list) {
            if (l === 'Physics' || l === 'Analysis I')
                cy.get('.sidebar').contains(l).parent().parent().parent().find('[type="checkbox"]').check();
            else
                cy.contains(l).parent().find('[type="checkbox"]').uncheck();
        }
        for (let l of blackList)
            cy.get('.calendar').contains(l);
        for (let l of whiteList)
            cy.get('.calendar').contains(l);
    }



    const styling = function () {
        cy.contains('.canceled', "Chemistry")
        cy.contains('.remote', "Chemistry")
    }


    function testCalendar(role) {
        describe(`${role} calendar`, () => {
            beforeEach('settings', function () {
                settings(role)
            });
            beforeEach('intercept routes', function () {
                role === 'student' ? setupInterceptStudent() : setupInterceptTeacher();
            });


            it('has this week view working', function () {
                cy.contains("Nov 16 – 22, 2020");
                seeCheckedLectures(role, 'normal');
            })

            it('has backward view working', () => {
                cy.get(".fc-prev-button").click();
                cy.contains("Nov 9 – 15, 2020");
                seeCheckedLectures(role, 'past')
                cy.get(".fc-today-button").click();
            })

            it('has forward view working', () => {

                cy.get(".fc-next-button").click();
                cy.contains("Nov 23 – 29, 2020");
                seeCheckedLectures(role, 'future');
                cy.get(".fc-today-button").click();
            })

            it('has month view working', () => {
                cy.wait(1000);
                cy.get(".fc-dayGridMonth-button").click();
                cy.get(<div class="fc-daygrid-day-frame fc-scrollgrid-sync-inner"></div>)
                seeCheckedLectures(role, 'month');
                cy.get(".fc-timeGridWeek-button").click();

            })

            it('has list view working', () => {

                cy.get(".fc-listWeek-button").click();
                cy.contains("November 17, 2020")
                seeCheckedLectures(role, 'list');
                cy.get(".fc-timeGridWeek-button").click();

            })


            it('has appropriate styling variants', () => {
                styling();
            })

        });


    }
    // CALLING THE TESTS
    testCalendar('student');

    describe("student calendar, waiting list", () => {
        it('has WAITING LIST label when student has booked a place in the waiting list for a lecture', () => {
            cy.contains("WAITING LIST").parent().contains("Chemistry");
        });
    });

    testCalendar('teacher');

});
