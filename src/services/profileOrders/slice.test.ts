import { describe, it, expect } from 'vitest';

import { ordersPayloadFixture } from '@/utils/test-fixtures/orders';
import { makeRootState } from '@/utils/test-fixtures/state';

import {
  profileOrdersSlice,
  initialState,
  wsOpen,
  wsClose,
  wsError,
  wsMessage,
} from './slice';

describe('profileOrders slice', () => {
  it('should return default initial state', () => {
    expect(
      profileOrdersSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' } as never)
    ).toEqual(initialState);
  });

  it('should handle wsOpen', () => {
    expect(profileOrdersSlice.reducer(initialState, wsOpen())).toEqual({
      ...initialState,
      isConnected: true,
    });
  });

  it('should handle wsClose', () => {
    const prev = { ...initialState, isConnected: true };
    expect(profileOrdersSlice.reducer(prev, wsClose())).toEqual({
      ...prev,
      isConnected: false,
    });
  });

  it('should handle wsError', () => {
    expect(profileOrdersSlice.reducer(initialState, wsError('socket error'))).toEqual({
      ...initialState,
      error: 'socket error',
    });
  });

  it('should handle wsMessage', () => {
    const prev = { ...initialState, error: 'old error' };

    expect(profileOrdersSlice.reducer(prev, wsMessage(ordersPayloadFixture))).toEqual({
      ...prev,
      success: ordersPayloadFixture.success,
      orders: ordersPayloadFixture.orders,
      total: ordersPayloadFixture.total,
      totalToday: ordersPayloadFixture.totalToday,
    });
  });

  describe('selectors', () => {
    const userOrdersStateFixture = {
      ...initialState,
      ...ordersPayloadFixture,
      isConnected: false,
      error: null,
    };

    const stateFixture = makeRootState({ userOrders: userOrdersStateFixture });

    it('selectSuccess', () => {
      expect(profileOrdersSlice.selectors.selectSuccess(stateFixture)).toBe(
        ordersPayloadFixture.success
      );
    });

    it('selectOrders', () => {
      expect(profileOrdersSlice.selectors.selectOrders(stateFixture)).toEqual(
        ordersPayloadFixture.orders
      );
    });

    it('selectTotal', () => {
      expect(profileOrdersSlice.selectors.selectTotal(stateFixture)).toBe(
        ordersPayloadFixture.total
      );
    });

    it('selectTotalToday', () => {
      expect(profileOrdersSlice.selectors.selectTotalToday(stateFixture)).toBe(
        ordersPayloadFixture.totalToday
      );
    });

    it('selectConnected', () => {
      expect(profileOrdersSlice.selectors.selectConnected(stateFixture)).toBe(false);
    });

    it('selectError', () => {
      expect(profileOrdersSlice.selectors.selectError(stateFixture)).toBeNull();
    });

    it('selectUserOrders', () => {
      expect(profileOrdersSlice.selectors.selectUserOrders(stateFixture)).toEqual(
        userOrdersStateFixture
      );
    });
  });
});
