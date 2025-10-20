# Student Logs - UVU Brand Bootstrap/jQuery Practicum

This project implements a student log tracking system using Bootstrap and jQuery with UVU branding. Students can select courses, enter their UVU ID, view past logs, and add new log entries.

## Features

- UVU Brand-compliant design using Bootstrap
- Light/Dark theme toggle with preference saving
- RESTful API integration using jQuery
- Form validation and error handling
- Mobile-responsive design
- Complete test suite with Cypress

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/jjacobsonn/CS-4960-P4.git
cd CS-4960-P4
```

2. Install dependencies
```bash
npm install
```

### Running the Application

1. Start the json-server backend
```bash
npm run server
```

2. Open http://localhost:3000 in your browser

### Running with Convenience Script

You can also use the provided convenience script:

```bash
./runme.sh
```

## Running Tests

This project includes comprehensive Cypress tests for the functionality. To run the tests:

1. Make sure the application is running (in a separate terminal)
```bash
npm run server
```

2. Open Cypress Test Runner
```bash
npx cypress open
```

3. Select "E2E Testing" and choose your browser
4. Run any of the test files:
   - bootstrap_jquery.cy.js
   - theme.cy.js
   - form_validation.cy.js
   - api_integration.cy.js
   - user_interactions.cy.js

Alternatively, run all tests headlessly:
```bash
npx cypress run
```

## Design Documentation

The wireframes for this project can be found in the `documents/wireframe.pdf` file.

## Project Structure

- `/public` - Frontend files (HTML, JS, CSS)
- `/cypress` - Test files and configuration
- `db.json` - Database file for json-server
- `routes.json` - Route configuration for json-server

## Technical Details

- No "localhost" URLs in the codebase - all links are relative for portability
- Uses jQuery for DOM manipulation and AJAX
- Bootstrap 5 for responsive layout and styling
- Light/dark theme toggle using localStorage for persistence
- UVU branding color scheme and design elements