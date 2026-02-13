/// <reference types="cypress" />

const TOKENS = {
  accessToken: 'Bearer test-accessToken',
  refreshToken: 'test-refreshToken',
} as const;

const TEST_IDS = {
  modal: 'modal',
  modalClose: 'modal-close',
  dropzone: 'constructor-dropzone',
  dropzoneTop: 'constructor-dropzone-top',
  orderSubmit: 'order-submit',
} as const;

const INGREDIENT_IDS = {
  bun: '60666c42cc7b410027a1a9b1',
  main: '60666c42cc7b410027a1a9b5',
  sauce: '60666c42cc7b410027a1a9b7',
} as const;

const selectors = {
  ingredientCardById: (id: string): string =>
    `[data-testid="ingredient-card"][data-ingredient-id="${id}"]`,
} as const;

describe('Constructor page (Stellar Burger)', () => {
  beforeEach((): void => {
    cy.clearTokens();
    cy.setTokens(TOKENS);

    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('postOrder');

    cy.visit('/');

    cy.wait('@getIngredients');
    cy.wait('@getUser');

    cy.getByTestId(TEST_IDS.dropzone).as('dropList');
    cy.getByTestId(TEST_IDS.dropzoneTop).as('dropTop');
    cy.getByTestId(TEST_IDS.orderSubmit).as('submitOrder');

    cy.get(selectors.ingredientCardById(INGREDIENT_IDS.bun)).as('bunCard');
    cy.get(selectors.ingredientCardById(INGREDIENT_IDS.main)).as('mainCard');
    cy.get(selectors.ingredientCardById(INGREDIENT_IDS.sauce)).as('sauceCard');
  });

  afterEach((): void => {
    cy.clearTokens();
  });

  it('should drag ingredients, open/close ingredient modal, create order and close order modal', (): void => {
    cy.get('@bunCard').click();

    cy.getByTestId(TEST_IDS.modal).as('modal').should('be.visible');
    cy.get('@modal').should('contain.text', 'Краторная булка N-200i');

    cy.getByTestId(TEST_IDS.modalClose).click();
    cy.getByTestId(TEST_IDS.modal).should('not.exist');

    cy.dragAndDrop('@bunCard', '@dropTop');
    cy.dragAndDrop('@mainCard', '@dropList');
    cy.dragAndDrop('@sauceCard', '@dropList');

    cy.get('@submitOrder').should('not.be.disabled').click();

    // защита от редиректа на login
    cy.location('pathname').should('eq', '/');

    cy.wait('@postOrder').then((interception) => {
      expect(interception.request.body).to.have.property('ingredients');
      expect(interception.request.body.ingredients).to.be.an('array');
      expect(interception.request.body.ingredients.length).to.be.greaterThan(0);
    });

    cy.getByTestId(TEST_IDS.modal).should('be.visible').and('contain.text', '12345');
    cy.getByTestId(TEST_IDS.modalClose).click();
    cy.getByTestId(TEST_IDS.modal).should('not.exist');
  });
});
