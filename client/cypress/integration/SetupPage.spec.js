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

    describe('Upload steps preview and errors',()=>{
        before('Visit the page', () => {
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

        it('upload teachers file and check that a preview is shown', () => {
            cy.get("[data-testid=setupStep1] input").attachFile('../fixtures/Professors.csv');
            cy.get("[data-testid=setupStep1] table").children()
            .should('contain', 'Number')
            .and('contain', 'GivenName')
            .and('contain', 'Surname')
            .and('contain', 'OfficialEmail')
            .and('contain', 'SSN');
            cy.get("[data-testid=setupStep1]").contains("Showing 5 of 201 rows.")
            cy.get("[data-testid=setupStep1] table").children()
            .should('contain', 'd9004')
            .and('contain', 'Marisa')
            .and('contain', 'Fiorentini')
            .and('contain', 'Marisa.Fiorentini@politu.it')
            .and('contain', 'SK31148026');
        });

        it('has disabled submit if some steps are not completed', () => {
            cy.get("[data-testid=submitAll]").should('be.disabled');
        });

        it('upload files for the other 3 steps, the third one is wrong', () => {
            cy.get("[data-testid=setupStep2] input").attachFile('../fixtures/Courses.csv');
            cy.get("[data-testid=setupStep2]").contains("Showing 5 of 61 rows.");
            cy.get("[data-testid=setupStep3] input").attachFile('../fixtures/Enrollment.csv');
            cy.get("[data-testid=setupStep3]").contains("Showing 5 of 19265 rows.");
            cy.get("[data-testid=setupStep4] input").attachFile('../fixtures/Enrollment.csv');
            cy.get("[data-testid=setupStep4]").contains("Attributes names or number of attributes does not match the requirements for this step.")
        });

        it('has disabled submit if errors are present', () => {
            cy.get("[data-testid=submitAll]").should('be.disabled');
        });
        
    });

    describe('Submit everything',()=>{
        before('Visit the page', () => {
            cy.intercept('GET','/api/user', { fixture: 'officer1.json'})
            cy.visit('/setup');
            cy.get("[data-testid=setupStep0] input").attachFile('../fixtures/Students.csv');
            cy.wait(1000);
            cy.get("[data-testid=setupStep1] input").attachFile('../fixtures/Professors.csv');
            cy.wait(1000);
            cy.get("[data-testid=setupStep2] input").attachFile('../fixtures/Courses.csv');
            cy.wait(1000);
            cy.get("[data-testid=setupStep3] input").attachFile('../fixtures/Enrollment.csv');
            cy.wait(3000);
            cy.get("[data-testid=setupStep4] input").attachFile('../fixtures/Schedule.csv');
        });

        it('has enabled submit if all steps are complete and there is no error', () => {
            cy.get("[data-testid=submitAll]").should('not.be.disabled');
        });

        it('sends request when the button is clicked, something goes wrong in server', () => {
            cy.intercept('POST','/api/setup', {
                statusCode: 500,
                body: {message: 'Internal server error?'},
                delayMs: 1000
            });
            cy.get("[data-testid=submitAll]").click();
            cy.get("[data-testid=alertsCol]").contains("Setup in progress");
            cy.wait(1000);
            cy.get("[data-testid=alertsCol]").contains("Something went wrong during server setup!");
            cy.get("[data-testid=alertsCol]").contains("Internal server error?");
        });

        it('sends request when the button is clicked', () => {
            cy.intercept('POST','/api/setup', {
                statusCode: 201,
                body: '',
                delayMs: 1000
            });
            cy.get("[data-testid=submitAll]").click();
            cy.get("[data-testid=alertsCol]").contains("Setup in progress");
            cy.wait(1000);
            cy.get("[data-testid=alertsCol]").contains("Success!");
        });
    });

    
});