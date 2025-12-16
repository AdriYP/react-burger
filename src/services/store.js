import { composeWithDevTools } from '@redux-devtools/extension';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { authReducer } from './auth/reducer';
import { constructorReducer } from './burger-constructor/reducer';
import { ingredientsReducer } from './burger-ingredients/reducer';
//import { detailReducer } from './ingredient-details/reducer';
import { orderReducer } from './order/reducer';
import { taskReducer } from './task/reducer';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorItems: constructorReducer,
  //moreInfo: detailReducer,
  tasks: taskReducer,
  order: orderReducer,

  auth: authReducer,
});

export const configureStore = (initialState) => {
  return createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunk))
  );
};
