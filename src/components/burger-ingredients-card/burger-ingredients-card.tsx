import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useCallback } from 'react';
import { useDrag, type DragSourceMonitor } from 'react-dnd';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  selectConstructorBun,
  selectConstructorIngredients,
} from '@/services/burger-constructor/selectors';
import { useAppSelector } from '@/services/hooks';
import { DND_TYPES } from '@/utils/constants';

import type * as React from 'react';

import type { TIngredient } from '@/types/ingredient';

import styles from './burger-ingredients-card.module.css';

type TBurgerIngredientsCardProps = {
  ingredient: TIngredient;
};

type TIngredientDragItem = {
  ingredient: TIngredient;
};

export const BurgerIngredientsCard = ({
  ingredient,
}: TBurgerIngredientsCardProps): React.ReactElement => {
  const bun = useAppSelector(selectConstructorBun);
  const constructorIngredients = useAppSelector(selectConstructorIngredients);

  const location = useLocation();
  const navigate = useNavigate();

  const count = useMemo((): number => {
    if (ingredient.type === 'bun') {
      return bun && bun._id === ingredient._id ? 2 : 0;
    }

    return constructorIngredients.filter((item) => item._id === ingredient._id).length;
  }, [bun, constructorIngredients, ingredient._id, ingredient.type]);

  const [{ isDragging }, dragRef] = useDrag<
    TIngredientDragItem,
    void,
    { isDragging: boolean }
  >(
    () => ({
      type: DND_TYPES.INGREDIENT,
      item: { ingredient },
      collect: (monitor: DragSourceMonitor): { isDragging: boolean } => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient]
  );

  const handleClick = (): void => {
    navigate(`/ingredients/${ingredient._id}`, { state: { background: location } });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') handleClick();
  };

  const setDragRef = useCallback(
    (node: HTMLDivElement | null) => {
      dragRef(node);
    },
    [dragRef]
  );

  return (
    <div
      ref={setDragRef}
      className={`${styles.card} p-1`}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {count > 0 && (
        <div className={styles.counter}>
          <Counter count={count} size="default" extraClass="m-1" />
        </div>
      )}

      <img src={ingredient.image} alt={ingredient.name} />

      <div className={styles.price}>
        <span className="text text_type_digits-default">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>

      <p className={`${styles.name} text text_type_main-default`}>{ingredient.name}</p>
    </div>
  );
};
