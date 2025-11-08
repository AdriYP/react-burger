import {
  ConstructorElement,
  DragIcon,
  CurrencyIcon,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients }) => {
  console.log(ingredients);
  const bun_id = `60666c42cc7b410027a1a9b1`;
  const between_buns_ids = [
    `60666c42cc7b410027a1a9b9`,
    `60666c42cc7b410027a1a9b4`,
    `60666c42cc7b410027a1a9bc`,
    `60666c42cc7b410027a1a9bb`,
    `60666c42cc7b410027a1a9bb`,
    `60666c42cc7b410027a1a9be`,
    `60666c42cc7b410027a1a9bf`,
  ];

  const bun = ingredients.find((item) => item._id === bun_id);

  const betweenBuns = selectByIds(between_buns_ids, ingredients);

  const totalPrice = getSumPriceByIds(between_buns_ids, ingredients) + bun.price;

  function selectByIds(ids, items) {
    const dict = new Map(items.map((i) => [i._id, i]));
    return ids.map((id) => dict.get(id)).filter(Boolean);
  }

  function getSumPriceByIds(ids, items) {
    if (!Array.isArray(ids) || !Array.isArray(items)) return 0;
    const dict = new Map(items.map((item) => [item._id, item.price]));

    return ids.reduce((sum, id) => {
      const price = dict.get(id);
      return sum + (price || 0);
    }, 0);
  }

  return (
    <section className={`${styles.burger_constructor} ml-4 mr-4`}>
      {/* top */}
      <div className={styles.row}>
        <div className={styles.handlePlaceholder} />
        <div className={styles.cell}>
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${bun.name}  (верх)`}
            price={bun.price}
            thumbnail={bun.image}
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
            text={`${bun.name}  (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      </div>
      {/* total */}
      <div className={`${styles.totalBar} mt-6`}>
        <div className={styles.priceGroup}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button htmlType="button" type="primary" size="large">
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

BurgerConstructor.propTypes = {
  _id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  proteins: PropTypes.number,
  fat: PropTypes.number,
  carbohydrates: PropTypes.number,
  calories: PropTypes.number,
  price: PropTypes.number,
  image: PropTypes.string,
  image_mobile: PropTypes.string,
  image_large: PropTypes.string,
  __v: PropTypes.number,
};
