const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // This URL must match the URL where your app is running
    supportFile: 'cypress/support/e2e.js',
  },
});