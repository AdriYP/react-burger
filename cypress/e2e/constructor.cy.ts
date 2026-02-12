/// <reference types="cypress" />

const BASE_URL = 'http://localhost:5173/';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const IDS = {
  bun: '60666c42cc7b410027a1a9b1',
  main: '60666c42cc7b410027a1a9b5',
  sauce: '60666c42cc7b410027a1a9b7',
} as const;

const setAuthTokens = (): void => {
  window.localStorage.setItem(REFRESH_TOKEN_KEY, 'test-refreshToken');
  window.localStorage.setItem(ACCESS_TOKEN_KEY, 'Bearer test-accessToken');
};

const byIngredientId = (id: string): string =>
  `[data-testid="ingredient-card"][data-ingredient-id="${id}"]`;

const dnd = (sourceAlias: string, targetAlias: string): void => {
  const dataTransfer = new DataTransfer();
  cy.get(sourceAlias).trigger('dragstart', { dataTransfer });
  cy.get(targetAlias).trigger('drop', { dataTransfer });
};

describe('Constructor page (Stellar Burger)', () => {
  beforeEach((): void => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    // Ключевой мок: приложение должно увидеть залогиненного юзера
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');

    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('postOrder');

    cy.visit(BASE_URL, {
      onBeforeLoad: (): void => {
        window.localStorage.clear();
        setAuthTokens();
      },
    });

    cy.wait('@getIngredients');
    cy.wait('@getUser');

    cy.get('[data-testid="constructor-dropzone"]').as('dropList');
    cy.get('[data-testid="constructor-dropzone-top"]').as('dropTop');
    cy.get('[data-testid="order-submit"]').as('submitOrder');

    cy.get(byIngredientId(IDS.bun)).as('bunCard');
    cy.get(byIngredientId(IDS.main)).as('mainCard');
    cy.get(byIngredientId(IDS.sauce)).as('sauceCard');
  });

  it('should drag ingredients, open/close ingredient modal, create order and close order modal', (): void => {
    cy.get('@bunCard').click();
    cy.get('[data-testid="modal"]').as('modal').should('be.visible');
    cy.get('@modal').should('contain.text', 'Краторная булка N-200i');

    cy.get('[data-testid="modal-close"]').as('modalClose').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    dnd('@bunCard', '@dropTop');
    dnd('@mainCard', '@dropList');
    dnd('@sauceCard', '@dropList');

    cy.get('@submitOrder').should('not.be.disabled').click();

    // важно: убедимся, что не ушли на /login
    cy.location('pathname').should('eq', '/');

    cy.wait('@postOrder').then((interception) => {
      expect(interception.request.body).to.have.property('ingredients');
      expect(interception.request.body.ingredients).to.be.an('array');
      expect(interception.request.body.ingredients.length).to.be.greaterThan(0);
    });

    cy.get('[data-testid="modal"]').should('be.visible').and('contain.text', '12345');

    // лучше не использовать старый alias, а закрывать “свежим” селектором
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });
});
