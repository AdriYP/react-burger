import { describe, it, expect } from 'vitest';

import { ordersPayloadFixture } from '@/utils/test-fixtures/orders';
import { makeRootState } from '@/utils/test-fixtures/state';

import { ordersSlice, initialState, wsOpen, wsClose, wsError, wsMessage } from './slice';

describe('feedOrders slice', () => {
  it('should return default initial state', () => {
    expect(ordersSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' } as never)).toEqual(
      initialState
    );
  });

  it('should handle wsOpen', () => {
    expect(ordersSlice.reducer(initialState, wsOpen())).toEqual({
      ...initialState,
      isConnected: true,
    });
  });

  it('should handle wsClose', () => {
    const prev = { ...initialState, isConnected: true };
    expect(ordersSlice.reducer(prev, wsClose())).toEqual({
      ...prev,
      isConnected: false,
    });
  });

  it('should handle wsError', () => {
    expect(ordersSlice.reducer(initialState, wsError('socket error'))).toEqual({
      ...initialState,
      error: 'socket error',
    });
  });

  it('should handle wsMessage', () => {
    const prev = { ...initialState, error: 'old error' };

    expect(ordersSlice.reducer(prev, wsMessage(ordersPayloadFixture))).toEqual({
      ...prev,
      success: ordersPayloadFixture.success,
      orders: ordersPayloadFixture.orders,
      total: ordersPayloadFixture.total,
      totalToday: ordersPayloadFixture.totalToday,
    });
  });

  describe('selectors', () => {
    const feedOrdersStateFixture = {
      ...initialState,
      ...ordersPayloadFixture,
      isConnected: true,
      error: 'old error',
    };

    const stateFixture = makeRootState({ feedOrders: feedOrdersStateFixture });

    it('selectSuccess', () => {
      expect(ordersSlice.selectors.selectSuccess(stateFixture)).toBe(
        ordersPayloadFixture.success
      );
    });

    it('selectOrders', () => {
      expect(ordersSlice.selectors.selectOrders(stateFixture)).toEqual(
        ordersPayloadFixture.orders
      );
    });

    it('selectTotal', () => {
      expect(ordersSlice.selectors.selectTotal(stateFixture)).toBe(
        ordersPayloadFixture.total
      );
    });

    it('selectTotalToday', () => {
      expect(ordersSlice.selectors.selectTotalToday(stateFixture)).toBe(
        ordersPayloadFixture.totalToday
      );
    });

    it('selectConnected', () => {
      expect(ordersSlice.selectors.selectConnected(stateFixture)).toBe(true);
    });

    it('selectError', () => {
      expect(ordersSlice.selectors.selectError(stateFixture)).toBe('old error');
    });

    it('selectFeedOrders', () => {
      expect(ordersSlice.selectors.selectFeedOrders(stateFixture)).toEqual(
        feedOrdersStateFixture
      );
    });
  });
});
