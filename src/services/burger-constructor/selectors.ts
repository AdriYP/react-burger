import { createSelector } from '@reduxjs/toolkit';

import type { TIngredient } from '@/types/ingredient';

import type { RootState } from '../store';
import type { TConstructorState, TConstructorIngredient } from './reducer';

export const selectConstructorState = (state: RootState): TConstructorState =>
  state.constructorItems;

export const selectConstructorBun = createSelector(
  [selectConstructorState],
  (constructorItems): TIngredient | null => constructorItems.bun
);

export const selectConstructorIngredients = createSelector(
  [selectConstructorState],
  (constructorItems): TConstructorIngredient[] => constructorItems.ingredients
);

export const selectConstructorTotalPrice = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients): number => {
    const bunPrice = bun ? (bun.price ?? 0) * 2 : 0;
    const ingredientsSum = ingredients.reduce((sum, item) => sum + (item.price ?? 0), 0);
    return bunPrice + ingredientsSum;
  }
);
