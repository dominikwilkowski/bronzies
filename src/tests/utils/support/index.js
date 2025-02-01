import '@testing-library/cypress/add-commands';
import "cypress-real-events";

// fixing beforeunload bug in cypress https://github.com/cypress-io/cypress/issues/2118
Cypress.on('window:load', (window) => {
  const original = window.addEventListener;
  window.addEventListener = (...args) => {
    if (args[0] === 'beforeunload') {
      return;
    }
    return original.apply(window, args);
  };
});
