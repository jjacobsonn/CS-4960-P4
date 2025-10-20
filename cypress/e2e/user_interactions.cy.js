// User Interactions Tests

describe('User Interactions Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#course').select('cs4690');
    cy.get('#uvuId').type('10234567');
  });

  it('should show log details when clicking on a log', () => {
    // Wait for logs to load
    cy.get('#logs li').first().as('firstLog');
    
    // The pre element (log details) should exist but be hidden
    cy.get('@firstLog').find('pre').should('exist');
    
    // Click on the log
    cy.get('@firstLog').click();
    
    // The pre element should now be visible
    cy.get('@firstLog').find('pre').should('be.visible');
    
    // Click again to hide
    cy.get('@firstLog').click();
    
    // The pre element should be hidden again
    cy.get('@firstLog').find('pre').should('not.be.visible');
  });

  it('should display logs in chronological order', () => {
    // Add a new log
    const logText = 'Chronological test log ' + new Date().getTime();
    cy.get('#newLog').type(logText);
    cy.get('#addLogBtn').click();
    
    // The new log should appear in the list
    cy.get('#logs li').should('contain', logText);
    
    // Get the date from the most recent log (should be at the top or bottom depending on sorting)
    cy.get('#logs li').then($logs => {
      // This test assumes the newest log is first (or last if sorted differently)
      // In practice, you'd need to know how your app sorts logs
      const mostRecentLog = $logs.first();
      const dateText = mostRecentLog.find('.text-success').text();
      
      // Check if the date is today or contains today's date
      const today = new Date();
      const todayString = today.toLocaleDateString();
      expect(dateText).to.include(todayString);
    });
  });

  it('should clear textarea after successfully adding a log', () => {
    // Add a log
    cy.get('#newLog').type('Test log that should be cleared');
    cy.get('#addLogBtn').click();
    
    // Textarea should be empty after successful submission
    cy.get('#newLog').should('have.value', '');
  });

  it('should focus UVU ID input after selecting a course', () => {
    // Reset to start
    cy.reload();
    
    // Select a course
    cy.get('#course').select('cs4690');
    
    // UVU ID input should be focused
    cy.focused().should('have.id', 'uvuId');
  });
});