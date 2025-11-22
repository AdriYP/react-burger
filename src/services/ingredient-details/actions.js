export const ADD_INGREDIENT_DETAILS = 'ADD_INGREDIENT_DETAILS';
export const DELETE_INGREDIENT_DETAILS = 'DELETE_INGREDIENT_DETAILS';

export const addDetailedIngredient = (item) => {
  return {
    type: ADD_INGREDIENT_DETAILS,
    payload: item,
  };
};

export const deleteDetailedIngredient = () => {
  return {
    type: DELETE_INGREDIENT_DETAILS,
  };
};
