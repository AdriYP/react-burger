// src/utils/api-order.ts

import { API_BASE_URL } from './api-base';
import { buildError } from './errors';

import type { TOrder } from '@/types/order';

type TOrderByNumberResponse = {
  success: boolean;
  orders: TOrder[];
};

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

export const getOrderByNumber = async (orderNumber: number): Promise<TOrder> => {
  const res = await fetch(`${API_BASE_URL}/orders/${orderNumber}`);

  let data: unknown;
  try {
    data = (await res.json()) as unknown;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      isObject(data) && typeof data.message === 'string'
        ? (data.message as string)
        : `HTTP ${res.status}: ${res.statusText}`;

    throw buildError(message, res.status, data);
  }

  if (!isObject(data) || !Array.isArray((data as TOrderByNumberResponse).orders)) {
    throw buildError('Некорректный ответ сервера', res.status, data);
  }

  const typed = data as TOrderByNumberResponse;

  if (!typed.success || typed.orders.length === 0) {
    throw buildError('Заказ не найден', res.status, data);
  }

  return typed.orders[0];
};
