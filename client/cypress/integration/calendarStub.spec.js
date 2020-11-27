/// <reference types="cypress" />
import moment from 'moment';

describe('Student calendar', () => {
    beforeEach(() => {
        // before each test, we can automatically preserve the
        // 'token' cookie. this means it will not be cleared before the NEXT test starts.
        Cypress.Cookies.preserveOnce('token');
    });
    before('setup fixtures (first req)', function () {
        setupFixtures();
    });
    beforeEach('setup fixtures (following reqs)', function () {
        setupFixtures();
    });
    before('Clear test db', () => {
        cy.db('clear');
    });
    before('Login as a student', () => {
        cy.login('student');
    });
    before('Visit calendar page', () => {
       cy.visit('/calendar');
    });
    before('Aliases', () => {
        /* DOM */
        cy.wrap('button[aria-label="prev"]').as('prev');
        cy.wrap('button[aria-label="next"]').as('next');
        cy.contains('today').as('today');
        cy.contains('week').as('week');
        cy.contains('list').as('list');
        cy.contains('month').as('month');
    });
    describe('Check empty calendar rendering', () => {
        it('should render navigation button', () => {
            cy.get ('@prev').should('exist');
            cy.get ('@next').should('exist');
            cy.get ('@today').should('exist');
            cy.get ('@week').should('exist');
            cy.get ('@list').should('exist');
            cy.get ('@month').should('exist');
        });
        it('should render headers', () => {
            const headerOfCurrentWeek = moment().isoWeekday(1).format('MMM DD');
            cy.contains(headerOfCurrentWeek).should('exist');
            cy.contains('Courses').should('exist');
        });
        it('should render calendar container', () => {
            const hours = [...Array(12).keys()].map(i=>i+8).map(h=>moment(h, 'h').format('ha'));    // get array of hours in 12h format
            const days = [ ...Array(7).keys() ].map(h=>moment(h, 'd').format('ddd')); // get array of days in short format
            hours.forEach(h => cy.contains(h).should('exist'));
            days.forEach(d => cy.contains(d).should('exist'));
        });
    });
    describe('Check event boxes rendering', function () {
        it('loads course list in the right nav', function () {
            this.lectures.forEach(l => {
                cy.contains(l.course_name).should('exist');
                cy.contains(l.teacher_name).should('exist');
                cy.contains(l.teacher_surname).should('exist');
            });
        });
    });
});

const setupFixtures = function () {
    cy.fixture('list_of_lectures').as('lectures').then(function (lectures) {
        this.lectures = lectures;
        cy.route2({
            pathname: /\/api\/students\/[0-9]+\/lectures/
        }, lectures);
    });
}