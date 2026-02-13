/// <reference types="cypress" />

type TTokens = {
  accessToken?: string;
  refreshToken?: string;
};

Cypress.Commands.add('setTokens', (tokens: TTokens): void => {
  const { accessToken, refreshToken } = tokens;

  if (accessToken) window.localStorage.setItem('accessToken', accessToken);
  if (refreshToken) window.localStorage.setItem('refreshToken', refreshToken);
});

Cypress.Commands.add('clearTokens', (): void => {
  window.localStorage.removeItem('accessToken');
  window.localStorage.removeItem('refreshToken');
});

Cypress.Commands.add(
  'getByTestId',
  (testId: string): Cypress.Chainable<JQuery<HTMLElement>> => {
    return cy.get(`[data-testid="${testId}"]`);
  }
);

Cypress.Commands.add('dragAndDrop', (source: string, target: string): void => {
  const dataTransfer = new DataTransfer();
  cy.get(source).trigger('dragstart', { dataTransfer });
  cy.get(target).trigger('drop', { dataTransfer });
});
