import type { TOrders } from '@/types/order';

export const ordersPayloadFixture: TOrders = {
  success: true,
  orders: [
    {
      _id: 'order-1',
      ingredients: ['60666c42cc7b410027a1a9b1', '60666c42cc7b410027a1a9b5'],
      status: 'done',
      number: 12345,
      name: 'Test order',
      createdAt: '2026-02-12T12:00:00.000Z',
      updatedAt: '2026-02-12T12:05:00.000Z',
    },
    {
      _id: 'order-2',
      ingredients: ['60666c42cc7b410027a1a9b1', '60666c42cc7b410027a1a9b7'],
      status: 'pending',
      number: 12346,
      name: 'Test order 2',
      createdAt: '2026-02-12T13:00:00.000Z',
      updatedAt: '2026-02-12T13:02:00.000Z',
    },
  ],
  total: 100,
  totalToday: 7,
};
