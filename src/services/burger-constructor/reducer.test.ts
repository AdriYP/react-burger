import { describe, it, expect } from 'vitest';

import {
  bunFixture as bun,
  ingredient1Fixture as ingredient1,
  ingredient2Fixture as ingredient2,
} from '@/utils/test-fixtures/ingredients';

import {
  ADD_BUN,
  ADD_ITEM,
  DELETE_BUN,
  DELETE_ITEM,
  MOVE_INGREDIENT,
  CLEAR_CONSTRUCTOR,
} from './actions';
import { constructorReducer, initialState } from './reducer';

import type { TConstructorState } from './reducer';

describe('constructorReducer', () => {
  it('should return default initial state', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN_ACTION' } as never)).toEqual(
      initialState
    );
  });

  it('should handle ADD_BUN', () => {
    const next = constructorReducer(initialState, { type: ADD_BUN, payload: bun });

    expect(next).toEqual({
      ...initialState,
      bun,
    });
  });

  it('should handle ADD_ITEM (adds ingredient to the end)', () => {
    const next = constructorReducer(initialState, {
      type: ADD_ITEM,
      payload: ingredient1,
    });

    expect(next.bun).toBeNull();
    expect(next.ingredients).toEqual([ingredient1]);
  });

  it('should handle DELETE_BUN', () => {
    const prev: TConstructorState = { ...initialState, bun };

    const next = constructorReducer(prev, { type: DELETE_BUN });

    expect(next.bun).toBeNull();
    expect(next.ingredients).toEqual([]);
  });

  it('should handle DELETE_ITEM (removes by constructorId)', () => {
    const prev: TConstructorState = {
      bun: null,
      ingredients: [ingredient1, ingredient2],
    };

    const next = constructorReducer(prev, {
      type: DELETE_ITEM,
      payload: ingredient1.constructorId,
    });

    expect(next.ingredients).toEqual([ingredient2]);
  });

  it('should handle MOVE_INGREDIENT (reorders items)', () => {
    const prev: TConstructorState = {
      bun: null,
      ingredients: [ingredient1, ingredient2],
    };

    const next = constructorReducer(prev, {
      type: MOVE_INGREDIENT,
      payload: { fromIndex: 0, toIndex: 1 },
    });

    expect(next.ingredients).toEqual([ingredient2, ingredient1]);
  });

  it('should return the same state object on MOVE_INGREDIENT if fromIndex === toIndex', () => {
    const prev: TConstructorState = {
      bun: null,
      ingredients: [ingredient1, ingredient2],
    };

    const next = constructorReducer(prev, {
      type: MOVE_INGREDIENT,
      payload: { fromIndex: 1, toIndex: 1 },
    });

    // В редьюсере: return state;
    expect(next).toBe(prev);
  });

  it('should return the same state object on MOVE_INGREDIENT if indexes are out of range', () => {
    const prev: TConstructorState = {
      bun: null,
      ingredients: [ingredient1, ingredient2],
    };

    const nextNegative = constructorReducer(prev, {
      type: MOVE_INGREDIENT,
      payload: { fromIndex: -1, toIndex: 1 },
    });

    const nextTooBig = constructorReducer(prev, {
      type: MOVE_INGREDIENT,
      payload: { fromIndex: 0, toIndex: 999 },
    });

    expect(nextNegative).toBe(prev);
    expect(nextTooBig).toBe(prev);
  });

  it('should handle CLEAR_CONSTRUCTOR (resets to initialState)', () => {
    const prev: TConstructorState = {
      bun,
      ingredients: [ingredient1, ingredient2],
    };

    const next = constructorReducer(prev, { type: CLEAR_CONSTRUCTOR });

    expect(next).toEqual(initialState);
  });
});
