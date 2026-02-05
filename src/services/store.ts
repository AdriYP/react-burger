import { configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import { authReducer } from './auth/reducer';
import { constructorReducer } from './burger-constructor/reducer';
import { ingredientsReducer } from './burger-ingredients/reducer';
import { ordersSlice, type TFeedOrdersWsActions } from './feedOrders/slice';
import { ordersMiddleware } from './feedOrders/ws-middleware';
import { orderReducer } from './order/reducer';
import { profileOrdersSlice, type TUserOrdersWsActions } from './profileOrders/slice';
import { userOrdersMiddleware } from './profileOrders/ws-middleware';

import type { ThunkAction, ThunkDispatch } from 'redux-thunk';

import type { TAuthActions } from './auth/actions';
import type { TConstructorActions } from './burger-constructor/actions';
import type { TIngredientsActions } from './burger-ingredients/actions';
import type { TOrdersConnectActions } from './feedOrders/actions';
import type { TOrderActions } from './order/actions';
import type { TProfileConnectActions } from './profileOrders/actions';

export type TAppActions =
  | TProfileConnectActions
  | TOrdersConnectActions
  | TConstructorActions
  | TIngredientsActions
  | TOrderActions
  | TUserOrdersWsActions
  | TFeedOrdersWsActions
  | TAuthActions;

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorItems: constructorReducer,
  order: orderReducer,
  auth: authReducer,
  feedOrders: ordersSlice.reducer,
  userOrders: profileOrdersSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  TAppActions
>;

export type AppDispatch = ThunkDispatch<RootState, unknown, TAppActions>;

export const configureAppStore = (): EnhancedStore<RootState> => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(ordersMiddleware, userOrdersMiddleware),
  });
};

export type AppStore = ReturnType<typeof configureStore>;
