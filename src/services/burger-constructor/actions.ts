import { v4 as uuidv4 } from 'uuid';

import type { TIngredient } from '@/types/ingredient';

import type { TConstructorIngredient } from './reducer';

export const ADD_BUN = 'ADD_BUN' as const;
export const ADD_ITEM = 'ADD_ITEM' as const;
export const DELETE_BUN = 'DELETE_BUN' as const;
export const DELETE_ITEM = 'DELETE_ITEM' as const;
export const MOVE_INGREDIENT = 'MOVE_INGREDIENT' as const;
export const CLEAR_CONSTRUCTOR = 'CLEAR_CONSTRUCTOR' as const;

export type TAddBunAction = { type: typeof ADD_BUN; payload: TIngredient };
export type TAddItemAction = { type: typeof ADD_ITEM; payload: TConstructorIngredient };
export type TDeleteBunAction = { type: typeof DELETE_BUN };
export type TDeleteItemAction = { type: typeof DELETE_ITEM; payload: string };
export type TClearConstructorAction = { type: typeof CLEAR_CONSTRUCTOR };
export type TMoveIngredientAction = {
  type: typeof MOVE_INGREDIENT;
  payload: { fromIndex: number; toIndex: number };
};

export type TConstructorActions =
  | TAddBunAction
  | TAddItemAction
  | TDeleteBunAction
  | TDeleteItemAction
  | TClearConstructorAction
  | TMoveIngredientAction;

// Добавление: булка -> ADD_BUN, начинка -> ADD_ITEM + constructorId
export const increaseItem = (item: TIngredient): TAddBunAction | TAddItemAction => {
  if (item.type === 'bun') {
    return { type: ADD_BUN, payload: item };
  }

  return {
    type: ADD_ITEM,
    payload: {
      ...item,
      constructorId: uuidv4(),
    },
  };
};

// Удаление начинки из конструктора (для строк конструктора)
export const decreaseItem = (item: TConstructorIngredient): TDeleteItemAction => ({
  type: DELETE_ITEM,
  payload: item.constructorId,
});

// Удаление булки (верх/низ)
export const deleteBun = (): TDeleteBunAction => ({ type: DELETE_BUN });

// Перетаскивание внутри конструктора
export const moveIngredient = (
  fromIndex: number,
  toIndex: number
): TMoveIngredientAction => ({
  type: MOVE_INGREDIENT,
  payload: { fromIndex, toIndex },
});

export const clearConstructor = (): TClearConstructorAction => ({
  type: CLEAR_CONSTRUCTOR,
});
