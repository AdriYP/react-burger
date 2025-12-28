import type { TIngredient } from '@/types/ingredient';

import type { RootState } from '../store';

export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.loading;

export const selectIngredientsError = (state: RootState): string | null =>
  state.ingredients.error;

export const selectIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.ingredientsList;
