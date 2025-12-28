import {
  ConstructorElement,
  DragIcon,
  CurrencyIcon,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState } from 'react';
import { useDrag, useDrop, type XYCoord } from 'react-dnd';
import { useNavigate } from 'react-router-dom';

import { selectUser } from '@/services/auth/selectors';
import {
  decreaseItem,
  increaseItem,
  moveIngredient,
  clearConstructor,
} from '@/services/burger-constructor/actions';
import {
  selectConstructorBun,
  selectConstructorIngredients,
  selectConstructorTotalPrice,
} from '@/services/burger-constructor/selectors';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { sendOrder } from '@/services/order/actions';
import { DND_TYPES } from '@/utils/constants';

import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';

import type React from 'react';

import type { TConstructorIngredient } from '@/services/burger-constructor/reducer';
import type { TIngredient } from '@/types/ingredient';

import styles from './burger-constructor.module.css';

type TConstructorPlaceholderProps = {
  position: 'top' | 'bottom' | 'middle';
  text: string;
};

const ConstructorPlaceholder = ({
  position,
  text,
}: TConstructorPlaceholderProps): React.ReactElement => {
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

type TIngredientDragItem = {
  ingredient: TIngredient;
};

type TConstructorDragItem = {
  index: number;
  constructorId: string;
};

type TConstructorIngredientRowProps = {
  item: TConstructorIngredient;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
};

const ConstructorIngredientRow = ({
  item,
  index,
  moveItem,
}: TConstructorIngredientRowProps): React.ReactElement => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, dragRef] = useDrag<
    TConstructorDragItem,
    void,
    { isDragging: boolean }
  >(
    () => ({
      type: DND_TYPES.CONSTRUCTOR_INGREDIENT,
      item: { index, constructorId: item.constructorId },
      collect: (monitor): { isDragging: boolean } => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index, item.constructorId]
  );

  const [, dropRef] = useDrop<TConstructorDragItem, void, unknown>(
    () => ({
      accept: DND_TYPES.CONSTRUCTOR_INGREDIENT,
      hover: (dragItem, monitor): void => {
        if (!ref.current) return;

        const dragIndex = dragItem.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) return;

        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        const clientOffset = monitor.getClientOffset() as XYCoord | null;
        if (!clientOffset) return;

        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

        moveItem(dragIndex, hoverIndex);
        dragItem.index = hoverIndex;
      },
    }),
    [index, moveItem]
  );

  // соединяем drag+drop
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
const useBunDrop = (): ReturnType<
  typeof useDrop<TIngredientDragItem, void, unknown>
> => {
  const dispatch = useAppDispatch();

  return useDrop<TIngredientDragItem, void, unknown>(
    () => ({
      accept: DND_TYPES.INGREDIENT,
      drop: ({ ingredient }): void => {
        if (ingredient.type === 'bun') {
          dispatch(increaseItem(ingredient));
        }
      },
    }),
    [dispatch]
  );
};

export const BurgerConstructor = (): React.ReactElement => {
  const bun = useAppSelector(selectConstructorBun);
  const ingredients = useAppSelector(selectConstructorIngredients);
  const totalPrice = useAppSelector(selectConstructorTotalPrice);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const [orderModal, setOrderModal] = useState(false);

  const hasBun = Boolean(bun);
  const hasIngredients = ingredients.length > 0;

  const bunPrice = bun?.price ?? 0;
  const bunThumb = bun?.image ?? '';

  const handleClick = (): void => {
    if (!user) {
      navigate('/login', { replace: true, state: { from: { pathname: '/' } } });
      return;
    }
    setOrderModal(true);
    dispatch(sendOrder());
  };

  // drop-зона для булки (верх/низ)
  const [, topBunDropRef] = useBunDrop();
  const [, bottomBunDropRef] = useBunDrop();

  // drop-зона для начинки (между булками)
  const [, ingredientsDropRef] = useDrop<TIngredientDragItem, void, unknown>(
    () => ({
      accept: DND_TYPES.INGREDIENT,
      drop: ({ ingredient }): void => {
        if (ingredient.type !== 'bun') {
          dispatch(increaseItem(ingredient));
        }
      },
    }),
    [dispatch]
  );

  const handleMoveIngredient = (fromIndex: number, toIndex: number): void => {
    dispatch(moveIngredient(fromIndex, toIndex));
  };

  const handleCloseOrderModal = (): void => {
    setOrderModal(false);
    dispatch(clearConstructor());
  };

  return (
    <>
      <section className={`${styles.burger_constructor} ml-4 mr-4`}>
        {/* top */}
        <div className={styles.row}>
          <div className={styles.handlePlaceholder} />
          <div
            className={styles.cell}
            ref={(node) => {
              topBunDropRef(node);
            }}
          >
            {hasBun ? (
              <ConstructorElement
                type="top"
                isLocked={true}
                text={`${bun!.name} (верх)`}
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
          <div
            className={styles.list}
            ref={(node) => {
              ingredientsDropRef(node);
            }}
          >
            {hasIngredients ? (
              ingredients.map((item: TConstructorIngredient, index: number) => (
                <ConstructorIngredientRow
                  key={item.constructorId}
                  item={item}
                  index={index}
                  moveItem={handleMoveIngredient}
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
          <div
            className={styles.cell}
            ref={(node) => {
              bottomBunDropRef(node);
            }}
          >
            {hasBun ? (
              <ConstructorElement
                type="bottom"
                isLocked={true}
                text={`${bun!.name} (низ)`}
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
            onClick={handleClick}
            disabled={!hasBun || !hasIngredients}
          >
            Оформить заказ
          </Button>
        </div>
      </section>

      {orderModal && (
        <Modal title="" onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
};
