import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { CenteredPreloader } from '@/components/custom-preloader/custom-preloader';
import { OrderInfo } from '@/components/order-info/order-info';
import { selectFeedOrders } from '@/services/feedOrders/slice';
import { useAppSelector } from '@/services/hooks';
import { selectUserOrders } from '@/services/profileOrders/slice';
import { getOrderByNumber } from '@/utils/api-order';

import type React from 'react';

import type { TOrder } from '@/types/order';

import styles from './order-info.module.css';

type TRouteParams = {
  number?: string;
};

type TOrderInfoPageProps = {
  /** если true — номер внутри OrderInfo не показываем (используем заголовок модалки) */
  hideNumber?: boolean;
};

export const OrderInfoPage = ({
  hideNumber = false,
}: TOrderInfoPageProps): React.ReactElement => {
  const params = useParams<TRouteParams>();
  const location = useLocation();

  const rawNumber = params.number;
  const orderNumber = rawNumber ? Number(rawNumber) : NaN;

  const isProfileOrders = location.pathname.startsWith('/profile/orders');

  const { orders: wsOrders } = useAppSelector(
    isProfileOrders ? selectUserOrders : selectFeedOrders
  );

  const wsOrder: TOrder | null = !Number.isNaN(orderNumber)
    ? ((wsOrders.find((o) => o.number === orderNumber) as TOrder | undefined) ?? null)
    : null;

  const [order, setOrder] = useState<TOrder | null>(wsOrder);
  const [loading, setLoading] = useState<boolean>(
    !wsOrder && !Number.isNaN(orderNumber)
  );
  const [error, setError] = useState<string | null>(null);

  // если WS отдал нужный заказ — используем его
  useEffect((): void => {
    if (wsOrder) {
      setOrder(wsOrder);
      setLoading(false);
      setError(null);
    }
  }, [wsOrder]);

  // если среди последних 50 заказов нужного нет — добиваемся REST-запросом /orders/{number}
  useEffect(() => {
    if (wsOrder || Number.isNaN(orderNumber)) return;

    let cancelled = false;

    const loadOrder = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const loaded = await getOrderByNumber(orderNumber);

        if (!cancelled) {
          setOrder(loaded);
        }
      } catch (err) {
        if (cancelled) return;
        const msg =
          err instanceof Error ? err.message : 'Ошибка загрузки информации о заказе';
        setError(msg);
        setOrder(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadOrder();

    return (): void => {
      cancelled = true;
    };
  }, [wsOrder, orderNumber]);

  if (Number.isNaN(orderNumber)) {
    return (
      <main className={styles.page}>
        <p className="text text_type_main-default">Некорректный номер заказа</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <CenteredPreloader />
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <p className="text text_type_main-default">Ошибка: {error}</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className={styles.page}>
        <p className="text text_type_main-default">Заказ не найден</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <OrderInfo
        number={order.number}
        name={order.name}
        status={order.status}
        createdAt={order.createdAt}
        ingredientIds={order.ingredients}
        showNumber={!hideNumber}
      />
    </main>
  );
};
