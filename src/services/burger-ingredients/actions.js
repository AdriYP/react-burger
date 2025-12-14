import { getIngredientsAPI } from '@/utils/stellar-api';

export const INGREDIENTS_SUCCESS = 'INGREDIENTS_SUCCESS';
export const INGREDIENTS_REQUEST = 'INGREDIENTS_REQUEST';
export const INGREDIENTS_ERROR = 'INGREDIENTS_ERROR';

export const loadIngredients = () => (dispatch) => {
  dispatch({ type: INGREDIENTS_REQUEST });

  return getIngredientsAPI()
    .then((response) => {
      const ingredients = response.data;

      const byType = {
        bun: [],
        sauce: [],
        main: [],
      };

      ingredients.forEach((ingredient) => {
        if (Object.hasOwn(byType, ingredient.type)) {
          byType[ingredient.type].push(ingredient._id);
        }
      });

      dispatch({
        type: INGREDIENTS_SUCCESS,
        payload: {
          ingredientsList: ingredients,
          byType,
        },
      });
    })
    .catch((error) => {
      dispatch({
        type: INGREDIENTS_ERROR,
        payload: error?.message || String(error),
      });
    });
};
