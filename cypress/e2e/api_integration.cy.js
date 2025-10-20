// API Integration Tests

describe('API Integration Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load courses on page load', () => {
    // Intercept and mock the courses API call
    cy.intercept('GET', '/api/v1/courses', { fixture: 'example.json' }).as('getCourses');
    cy.reload();
    
    // Verify the API call was made
    cy.wait('@getCourses');
    
    // Courses should be loaded into the select element
    cy.get('#course option').should('have.length.greaterThan', 1);
  });

  it('should load logs when both course and UVU ID are set', () => {
    // Intercept the logs API call
    cy.intercept('GET', '/logs*').as('getLogs');
    
    // Select a course and enter UVU ID
    cy.get('#course').select('cs4690');
    cy.get('#uvuId').type('10234567');
    
    // Verify the API call was made with correct parameters
    cy.wait('@getLogs').its('request.url').should('include', 'courseId=cs4690');
    cy.wait('@getLogs').its('request.url').should('include', 'uvuId=10234567');
    
    // Logs container should have content
    cy.get('#logs').children().should('exist');
  });

  it('should send POST request when adding a new log', () => {
    // Intercept and allow the POST request to go through
    cy.intercept('POST', '/logs').as('addLog');
    
    // Select a course and enter UVU ID
    cy.get('#course').select('cs4690');
    cy.get('#uvuId').type('10234567');
    
    // Add a new log
    const logText = 'Cypress test log ' + new Date().getTime();
    cy.get('#newLog').type(logText);
    cy.get('#addLogBtn').click();
    
    // Verify the POST request was made with correct data
    cy.wait('@addLog').its('request.body').should('include', {
      courseId: 'cs4690',
      uvuId: '10234567',
      text: logText,
      comment: logText
    });
    
    // Verify the new log appears in the list
    cy.get('#logs').should('contain', logText);
  });

  it('should refresh log list after adding a new log', () => {
    // Intercept the GET logs call that happens after adding a log
    cy.intercept('GET', '/logs*').as('getLogsAfterAdd');
    
    // Select a course and enter UVU ID
    cy.get('#course').select('cs4690');
    cy.get('#uvuId').type('10234567');
    
    // Add a new log
    const logText = 'Refresh test log ' + new Date().getTime();
    cy.get('#newLog').type(logText);
    cy.get('#addLogBtn').click();
    
    // Verify that a GET request was made after the POST
    cy.wait('@getLogsAfterAdd');
    
    // The new log should appear in the list
    cy.get('#logs').should('contain', logText);
  });
});