import { getErrorMessage } from '@/utils/errors';
import { getIngredientsAPI } from '@/utils/stellar-api';

import type { AppThunk } from '@/services/store';
import type { TIngredient, TIngredientType } from '@/types/ingredient';

export const INGREDIENTS_SUCCESS = 'INGREDIENTS_SUCCESS' as const;
export const INGREDIENTS_REQUEST = 'INGREDIENTS_REQUEST' as const;
export const INGREDIENTS_ERROR = 'INGREDIENTS_ERROR' as const;

export type TIngredientsByType = Record<TIngredientType, string[]>;

export type TIngredientsRequestAction = { type: typeof INGREDIENTS_REQUEST };

export type TIngredientsSuccessAction = {
  type: typeof INGREDIENTS_SUCCESS;
  payload: {
    ingredientsList: TIngredient[];
    byType: TIngredientsByType;
  };
};

export type TIngredientsErrorAction = {
  type: typeof INGREDIENTS_ERROR;
  payload: string;
};

export type TIngredientsActions =
  | TIngredientsRequestAction
  | TIngredientsSuccessAction
  | TIngredientsErrorAction;

export const loadIngredients = (): AppThunk<Promise<void>> => (dispatch) => {
  dispatch({ type: INGREDIENTS_REQUEST });

  return getIngredientsAPI()
    .then((response) => {
      const ingredients = response.data;

      const byType: TIngredientsByType = {
        bun: [],
        sauce: [],
        main: [],
      };

      ingredients.forEach((ingredient) => {
        byType[ingredient.type].push(ingredient._id);
      });

      dispatch({
        type: INGREDIENTS_SUCCESS,
        payload: {
          ingredientsList: ingredients,
          byType,
        },
      });
    })
    .catch((error: unknown) => {
      dispatch({
        type: INGREDIENTS_ERROR,
        payload: getErrorMessage(error),
      });
    });
};
