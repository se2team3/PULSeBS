/// <reference types="cypress" />

describe('Setup page', () => {

    it('is visible to a support officer', () => {
        cy.intercept('GET','/api/user', { fixture: 'officer1.json'})
        cy.visit('/setup');
        cy.contains("Setup");
        cy.contains("Not found").should('not.exist');
    });

    it('is not visible to a student', () => {
        cy.intercept('GET','/api/user', { fixture: 'student1.json'})
        cy.visit('/setup');
        cy.contains("Setup").should('not.exist');
        cy.contains("Not found");
    });

    it('is not visible to a teacher', () => {
        cy.intercept('GET','/api/user', { fixture: 'teacher1.json'})
        cy.visit('/setup');
        cy.contains("Setup").should('not.exist');
        cy.contains("Not found");
    });

    describe('Upload steps',()=>{
        beforeEach('Visit the page', () => {
            cy.intercept('GET','/api/user', { fixture: 'officer1.json'})
            cy.visit('/setup');
        });

        it('upload students file and check that a preview is shown', () => {
            cy.get("[data-testid=setupStep0] input").attachFile('../fixtures/Students.csv');
            cy.get("[data-testid=setupStep0] table").children()
            .should('contain', 'Id')
            .and('contain', 'Name')
            .and('contain', 'Surname')
            .and('contain', 'City')
            .and('contain', 'OfficialEmail')
            .and('contain', 'Birthday')
            .and('contain', 'SSN');
            cy.get("[data-testid=setupStep0]").contains("Showing 5 of 2801 rows.")
            cy.get("[data-testid=setupStep0] table").children()
            .should('contain', '900004')
            .and('contain', 'Algiso')
            .and('contain', 'Arcuri')
            .and('contain', 'Ambrogio')
            .and('contain', 's900004@students.politu.it')
            .and('contain', '1991-11-09')
            .and('contain', 'KU71485501');
        });
    });
});

// check the page is not visible to students
// not visible to teachers
