import { createAction } from '@reduxjs/toolkit';

export const feedConnect = createAction<string, 'orders/connect'>('orders/connect');
export const feedDisconnect = createAction('orders/disconnect');

export type TOrdersConnectActions =
  | ReturnType<typeof feedConnect>
  | ReturnType<typeof feedDisconnect>;
