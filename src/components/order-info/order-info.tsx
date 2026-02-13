import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import { selectIngredientsList } from '@/services/burger-ingredients/selectors';
import { useAppSelector } from '@/services/hooks';

import type React from 'react';

import type { TOrderStatus } from '@/types/order';

import styles from './order-info.module.css';

export type TOrderInfoProps = {
  number: number;
  name: string;
  status: TOrderStatus;
  createdAt: string;
  ingredientIds: string[];
  showNumber?: boolean;
};

type TIngredientShort = {
  _id: string;
  name: string;
  price: number;
  image_mobile: string;
};

const statusTextMap: Record<TOrderStatus, string> = {
  created: 'Создан',
  pending: 'Готовится',
  done: 'Выполнен',
  canceled: 'Отменён',
};

export const OrderInfo = ({
  number,
  name,
  status,
  createdAt,
  ingredientIds,
  showNumber = true,
}: TOrderInfoProps): React.ReactElement => {
  const allIngredients = useAppSelector(selectIngredientsList) as TIngredientShort[];

  const ingredientsMap = useMemo(
    () => new Map(allIngredients.map((item) => [item._id, item])),
    [allIngredients]
  );

  const itemsWithQty = useMemo(() => {
    const qtyMap = new Map<string, { ingredient: TIngredientShort; qty: number }>();

    ingredientIds.forEach((id) => {
      const ingredient = ingredientsMap.get(id);
      if (!ingredient) return;

      const entry = qtyMap.get(id);
      if (entry) {
        entry.qty += 1;
      } else {
        qtyMap.set(id, { ingredient, qty: 1 });
      }
    });

    return Array.from(qtyMap.values());
  }, [ingredientIds, ingredientsMap]);

  const totalPrice = itemsWithQty.reduce(
    (sum, { ingredient, qty }) => sum + ingredient.price * qty,
    0
  );

  const date = new Date(createdAt);
  const isDone = status === 'done';

  const formattedNumber = `#${number.toString().padStart(6, '0')}`;

  return (
    <section className={styles.wrapper}>
      {showNumber && (
        <p className={`${styles.number} text text_type_digits-default mb-3`}>
          {formattedNumber}
        </p>
      )}

      <h1 className={`text text_type_main-medium mb-3`}>{name}</h1>

      <p
        className={`${styles.status} text text_type_main-default mb-15 ${
          isDone ? styles.statusDone : ''
        }`}
      >
        {statusTextMap[status]}
      </p>

      <h2 className={`text text_type_main-medium mb-6`}>Состав:</h2>

      <div className={styles.ingredientsScroll}>
        <ul className={styles.list}>
          {itemsWithQty.map(({ ingredient, qty }) => (
            <li key={ingredient._id} className={styles.item}>
              <div className={styles.iconWrapper}>
                <img
                  src={ingredient.image_mobile}
                  alt={ingredient.name}
                  className={styles.icon}
                />
              </div>

              <p className={`${styles.itemName} text text_type_main-default`}>
                {ingredient.name}
              </p>

              <div className={styles.itemPrice}>
                <span className="text text_type_digits-default">
                  {qty} x {ingredient.price}
                </span>
                <CurrencyIcon type="primary" />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <footer className={styles.footer}>
        <span className="text text_type_main-default text_color_inactive">
          <FormattedDate date={date} />
        </span>

        <div className={styles.total}>
          <span className="text text_type_digits-default">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </footer>
    </section>
  );
};
