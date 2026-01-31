import {
  ADD_BUN,
  ADD_ITEM,
  DELETE_BUN,
  DELETE_ITEM,
  MOVE_INGREDIENT,
  CLEAR_CONSTRUCTOR,
  type TConstructorActions,
} from './actions';

import type { TIngredient } from '@/types/ingredient';

export type TConstructorIngredient = TIngredient & {
  constructorId: string;
};

export type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

export const constructorReducer = (
  state: TConstructorState = initialState,
  action: TConstructorActions
): TConstructorState => {
  switch (action.type) {
    case ADD_BUN:
      return { ...state, bun: action.payload };

    case ADD_ITEM:
      return { ...state, ingredients: [...state.ingredients, action.payload] };

    case DELETE_BUN:
      return { ...state, bun: null };

    case DELETE_ITEM:
      return {
        ...state,
        ingredients: state.ingredients.filter((i) => i.constructorId !== action.payload),
      };

    case MOVE_INGREDIENT: {
      const { fromIndex, toIndex } = action.payload;

      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.ingredients.length ||
        toIndex >= state.ingredients.length
      ) {
        return state;
      }

      const next = [...state.ingredients];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);

      return { ...state, ingredients: next };
    }

    case CLEAR_CONSTRUCTOR:
      return initialState;

    default:
      return state;
  }
};
