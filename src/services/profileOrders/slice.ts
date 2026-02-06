import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TOrders } from '@/types/order';

export type TOrdersStore = TOrders & {
  isConnected: boolean;
  error: string | null;
};

export const initialState: TOrdersStore = {
  success: null,
  orders: [],
  total: null,
  totalToday: null,
  isConnected: false,
  error: null,
};

export const profileOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  selectors: {
    selectSuccess: (state) => state.success,
    selectOrders: (state) => state.orders,
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday,
    selectConnected: (state) => state.isConnected,
    selectError: (state) => state.error,
    selectUserOrders: (state) => state,
  },
  reducers: {
    wsOpen: (state) => {
      state.isConnected = true;
    },
    wsClose: (state) => {
      state.isConnected = false;
    },
    wsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    wsMessage: (state, action: PayloadAction<TOrders>) => {
      state.success = action.payload.success;
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
  },
});

export const { wsClose, wsError, wsOpen, wsMessage } = profileOrdersSlice.actions;
export const {
  selectSuccess,
  selectOrders,
  selectTotal,
  selectTotalToday,
  selectConnected,
  selectError,
  selectUserOrders,
} = profileOrdersSlice.selectors;

export type TUserOrdersWsActions =
  | ReturnType<typeof wsOpen>
  | ReturnType<typeof wsClose>
  | ReturnType<typeof wsError>
  | ReturnType<typeof wsMessage>;
