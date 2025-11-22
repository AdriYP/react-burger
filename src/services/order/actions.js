import {
  selectConstructorBun,
  selectConstructorIngredients,
} from '@/services/burger-constructor/selectors';
import { sendOrderAPI } from '@/utils/stellar-api';

export const CREATE_DATA_API = 'CREATE_DATA_API';
export const ORDER_SUCCESS = 'ORDER_SUCCESS';
export const ORDER_REQUEST = 'ORDER_REQUEST';
export const ORDER_ERROR = 'ORDER_ERROR';

export const createDataAPI = (data) => ({
  type: CREATE_DATA_API,
  payload: data,
});

export const sendOrder = () => (dispatch, getState) => {
  const state = getState();

  const bun = selectConstructorBun(state);
  const ingredients = selectConstructorIngredients(state);

  // 1. Проверка: конструктор пуст
  if (!bun || !Array.isArray(ingredients) || ingredients.length === 0) {
    const error = new Error('Конструктор не заполнен, заказ не отправлен');
    dispatch({ type: ORDER_ERROR, payload: error.message });
    return Promise.reject(error);
  }

  const data = {
    ingredients: [bun._id, ...ingredients.map((item) => item._id), bun._id],
  };

  const prevData = state.order.dataSend;

  const isSame =
    prevData &&
    Array.isArray(prevData.ingredients) &&
    prevData.ingredients.length === data.ingredients.length &&
    prevData.ingredients.every((id, i) => id === data.ingredients[i]);

  // 2. Если набор такой же — не дергаем API
  if (isSame) {
    // возвращаем прерыдущий набор данных
    return Promise.resolve(prevData);
  }

  // 3. Отправляем новый заказ
  dispatch(createDataAPI(data));
  dispatch({ type: ORDER_REQUEST });

  return sendOrderAPI(data)
    .then((response) => {
      if (!response.success) {
        throw new Error('API returned success: false');
      }

      dispatch({
        type: ORDER_SUCCESS,
        payload: {
          name: response.name,
          order: { number: response.order.number },
        },
      });

      return response;
    })
    .catch((error) => {
      dispatch({
        type: ORDER_ERROR,
        payload: error?.message || String(error),
      });
      throw error;
    });
};
