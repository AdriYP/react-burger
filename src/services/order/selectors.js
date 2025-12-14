// services/order/selectors.js
import { createSelector } from '@reduxjs/toolkit';

export const selectOrderState = (state) => state.order;

export const selectOrderNumber = createSelector(
  [selectOrderState],
  (order) => order.dataReceived?.order?.number ?? null
);

export const selectOrderLoading = createSelector(
  [selectOrderState],
  (order) => order.loading
);

export const selectOrderError = createSelector(
  [selectOrderState],
  (order) => order.error
);
