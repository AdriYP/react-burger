import { ADD_BUN, ADD_ITEM, DELETE_BUN, DELETE_ITEM, MOVE_INGREDIENT } from './actions';

const initialState = {
  bun: null, // объект булки
  ingredients: [], // массив объектов ингредиентов
};

export const constructorReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BUN: {
      return {
        ...state,
        bun: action.payload,
      };
    }

    case ADD_ITEM: {
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
      };
    }

    case DELETE_BUN: {
      return {
        ...state,
        bun: null,
      };
    }

    case DELETE_ITEM: {
      const constructorId = action.payload;

      return {
        ...state,
        ingredients: state.ingredients.filter(
          (item) => item.constructorId !== constructorId
        ),
      };
    }

    case MOVE_INGREDIENT: {
      const { fromIndex, toIndex } = action.payload;

      // защищаемся от мусора
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.ingredients.length ||
        toIndex >= state.ingredients.length
      ) {
        return state;
      }

      const newIngredients = [...state.ingredients];
      const [moved] = newIngredients.splice(fromIndex, 1);
      newIngredients.splice(toIndex, 0, moved);

      return {
        ...state,
        ingredients: newIngredients,
      };
    }

    default:
      return state;
  }
};
