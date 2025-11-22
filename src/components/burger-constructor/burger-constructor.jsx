import {
  ConstructorElement,
  DragIcon,
  CurrencyIcon,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import {
  decreaseItem,
  increaseItem,
  moveIngredient,
} from '@/services/burger-constructor/actions';
import {
  selectConstructorBun,
  selectConstructorIngredients,
  selectConstructorTotalPrice,
} from '@/services/burger-constructor/selectors';
import { sendOrder } from '@/services/order/actions';
import { DND_TYPES } from '@/utils/constants';

import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';

import styles from './burger-constructor.module.css';

//заглушка для пустых данных
const ConstructorPlaceholder = ({ position, text }) => {
  const positionClass =
    position === 'top'
      ? styles.placeholder_top
      : position === 'bottom'
        ? styles.placeholder_bottom
        : styles.placeholder_middle;

  return (
    <div className={`${styles.placeholder} ${positionClass}`}>
      <span className="text text_type_main-default">{text}</span>
    </div>
  );
};

// вынесено для перетаскивания строки в dnd из-за хуков
const ConstructorIngredientRow = ({ item, index, moveItem, dispatch }) => {
  const ref = useRef(null);

  // drag
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: DND_TYPES.CONSTRUCTOR_INGREDIENT,
      item: { index, constructorId: item.constructorId },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index, item.constructorId]
  );

  // drop
  const [, dropRef] = useDrop(
    () => ({
      accept: DND_TYPES.CONSTRUCTOR_INGREDIENT,
      hover: (dragItem, monitor) => {
        if (!ref.current) return;

        const dragIndex = dragItem.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) {
          return;
        }

        //считаем, пересёк ли указатель середину элемента
        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }

        // меняем порядок в сторе
        moveItem(dragIndex, hoverIndex);
        dragItem.index = hoverIndex;
      },
    }),
    [index, moveItem]
  );

  // объединяем drag+drop
  dragRef(dropRef(ref));

  return (
    <div
      ref={ref}
      className={styles.row}
      data-id={item.constructorId}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <DragIcon type="primary" />
      <div className={styles.cell}>
        <ConstructorElement
          text={item.name}
          price={item.price}
          thumbnail={item.image}
          handleClose={() => dispatch(decreaseItem(item))}
        />
      </div>
    </div>
  );
};

// общий хук для drop булки (верх и низ)
const useBunDrop = (dispatch) => {
  return useDrop(
    () => ({
      accept: DND_TYPES.INGREDIENT,
      drop: ({ ingredient }) => {
        if (ingredient.type === 'bun') {
          dispatch(increaseItem(ingredient));
        }
      },
    }),
    [dispatch]
  );
};

export const BurgerConstructor = () => {
  const bun = useSelector(selectConstructorBun);
  const ingredients = useSelector(selectConstructorIngredients);
  const totalPrice = useSelector(selectConstructorTotalPrice);

  const dispatch = useDispatch();

  const [orderModal, setOrderModal] = useState(null);

  const hasBun = !!bun;
  const hasIngredients = Array.isArray(ingredients) && ingredients.length > 0;

  const bunPrice = bun?.price ?? 0;
  const bunThumb = bun?.image ?? null;

  const handleClick = () => {
    dispatch(sendOrder());
    setOrderModal(true);
  };

  // drop-зона для булки (верх/низ)
  const [, topBunDropRef] = useBunDrop(dispatch);
  const [, bottomBunDropRef] = useBunDrop(dispatch);

  // drop-зона для начинки (между булками)
  const [, ingredientsDropRef] = useDrop(
    () => ({
      accept: DND_TYPES.INGREDIENT,
      drop: ({ ingredient }) => {
        if (ingredient.type !== 'bun') {
          dispatch(increaseItem(ingredient));
        }
      },
    }),
    [dispatch]
  );

  // перетаскивание внутри конструтора
  const handleMoveIngredient = (fromIndex, toIndex) => {
    dispatch(moveIngredient(fromIndex, toIndex));
  };

  return (
    <>
      <section className={`${styles.burger_constructor} ml-4 mr-4`}>
        {/* top */}
        <div className={styles.row}>
          <div className={styles.handlePlaceholder} />
          <div className={styles.cell} ref={topBunDropRef}>
            {hasBun ? (
              <ConstructorElement
                type="top"
                isLocked={true}
                text={`${bun.name} (верх)`}
                price={bunPrice}
                thumbnail={bunThumb}
              />
            ) : (
              <ConstructorPlaceholder position="top" text="Выберите булки" />
            )}
          </div>
        </div>

        {/* list */}
        <div className={`${styles.scrollArea} custom-scroll`}>
          <div className={styles.list} ref={ingredientsDropRef}>
            {hasIngredients ? (
              ingredients.map((item, index) => (
                <ConstructorIngredientRow
                  key={item.constructorId}
                  item={item}
                  index={index}
                  moveItem={handleMoveIngredient}
                  dispatch={dispatch}
                />
              ))
            ) : (
              <div className={styles.row}>
                <div className={styles.handlePlaceholder} />
                <div className={styles.cell}>
                  <ConstructorPlaceholder position="middle" text="Выберите начинку" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* bottom */}
        <div className={styles.row}>
          <div className={styles.handlePlaceholder} />
          <div className={styles.cell} ref={bottomBunDropRef}>
            {hasBun ? (
              <ConstructorElement
                type="bottom"
                isLocked={true}
                text={`${bun.name} (низ)`}
                price={bunPrice}
                thumbnail={bunThumb}
              />
            ) : (
              <ConstructorPlaceholder position="bottom" text="Выберите булки" />
            )}
          </div>
        </div>

        {/* total */}
        <div className={`${styles.totalBar} mt-6`}>
          <div className={styles.priceGroup}>
            <span className="text text_type_digits-medium">{totalPrice}</span>
            <CurrencyIcon type="primary" />
          </div>
          <Button
            htmlType="button"
            type="primary"
            size="large"
            onClick={() => handleClick()}
          >
            Оформить заказ
          </Button>
        </div>
      </section>

      {orderModal && (
        <Modal title="" onClose={() => setOrderModal(false)}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
};
//.propTypes удалён в соответствии с комментарием к "Sprint 1/step 2"
