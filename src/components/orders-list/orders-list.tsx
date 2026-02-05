import { OrderCard } from '@/components/order-card/order-card';

import type React from 'react';

import type { TOrderCardProps } from '@/components/order-card/order-card';

import styles from './orders-list.module.css';

export type TOrdersListProps = {
  orders: TOrderCardProps[];
  onOrderClick?: (orderNumber: number) => void;
};

export const OrdersList = ({
  orders,
  onOrderClick,
}: TOrdersListProps): React.ReactElement => {
  return (
    <section className={styles.list}>
      {orders.map((order) => (
        <OrderCard
          key={order.number}
          {...order}
          onClick={() => onOrderClick?.(order.number)}
        />
      ))}
    </section>
  );
};
