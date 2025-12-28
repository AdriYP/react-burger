import { API_BASE_URL } from '@/utils/api-base';
import { refreshToken as refreshTokenApi } from '@/utils/auth-api';
import { getErrorStatus, buildError } from '@/utils/errors';
import { getAccessToken } from '@/utils/token';

import type { TApiSuccess } from '@/types/api';
import type { TIngredient } from '@/types/ingredient';

type TIngredientsResponse = TApiSuccess<{ data: TIngredient[] }>;
export type TSendOrderBody = { ingredients: string[] };

type TSendOrderResponse = TApiSuccess<{
  name: string;
  order: { number: number };
}>;

type TSuccessFlag = { success: boolean; message?: string };

const hasMessage = (v: unknown): v is { message: string } => {
  if (typeof v !== 'object' || v === null) return false;
  const rec = v as Record<string, unknown>;
  return typeof rec.message === 'string';
};

const checkResponse = async (response: Response): Promise<unknown> => {
  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.ok) return data;

  const msg = hasMessage(data)
    ? data.message
    : `Ошибка: ${response.status} - ${response.statusText}`;

  throw buildError(msg, response.status, data);
};

const checkSuccess = <T extends TSuccessFlag>(res: T): T => {
  if (res?.success) return res;
  throw buildError('Ответ сервера не success', 200, res);
};

// Универсальная функция запроса
const request = async <T extends TSuccessFlag>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await checkResponse(res);
  return checkSuccess(data as T);
};

export const getIngredientsAPI = (): Promise<TIngredientsResponse> =>
  request<TIngredientsResponse>('/ingredients');

export const sendOrderAPI = async (
  order: TSendOrderBody
): Promise<TSendOrderResponse> => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw buildError('Нет accessToken — пользователь не авторизован', 401);
  }

  const doRequest = (token: string): Promise<TSendOrderResponse> =>
    request<TSendOrderResponse>('/orders', {
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
    if (getErrorStatus(err) !== 401) throw err;

    const refreshed = await refreshTokenApi();
    return doRequest(refreshed.accessToken);
  }
};
