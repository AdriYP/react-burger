import { INGREDIENTS_ERROR, INGREDIENTS_SUCCESS, INGREDIENTS_REQUEST } from './actions';

const initialState = {
  ingredientsList: [],
  byType: {
    bun: [],
    sauce: [],
    main: [],
  },
  loading: false,
  error: null,
};

export const ingredientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case INGREDIENTS_SUCCESS:
      return {
        ...state,
        ingredientsList: action.payload.ingredientsList,
        byType: action.payload.byType,
        loading: false,
      };
    case INGREDIENTS_REQUEST:
      return { ...state, loading: true, error: null };
    case INGREDIENTS_ERROR:
      return {
        ...state,
        ingredientsList: initialState.ingredientsList,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
