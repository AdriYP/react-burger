import { INGREDIENTS_ERROR, INGREDIENTS_SUCCESS, INGREDIENTS_REQUEST } from './actions';

import type { TIngredient } from '@/types/ingredient';

export type TIngredientsByType = {
  bun: string[];
  sauce: string[];
  main: string[];
};

export type TIngredientsState = {
  ingredientsList: TIngredient[];
  byType: TIngredientsByType;
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredientsList: [],
  byType: {
    bun: [],
    sauce: [],
    main: [],
  },
  loading: false,
  error: null,
};

type TIngredientsRequestAction = { type: typeof INGREDIENTS_REQUEST };

type TIngredientsSuccessAction = {
  type: typeof INGREDIENTS_SUCCESS;
  payload: {
    ingredientsList: TIngredient[];
    byType: TIngredientsByType;
  };
};

type TIngredientsErrorAction = {
  type: typeof INGREDIENTS_ERROR;
  payload: string;
};

type TIngredientsActions =
  | TIngredientsRequestAction
  | TIngredientsSuccessAction
  | TIngredientsErrorAction;

export const ingredientsReducer = (
  state: TIngredientsState = initialState,
  action: TIngredientsActions
): TIngredientsState => {
  switch (action.type) {
    case INGREDIENTS_SUCCESS:
      return {
        ...state,
        ingredientsList: action.payload.ingredientsList,
        byType: action.payload.byType,
        loading: false,
        error: null,
      };

    case INGREDIENTS_REQUEST:
      return { ...state, loading: true, error: null };

    case INGREDIENTS_ERROR:
      return {
        ...state,
        ingredientsList: initialState.ingredientsList,
        byType: initialState.byType,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
