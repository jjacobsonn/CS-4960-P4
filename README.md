# Student Logs - UVU Brand Bootstrap/jQuery Practicum

This project implements a student log tracking system using Bootstrap and jQuery with UVU branding. It includes light/dark theme toggling, RESTful API implementation, and Cypress tests.

## Getting Started

### Prerequisites

- Node.js 
- npm

### Installation and Running

**Option 1: Using the convenience script (recommended)**

The project includes convenience scripts that will install dependencies and start the server:

```bash
# On macOS/Linux:
./runme.sh

# On Windows:
runme.bat
```

**Option 2: Manual installation**

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm run server
```

3. Open http://localhost:3000 in your browser

## Running Cypress Tests

This project includes Cypress tests for extra credit. To run these tests:

### Step 1: Start the server
First, start the server using the convenience script:
```bash
# On macOS/Linux:
./runme.sh

# On Windows:
runme.bat
```

### Step 2: Run Cypress tests (in a new terminal)
```bash
# Run all tests
npx cypress run

# Run specific test files
npx cypress run --spec "cypress/e2e/theme.cy.js"
npx cypress run --spec "cypress/e2e/bootstrap_jquery.cy.js"
```

### Alternative: Open Cypress UI
If you prefer to use the Cypress UI:
```bash
npx cypress open
```

The test files are located in `cypress/e2e/` folder:
- `theme.cy.js`: Tests the light/dark theme toggle functionality (2 tests)
- `bootstrap_jquery.cy.js`: Tests Bootstrap styling and jQuery functionality (8 tests)

## Project Structure

- `/public` - Frontend files (HTML, JS, CSS)
- `/cypress` - Test files
- `/documents` - Contains wireframe.pdf
- `db.json` - Database file for json-server

## Key Features

- UVU Brand-compliant design using Bootstrap
- Light/Dark theme toggle with preference saving
- RESTful API with relative URLs (no hardcoded localhost)
- Form validation for UVU ID
- Responsive design