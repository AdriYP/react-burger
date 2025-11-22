import { createSelector } from '@reduxjs/toolkit';

export const selectConstructorState = (state) => state.constructorItems;

export const selectConstructorBun = createSelector(
  [selectConstructorState],
  (constructorItems) => constructorItems.bun
);

export const selectConstructorIngredients = createSelector(
  [selectConstructorState],
  (constructorItems) => constructorItems.ingredients
);

export const selectConstructorTotalPrice = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients) => {
    const bunPrice = bun ? (bun.price ?? 0) * 2 : 0;

    const ingredientsSum = Array.isArray(ingredients)
      ? ingredients.reduce((sum, item) => sum + (item?.price ?? 0), 0)
      : 0;

    return bunPrice + ingredientsSum;
  }
);
