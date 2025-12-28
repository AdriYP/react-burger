import {
  selectConstructorBun,
  selectConstructorIngredients,
} from '@/services/burger-constructor/selectors';
import { sendOrderAPI } from '@/utils/stellar-api';

import type { TConstructorIngredient } from '@/services/burger-constructor/reducer';
import type { AppThunk } from '@/services/store';

// action types
export const CREATE_DATA_API = 'CREATE_DATA_API' as const;
export const ORDER_SUCCESS = 'ORDER_SUCCESS' as const;
export const ORDER_REQUEST = 'ORDER_REQUEST' as const;
export const ORDER_ERROR = 'ORDER_ERROR' as const;

// types (payloads)
export type TCreateOrderData = {
  ingredients: string[]; // массив id ингредиентов для API
};

export type TOrderSuccessPayload = {
  name: string;
  order: { number: number };
};

// actions
export type TCreateDataApiAction = {
  type: typeof CREATE_DATA_API;
  payload: TCreateOrderData;
};

export type TOrderRequestAction = {
  type: typeof ORDER_REQUEST;
};

export type TOrderSuccessAction = {
  type: typeof ORDER_SUCCESS;
  payload: TOrderSuccessPayload;
};

export type TOrderErrorAction = {
  type: typeof ORDER_ERROR;
  payload: string;
};

export type TOrderActions =
  | TCreateDataApiAction
  | TOrderRequestAction
  | TOrderSuccessAction
  | TOrderErrorAction;

// action creators
export const createDataAPI = (data: TCreateOrderData): TCreateDataApiAction => ({
  type: CREATE_DATA_API,
  payload: data,
});

export const orderRequest = (): TOrderRequestAction => ({ type: ORDER_REQUEST });

export const orderSuccess = (payload: TOrderSuccessPayload): TOrderSuccessAction => ({
  type: ORDER_SUCCESS,
  payload,
});

export const orderError = (message: string): TOrderErrorAction => ({
  type: ORDER_ERROR,
  payload: message,
});

//Отправка заказа.
export const sendOrder =
  (): AppThunk<Promise<unknown>> => async (dispatch, getState) => {
    const state = getState();

    const bun = selectConstructorBun(state);
    const ingredients = selectConstructorIngredients(state) as TConstructorIngredient[];

    // 1) Проверка: конструктор пуст
    if (!bun || ingredients.length === 0) {
      const message = 'Конструктор не заполнен, заказ не отправлен';
      dispatch(orderError(message));
      return Promise.reject(new Error(message));
    }

    const data: TCreateOrderData = {
      ingredients: [bun._id, ...ingredients.map((item) => item._id), bun._id],
    };

    // 2) Отправляем новый заказ
    dispatch(createDataAPI(data));
    dispatch(orderRequest());

    try {
      const response = await sendOrderAPI(data);

      dispatch(
        orderSuccess({
          name: response.name,
          order: { number: response.order.number },
        })
      );

      return response;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message || String(error);

      dispatch(orderError(message));
      throw error;
    }
  };
