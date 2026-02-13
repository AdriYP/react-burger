/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
      setTokens(tokens: { accessToken?: string; refreshToken?: string }): Chainable<void>;
      clearTokens(): Chainable<void>;
      dragAndDrop(source: string, target: string): Chainable<void>;
    }
  }
}

export {};
