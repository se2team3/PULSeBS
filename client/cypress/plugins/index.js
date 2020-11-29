/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // custom tasks for sending and reporting code coverage
  // custom tasks for sending and reporting code coverage
  require('@cypress/code-coverage/task')(on, config)
  // this line instruments spec files and loaded unit test code
  on(
    'file:preprocessor',
    require('@cypress/code-coverage/use-browserify-istanbul')
  )
  // It's IMPORTANT to return the config object
  // with any changed environment variables
  return config
}