const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: 'server/assets/',
  videosFolder: 'src/tests/utils/videos/',
  screenshotsFolder: 'src/tests/utils/screenshots/',
  viewportWidth: 375,
  viewportHeight: 1500,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./src/tests/utils/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'src/tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'src/tests/utils/support/',
  },
})
