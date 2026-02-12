import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { OrdersList } from '@/components/orders-list/orders-list';
import { feedConnect, feedDisconnect } from '@/services/feedOrders/actions';
import {
  selectOrders,
  selectTotal,
  selectTotalToday,
} from '@/services/feedOrders/slice';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { WS_FEED_URL } from '@/utils/api-base';

import type React from 'react';

import type { TOrderCardProps } from '@/components/order-card/order-card';
import type { TOrder } from '@/types/order';

import styles from './feed.module.css';

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export const FeedPage = (): React.ReactElement => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect((): (() => void) => {
    dispatch(feedConnect(WS_FEED_URL));

    return (): void => {
      dispatch(feedDisconnect());
    };
  }, [dispatch]);
  const orders = useAppSelector(selectOrders);
  const total = useAppSelector(selectTotal);
  const totalToday = useAppSelector(selectTotalToday);

  const feedOrders: TOrder[] = orders ?? [];

  const ordersForCards: TOrderCardProps[] = useMemo(
    () =>
      feedOrders.map((order) => ({
        number: order.number,
        name: order.name ?? `Заказ #${order.number}`,
        status: order.status,
        createdAt: order.createdAt,
        ingredientIds: order.ingredients,
      })),
    [feedOrders]
  );

  const doneOrders = useMemo(
    () => feedOrders.filter((order) => order.status === 'done'),
    [feedOrders]
  );

  const workingOrders = useMemo(
    () =>
      feedOrders.filter(
        (order) => order.status === 'pending' || order.status === 'created'
      ),
    [feedOrders]
  );

  // НЕ более 10 номеров в колонке – дальше создаём новую
  const doneChunks = useMemo(() => chunkArray(doneOrders, 10), [doneOrders]);
  const workingChunks = useMemo(() => chunkArray(workingOrders, 10), [workingOrders]);

  const handleOrderClick = (orderNumber: number): void => {
    navigate(`/feed/${orderNumber}`, {
      state: { background: location },
    });
  };

  const formatNumber = (num: number): string => num.toLocaleString('ru-RU');

  return (
    <main className={styles.feed}>
      <h1 className="text text_type_main-large">Лента заказов</h1>

      <div className={styles.content}>
        <section className={styles.leftColumn}>
          <div className={styles.ordersLst}>
            <OrdersList orders={ordersForCards} onOrderClick={handleOrderClick} />
          </div>
        </section>

        <section className={styles.rightColumn}>
          <div className={styles.statusRow}>
            {/* --------- ГОТОВЫ --------- */}
            <div className={styles.statusColumn}>
              <h2 className="text text_type_main-medium pb-6">Готовы:</h2>
              <div className={styles.statusNumbersRow}>
                {doneChunks.map((chunk, index) => (
                  <ul key={index} className={styles.statusList}>
                    {chunk.map((order) => (
                      <li
                        key={order.number}
                        className={`${styles.statusItem_done} text text_type_digits-default mb-2 mr-4`}
                      >
                        {order.number.toString().padStart(6, '0')}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            {/* --------- В РАБОТЕ --------- */}
            <div className={styles.statusColumn}>
              <h2 className="text text_type_main-medium pb-6">В работе:</h2>
              <div className={styles.statusNumbersRow}>
                {workingChunks.map((chunk, index) => (
                  <ul key={index} className={styles.statusList}>
                    {chunk.map((order) => (
                      <li
                        key={order.number}
                        className={`${styles.statusItem} text text_type_digits-default`}
                      >
                        {order.number.toString().padStart(6, '0')}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.totalBlock}>
            <p className="text text_type_main-medium pb-6">Выполнено за все время:</p>
            <p className={`${styles.totalNumber} text text_type_digits-large`}>
              {formatNumber(total ?? 0)}
            </p>
          </div>

          <div className={styles.totalBlock}>
            <p className="text text_type_main-medium pb-6">Выполнено за сегодня:</p>
            <p className={`${styles.totalNumber} text text_type_digits-large`}>
              {formatNumber(totalToday ?? 0)}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};
