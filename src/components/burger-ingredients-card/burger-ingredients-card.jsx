import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  selectConstructorBun,
  selectConstructorIngredients,
} from '@/services/burger-constructor/selectors';
import { DND_TYPES } from '@/utils/constants';

import styles from './burger-ingredients-card.module.css';

export const BurgerIngredientsCard = ({ ingredient }) => {
  const bun = useSelector(selectConstructorBun);
  const constructorIngredients = useSelector(selectConstructorIngredients);

  const location = useLocation();
  const navigate = useNavigate();

  const count = useMemo(() => {
    if (!ingredient) return 0;

    if (ingredient.type === 'bun') {
      if (bun && bun._id === ingredient._id) {
        return 2;
      }
      return 0;
    }

    if (!Array.isArray(constructorIngredients)) return 0;

    return constructorIngredients.filter((item) => item._id === ingredient._id).length;
  }, [bun, constructorIngredients, ingredient]);

  // делаем карточку источником перетаскивания
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: DND_TYPES.INGREDIENT,
      // именно это попадёт в drop-обработчик
      item: { ingredient },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient]
  );

  const handleClick = () => {
    navigate(`/ingredients/${ingredient._id}`, {
      state: { background: location },
    });
  };

  return (
    <>
      <div
        ref={dragRef}
        className={`${styles.card} p-1`}
        role="button"
        tabIndex={0}
        onClick={handleClick}
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
    </>
  );
};
