import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { selectIngredientsList } from '@/services/burger-ingredients/selectors';
import { useAppSelector } from '@/services/hooks';

import type React from 'react';

import type { TOrderStatus } from '@/types/order';

import styles from './order-card.module.css';

export type TOrderCardProps = {
  number: number;
  name: string;
  status: TOrderStatus;
  createdAt: string;
  ingredientIds: string[];
  onClick?: () => void;
  showStatus?: boolean;
};

type TIngredientShort = {
  _id: string;
  price: number;
  image_mobile: string;
};

const MAX_INGREDIENTS = 6;

const statusToText: Record<TOrderStatus, string> = {
  created: 'Создан',
  pending: 'Готовится',
  done: 'Выполнен',
  canceled: 'Отменён',
};

export const OrderCard = ({
  number,
  name,
  status,
  createdAt,
  ingredientIds,
  onClick,
}: TOrderCardProps): React.ReactElement => {
  const location = useLocation();
  const isFeedPage = location.pathname === '/feed';

  const allIngredients = useAppSelector(selectIngredientsList) as TIngredientShort[];

  const ingredientsMap = useMemo(
    () => new Map(allIngredients.map((item) => [item._id, item])),
    [allIngredients]
  );

  const orderIngredients: TIngredientShort[] = useMemo(
    () =>
      ingredientIds
        .map((id) => ingredientsMap.get(id))
        .filter((item): item is TIngredientShort => Boolean(item)),
    [ingredientIds, ingredientsMap]
  );

  const visibleIngredients = orderIngredients.slice(0, MAX_INGREDIENTS);
  const extraCount = orderIngredients.length - MAX_INGREDIENTS;

  const totalPrice = orderIngredients.reduce((sum, item) => sum + item.price, 0);

  const date = new Date(createdAt);

  return (
    <article className={styles.card} onClick={onClick}>
      <header className={styles.header}>
        <span
          className={'text text_type_digits-default'}
        >{`#${number.toString().padStart(6, '0')}`}</span>

        <span className="text text_type_main-default text_color_inactive">
          {/*Примечание. Вероятно компонент FormattedDate работает криво.
          Не корректно выводит "Сегодня/Вчера/...". Визульно карточки выглядят странно сортированными*/}
          <FormattedDate date={date} />
        </span>
      </header>

      <h3 className={'text text_type_main-medium'}>{name}</h3>

      {!isFeedPage && (
        <p className={`${styles.status} ${status === 'done' ? styles.statusDone : ''}`}>
          {statusToText[status]}
        </p>
      )}

      <footer className={styles.footer}>
        <div className={styles.ingredientsRow}>
          {visibleIngredients.map((ingredient, index) => {
            const isLastWithExtra =
              index === visibleIngredients.length - 1 && extraCount > 0;

            return (
              <div
                key={ingredient._id + index}
                className={styles.ingredientWrapper}
                // слева направо: чем правее, тем больше z-index
                style={{ zIndex: visibleIngredients.length - index }}
              >
                <div className={styles.ingredientCircle}>
                  <div className={styles.ingredientCircleInner}>
                    <img
                      src={ingredient.image_mobile}
                      alt=""
                      className={styles.ingredientImage}
                    />
                    {isLastWithExtra && (
                      <span className={`${styles.extra} text text_type_main-default`}>
                        +{extraCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.price}>
          <span className={'text text_type_digits-default'}>{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </footer>
    </article>
  );
};
