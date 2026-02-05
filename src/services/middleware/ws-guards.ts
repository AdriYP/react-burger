import type { TOrders, TOrderStatus } from '@/types/order';

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

const isOrderStatus = (v: unknown): v is TOrderStatus =>
  v === 'created' || v === 'pending' || v === 'done' || v === 'canceled';

export const isOrdersPayload = (v: unknown): v is TOrders => {
  if (!isRecord(v)) return false;

  const success = v.success;
  if (!(typeof success === 'boolean' || success === null)) return false;

  const total = v.total;
  if (!(typeof total === 'number' || total === null)) return false;

  const totalToday = v.totalToday;
  if (!(typeof totalToday === 'number' || totalToday === null)) return false;

  if (!Array.isArray(v.orders)) return false;

  for (const o of v.orders) {
    if (!isRecord(o)) return false;

    if (
      !Array.isArray(o.ingredients) ||
      !o.ingredients.every((x) => typeof x === 'string')
    )
      return false;

    if (typeof o._id !== 'string') return false;
    if (!isOrderStatus(o.status)) return false;
    if (typeof o.number !== 'number') return false;

    if (typeof o.name !== 'string') return false;

    if (typeof o.createdAt !== 'string') return false;
    if (typeof o.updatedAt !== 'string') return false;
  }

  return true;
};
