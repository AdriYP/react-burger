import { ADD_INGREDIENT_DETAILS, DELETE_INGREDIENT_DETAILS } from './actions';

const initialState = { item: null };

export const detailReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_INGREDIENT_DETAILS:
      return { ...state, item: action.payload };
    case DELETE_INGREDIENT_DETAILS:
      return { ...state, item: null };
    default:
      return state;
  }
};
