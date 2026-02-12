import { describe, it, expect } from 'vitest';

import { CREATE_DATA_API, ORDER_REQUEST, ORDER_SUCCESS, ORDER_ERROR } from './actions';
import { orderReducer, initialState } from './reducer';

import type { TCreateOrderData, TOrderSuccessPayload } from './actions';
import type { TOrderState } from './reducer';

describe('orderReducer', () => {
  const createOrderData: TCreateOrderData = {
    ingredients: [
      '60666c42cc7b410027a1a9b1', // bun
      '60666c42cc7b410027a1a9b5', // main
      '60666c42cc7b410027a1a9b7', // sauce
      '60666c42cc7b410027a1a9b1', // bun (как в sendOrder: bun в начале и в конце)
    ],
  };

  const orderSuccessPayload: TOrderSuccessPayload = {
    name: 'Space burger',
    order: { number: 12345 },
  };

  it('should return default initial state', () => {
    expect(orderReducer(undefined, { type: 'UNKNOWN_ACTION' } as never)).toEqual(
      initialState
    );
  });

  it('should handle CREATE_DATA_API', () => {
    const next = orderReducer(initialState, {
      type: CREATE_DATA_API,
      payload: createOrderData,
    });

    expect(next).toEqual({
      ...initialState,
      dataSend: createOrderData,
    });
  });

  it('should handle ORDER_REQUEST', () => {
    const prev: TOrderState = { ...initialState, error: 'previous error' };

    const next = orderReducer(prev, { type: ORDER_REQUEST });

    expect(next).toEqual({
      ...prev,
      loading: true,
      error: null,
    });
  });

  it('should handle ORDER_SUCCESS', () => {
    const prev: TOrderState = {
      ...initialState,
      loading: true,
      error: 'previous error',
    };

    const next = orderReducer(prev, {
      type: ORDER_SUCCESS,
      payload: orderSuccessPayload,
    });

    expect(next).toEqual({
      ...prev,
      loading: false,
      dataReceived: orderSuccessPayload,
      error: null,
    });
  });

  it('should handle ORDER_ERROR', () => {
    const prev: TOrderState = { ...initialState, loading: true, error: null };

    const next = orderReducer(prev, {
      type: ORDER_ERROR,
      payload: 'network error',
    });

    expect(next).toEqual({
      ...prev,
      loading: false,
      error: 'network error',
    });
  });
});
