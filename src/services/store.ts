import { composeWithDevTools } from '@redux-devtools/extension';
import {
  applyMiddleware,
  combineReducers,
  createStore,
  type Store,
  type StoreEnhancer,
  type UnknownAction,
} from 'redux';
import { thunk } from 'redux-thunk';

import { authReducer } from './auth/reducer';
import { constructorReducer } from './burger-constructor/reducer';
import { ingredientsReducer } from './burger-ingredients/reducer';
import { orderReducer } from './order/reducer';

import type { ThunkAction, ThunkDispatch } from 'redux-thunk';

const enhancer: StoreEnhancer = composeWithDevTools(applyMiddleware(thunk));

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorItems: constructorReducer,
  order: orderReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

//общий тип для thunks
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>;

//dispatch, который умеет thunk
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;

export const configureStore = (): Store<RootState> => {
  return createStore(rootReducer, undefined, enhancer);
};

export type AppStore = ReturnType<typeof configureStore>;
