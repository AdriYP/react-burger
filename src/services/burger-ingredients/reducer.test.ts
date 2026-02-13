import { describe, it, expect } from 'vitest';

import { ingredients, byTypeFixture } from '@/utils/test-fixtures/ingredients';

import { INGREDIENTS_REQUEST, INGREDIENTS_SUCCESS, INGREDIENTS_ERROR } from './actions';
import { ingredientsReducer, initialState } from './reducer';

import type { TIngredientsState } from './reducer';

describe('ingredientsReducer', () => {
  it('should return default initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' } as never)).toEqual(
      initialState
    );
  });

  it('should handle INGREDIENTS_REQUEST', () => {
    const prev: TIngredientsState = { ...initialState, error: 'some error' };

    const next = ingredientsReducer(prev, { type: INGREDIENTS_REQUEST });

    expect(next).toEqual({
      ...prev,
      loading: true,
      error: null,
    });
  });

  it('should handle INGREDIENTS_SUCCESS', () => {
    const prev: TIngredientsState = {
      ...initialState,
      loading: true,
      error: 'previous error',
    };

    const payload = {
      ingredientsList: ingredients,
      byType: byTypeFixture,
    };

    const next = ingredientsReducer(prev, { type: INGREDIENTS_SUCCESS, payload });

    expect(next).toEqual({
      ...prev,
      ingredientsList: ingredients,
      byType: byTypeFixture,
      loading: false,
      error: null,
    });
  });

  it('should handle INGREDIENTS_ERROR (resets list and byType to initial + sets error)', () => {
    const prev: TIngredientsState = {
      ingredientsList: ingredients,
      byType: byTypeFixture,
      loading: true,
      error: null,
    };

    const next = ingredientsReducer(prev, {
      type: INGREDIENTS_ERROR,
      payload: 'network error',
    });

    expect(next).toEqual({
      ...prev,
      ingredientsList: initialState.ingredientsList,
      byType: initialState.byType,
      loading: false,
      error: 'network error',
    });
  });
});
