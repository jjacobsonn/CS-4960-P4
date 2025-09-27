# Cypress Testing Guide

This project uses [Cypress](https://www.cypress.io/) for end-to-end testing.

## Prerequisites
- Node.js and npm installed
- All project dependencies installed (see below)

## Install Dependencies
If you haven't already, install the dependencies:

```bash
npm install
```

## Running the Server
Start the local server (required for tests):

```bash
npm run server
```

## Running Cypress Tests
Cypress is installed as a dev dependency. You can run tests using:

### Open Cypress Test Runner (GUI)
```bash
npx cypress open
```
This opens the interactive Cypress UI where you can run and debug tests.

### Run Cypress Tests in Headless Mode
```bash
npx cypress run
```
This runs all tests in the terminal (useful for CI or quick checks).

## Notes
- Make sure the server is running before starting Cypress tests.
- Tests are located in the `cypress/e2e/` directory.
- No custom npm script is defined for Cypress, so use `npx` as shown above.

---
If you have any issues, please check the Cypress documentation or contact the project maintainer.
