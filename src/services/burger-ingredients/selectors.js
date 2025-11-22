import { createSelector } from '@reduxjs/toolkit';

const selectIngredientsList = (state) => state.ingredients.ingredientsList;
const selectByType = (state) => state.ingredients.byType;

export const selectIngredientsByType = (type) =>
  createSelector([selectIngredientsList, selectByType], (ingredientsList, byType) => {
    return byType[type]
      .map((id) => ingredientsList.find((ingredient) => ingredient._id === id))
      .filter(Boolean);
  });
