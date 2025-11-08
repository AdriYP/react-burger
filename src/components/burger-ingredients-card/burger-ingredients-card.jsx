import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './burger-ingredients-card.module.css';

export const BurgerIngredientsCard = ({ ingredient }) => {
  //список ID эелементов для отображения чисел в счётчике
  const targetIds = [
    `60666c42cc7b410027a1a9b1`,
    `60666c42cc7b410027a1a9b9`,
    `60666c42cc7b410027a1a9b4`,
    `60666c42cc7b410027a1a9bc`,
    `60666c42cc7b410027a1a9bb`,
    `60666c42cc7b410027a1a9bb`,
    `60666c42cc7b410027a1a9be`,
    `60666c42cc7b410027a1a9bf`,
  ];

  const count = targetIds.filter((id) => id === ingredient._id).length;

  return (
    <div className={`${styles.card} p-1`}>
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
