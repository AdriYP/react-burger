import {
  ConstructorElement,
  DragIcon,
  CurrencyIcon,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { CONSTRUCTOR_ITEMS } from '@utils/constants';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients }) => {
  console.log(ingredients);
  const [bun, setBun] = useState(null);
  const [betweenBuns, setBetweenBuns] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderModal, setOrderModal] = useState(null);

  useEffect(() => {
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      setBun(null);
      setBetweenBuns([]);
      setTotalPrice(0);
      return;
    }

    const { bunID, addedIDs } = CONSTRUCTOR_ITEMS;
    const byId = new Map(ingredients.map((i) => [i._id, i]));

    const currentBun = byId.get(bunID) || null;
    const currentBetween = Array.isArray(addedIDs)
      ? addedIDs.map((id) => byId.get(id)).filter(Boolean)
      : [];

    // считаем сумму: булка * 2 (верх и низ) + все добавленные
    const bunPrice = currentBun?.price ?? 0;
    const addedSum = currentBetween.reduce((sum, item) => sum + (item?.price ?? 0), 0);
    const sum = bunPrice * 2 + addedSum;

    setBun(currentBun);
    setBetweenBuns(currentBetween);
    setTotalPrice(sum);
  }, [ingredients]);

  const topBunName = bun?.name ?? 'Булка';
  const topBunPrice = bun?.price ?? 0;
  const topBunThumb = bun?.image ?? null;

  return (
    <>
      <section className={`${styles.burger_constructor} ml-4 mr-4`}>
        {/* top */}
        <div className={styles.row}>
          <div className={styles.handlePlaceholder} />
          <div className={styles.cell}>
            <ConstructorElement
              type="top"
              isLocked={true}
              text={`${topBunName}  (верх)`}
              price={topBunPrice}
              thumbnail={topBunThumb}
            />
          </div>
        </div>
        {/* list */}
        <div className={`${styles.scrollArea} custom-scroll`}>
          <div className={styles.list}>
            {betweenBuns.map((item, idx) => (
              <div className={styles.row} key={`${item._id}-${idx}`}>
                <DragIcon type="primary" />
                <div className={styles.cell}>
                  <ConstructorElement
                    text={item.name}
                    price={item.price}
                    thumbnail={item.image}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* bottom */}
        <div className={styles.row}>
          <div className={styles.handlePlaceholder} />
          <div className={styles.cell}>
            <ConstructorElement
              type="bottom"
              isLocked={true}
              text={`${topBunName}  (низ)`}
              price={topBunPrice}
              thumbnail={topBunThumb}
            />
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
            onClick={() => setOrderModal(true)}
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

BurgerConstructor.propTypes = {
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      proteins: PropTypes.number,
      fat: PropTypes.number,
      carbohydrates: PropTypes.number,
      calories: PropTypes.number,
      price: PropTypes.number.isRequired,
      image: PropTypes.string,
      image_mobile: PropTypes.string,
      image_large: PropTypes.string,
      __v: PropTypes.number,
    })
  ).isRequired,
};
