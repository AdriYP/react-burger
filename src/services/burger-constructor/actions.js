import { v4 as uuidv4 } from 'uuid';

export const ADD_BUN = 'ADD_BUN';
export const ADD_ITEM = 'ADD_ITEM';
export const DELETE_BUN = 'DELETE_BUN';
export const DELETE_ITEM = 'DELETE_ITEM';
export const MOVE_INGREDIENT = 'MOVE_INGREDIENT';

export const increaseItem = (item) => {
  if (item.type === 'bun') {
    return { type: ADD_BUN, payload: item };
  } else {
    return {
      type: ADD_ITEM,
      payload: {
        ...item,
        constructorId: uuidv4(), // уникальный id
      },
    };
  }
};

export const decreaseItem = (item) => {
  if (item.type === 'bun') {
    return { type: DELETE_BUN };
  } else {
    return {
      type: DELETE_ITEM,
      payload: item.constructorId,
    };
  }
};

export const moveIngredient = (fromIndex, toIndex) => ({
  type: MOVE_INGREDIENT,
  payload: { fromIndex, toIndex },
});
