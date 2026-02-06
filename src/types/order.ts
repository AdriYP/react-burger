export type TOrderStatus = 'created' | 'pending' | 'done' | 'canceled';

export type TOrder = {
  ingredients: string[];
  _id: string;
  status: TOrderStatus;
  number: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type TOrders = {
  success: boolean | null;
  orders: TOrder[];
  total: number | null;
  totalToday: number | null;
};
