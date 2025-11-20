import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { CONSTRUCTOR_ITEMS } from '@utils/constants';

import styles from './burger-ingredients-card.module.css';

export const BurgerIngredientsCard = ({ ingredient, onSelect }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const { bunID, addedIDs } = CONSTRUCTOR_ITEMS;

    if (ingredient._id === bunID) {
      setCount(2);
    } else {
      setCount(addedIDs.filter((id) => id === ingredient._id).length);
    }
  }, [ingredient]);

  const handleOpen = () => onSelect?.(ingredient);

  return (
    <div
      className={`${styles.card} p-1`}
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
    >
      {count > 0 && (
        <div className={styles.counter}>
          <Counter count={count} size="default" extraClass="m-1" />
        </div>
      )}

      <img src={ingredient.image} alt={ingredient.name}></img>
      <div className={`${styles.price}`}>
        <span className={`text text_type_digits-default`}>{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <p className={`${styles.name} text text_type_main-default`}>{ingredient.name}</p>
    </div>
  );
};
