import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectConstructorBun,
  selectConstructorIngredients,
} from '@/services/burger-constructor/selectors';
import {
  addDetailedIngredient,
  deleteDetailedIngredient,
} from '@/services/ingredient-details/actions';
import { selectDetailedIngredient } from '@/services/ingredient-details/selectors';
import { DND_TYPES } from '@/utils/constants';

import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';

import styles from './burger-ingredients-card.module.css';

export const BurgerIngredientsCard = ({ ingredient }) => {
  const dispatch = useDispatch();
  const bun = useSelector(selectConstructorBun);
  const constructorIngredients = useSelector(selectConstructorIngredients);
  const detailedIngredient = useSelector(selectDetailedIngredient);

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
    // dispatch(increaseItem(ingredient));
    dispatch(addDetailedIngredient(ingredient));
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

      {detailedIngredient && (
        <Modal
          title="Детали ингредиента"
          onClose={() => dispatch(deleteDetailedIngredient())}
        >
          <IngredientDetails ingredient={detailedIngredient} />
        </Modal>
      )}
    </>
  );
};
