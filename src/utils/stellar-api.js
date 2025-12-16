import { refreshToken as refreshTokenApi } from '@/utils/auth-api';
import { getAccessToken } from '@/utils/token';

export const API_BASE_URL = 'https://norma.education-services.ru/api';

const checkResponse = async (response) => {
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.ok) {
    return data;
  }

  const err = new Error(
    data?.message || `Ошибка: ${response.status} - ${response.statusText}`
  );
  err.status = response.status;
  err.data = data;
  throw err;
};

const checkSuccess = (res) => {
  if (res && res.success) return res;

  const err = new Error('Ответ сервера не success');
  err.status = 200;
  err.data = res;
  throw err;
};

// Универсальная функция запроса
const request = (endpoint, options) => {
  return fetch(`${API_BASE_URL}${endpoint}`, options)
    .then(checkResponse) // проверка HTTP-статуса и JSON
    .then(checkSuccess); // проверка res.success
};

export const getIngredientsAPI = () => request('/ingredients');

export const sendOrderAPI = async (order) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    const err = new Error('Нет accessToken — пользователь не авторизован');
    err.status = 401;
    throw err;
  }

  const doRequest = (token) =>
    request('/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(order),
    });

  try {
    return await doRequest(accessToken);
  } catch (err) {
    // если не 401 — пробрасываем
    if (err?.status !== 401) throw err;

    // пробуем обновить токен и повторить запрос
    const refreshed = await refreshTokenApi();
    return doRequest(refreshed.accessToken);
  }
};
