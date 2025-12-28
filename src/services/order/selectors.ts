import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/services/store';

import type { TOrderState } from './reducer';

export const selectOrderState = (state: RootState): TOrderState => state.order;

export const selectOrderNumber = createSelector(
  [selectOrderState],
  (order): number | null => order.dataReceived?.order?.number ?? null
);

export const selectOrderLoading = createSelector(
  [selectOrderState],
  (order): boolean => order.loading
);

export const selectOrderError = createSelector(
  [selectOrderState],
  (order): string | null => order.error
);
