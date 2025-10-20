// Tests for form validation, UVU ID validation, and error handling

describe('Form Validation Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should not show UVU ID field until course is selected', () => {
    // Initially, UVU ID field should be hidden
    cy.get('#uvuBlock').should('have.attr', 'hidden');
    
    // Select a course
    cy.get('#course').select('cs4690');
    
    // UVU ID field should now be visible
    cy.get('#uvuBlock').should('not.have.attr', 'hidden');
    
    // Deselect the course
    cy.get('#course').select('');
    
    // UVU ID field should be hidden again
    cy.get('#uvuBlock').should('have.attr', 'hidden');
  });

  it('should validate UVU ID format and allow only digits', () => {
    // Select a course first
    cy.get('#course').select('cs4690');
    
    // Try typing non-digit characters
    cy.get('#uvuId').type('abc123def');
    
    // Should only show digits
    cy.get('#uvuId').should('have.value', '123');
    
    // Clear and type too many digits
    cy.get('#uvuId').clear().type('123456789');
    
    // Should truncate to 8 digits
    cy.get('#uvuId').should('have.value', '12345678');
  });

  it('should only enable Add Log button when all fields are valid', () => {
    // Initially, Add Log button should be disabled
    cy.get('#addLogBtn').should('be.disabled');
    
    // Select a course
    cy.get('#course').select('cs4690');
    
    // Button should still be disabled
    cy.get('#addLogBtn').should('be.disabled');
    
    // Enter a valid UVU ID
    cy.get('#uvuId').type('10234567');
    
    // Button should still be disabled until text is entered
    cy.get('#addLogBtn').should('be.disabled');
    
    // Enter text in the textarea
    cy.get('#newLog').type('Test log entry');
    
    // Now the button should be enabled
    cy.get('#addLogBtn').should('not.be.disabled');
    
    // Clear the textarea
    cy.get('#newLog').clear();
    
    // Button should be disabled again
    cy.get('#addLogBtn').should('be.disabled');
  });
});

describe('UVU ID Display Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should update the UVU ID display when a valid ID is entered', () => {
    // Initially, UVU ID display should be hidden
    cy.get('#uvuIdDisplay').should('have.attr', 'hidden');
    
    // Select a course
    cy.get('#course').select('cs4690');
    
    // Enter a valid UVU ID
    cy.get('#uvuId').type('10234567');
    
    // UVU ID display should be visible and show the correct ID
    cy.get('#uvuIdDisplay').should('not.have.attr', 'hidden');
    cy.get('#uvuIdDisplay').should('contain', '10234567');
    
    // Change the UVU ID
    cy.get('#uvuId').clear().type('12345678');
    
    // UVU ID display should update
    cy.get('#uvuIdDisplay').should('contain', '12345678');
  });
});

describe('Empty State and Edge Cases', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show "No logs yet" message when no logs are available', () => {
    // Select a course
    cy.get('#course').select('cs4690');
    
    // Enter a UVU ID that won't have any logs (a random large number)
    cy.get('#uvuId').type('99999999');
    
    // Should show the "No logs yet" message
    cy.get('#logs').should('contain', 'No logs yet for this student in this course');
  });

  it('should allow adding a first log to an empty log list', () => {
    // Select a course
    cy.get('#course').select('cs4690');
    
    // Enter a UVU ID that likely won't have logs
    const randomId = Math.floor(10000000 + Math.random() * 90000000);
    cy.get('#uvuId').type(`${randomId}`);
    
    // Add a log
    cy.get('#newLog').type('First log for a new student');
    cy.get('#addLogBtn').click();
    
    // Should show the new log
    cy.get('#logs li').should('contain', 'First log for a new student');
    
    // Should no longer show the "No logs yet" message
    cy.get('#logs').should('not.contain', 'No logs yet for this student in this course');
  });
});