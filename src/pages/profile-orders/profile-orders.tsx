// src/pages/profile-orders/profile-orders.tsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { OrdersList } from '@/components/orders-list/orders-list';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { profileConnect, profileDisconnect } from '@/services/profileOrders/actions';
import { selectOrders } from '@/services/profileOrders/slice';
// import { profileConnect, profileDisconnect } from '@/services/orders/ws-actions';
// import { connect, disconnect } from '@/services/my-orders/actions';
import { WS_PROFILE_URL } from '@/utils/api-base';

import type React from 'react';

import type { TOrderCardProps } from '@/components/order-card/order-card';
import type { TOrder } from '@/types/order';

import styles from './profile-orders.module.css';

export const ProfileOrdersPage = (): React.ReactElement => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect((): (() => void) => {
    console.log(`!!! WS_PROFILE_URL`);
    console.log(WS_PROFILE_URL);
    dispatch(profileConnect(WS_PROFILE_URL));

    return (): void => {
      dispatch(profileDisconnect());
    };
  }, [dispatch]);

  const orders = useAppSelector(selectOrders);
  console.log(orders.length);
  const profileOrders: TOrder[] = [...((orders ?? []) as TOrder[])].reverse();

  const ordersForCards: TOrderCardProps[] = profileOrders.map(
    (order: TOrder): TOrderCardProps => ({
      number: order.number,
      name: order.name ?? `Заказ #${order.number}`,
      status: order.status,
      createdAt: order.createdAt,
      ingredientIds: order.ingredients,
    })
  );

  const handleOrderClick = (orderNumber: number): void => {
    navigate(`/profile/orders/${orderNumber}`, {
      state: { background: location },
    });
  };

  return (
    <div className={`${styles.content} mb-1`}>
      <OrdersList orders={ordersForCards} onOrderClick={handleOrderClick} />
    </div>
  );
};
