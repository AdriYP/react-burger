import { createSelector } from '@reduxjs/toolkit';

import type { TIngredient, TIngredientType } from '@/types/ingredient';

import type { RootState } from '../store';

const selectIngredientsList = (state: RootState): TIngredient[] =>
  state.ingredients.ingredientsList;

const selectByType = (state: RootState): Record<TIngredientType, string[]> =>
  state.ingredients.byType;

const isIngredient = (v: TIngredient | undefined): v is TIngredient => Boolean(v);

export const selectIngredientsByType = (
  type: TIngredientType
): ((state: RootState) => TIngredient[]) =>
  createSelector(
    [selectIngredientsList, selectByType],
    (ingredientsList, byType): TIngredient[] => {
      return byType[type]
        .map((id) => ingredientsList.find((ingredient) => ingredient._id === id))
        .filter(isIngredient);
    }
  );
