import { BurgerIngredientsCard } from '@/components/burger-ingredients-card/burger-ingredients-card';

import styles from './burger-ingredients-cardset.module.css';

export const BurgerIngredientsCardSet = ({ ingredients }) => {
  return (
    <div className={`${styles.grid} p-1`}>
      {ingredients.map((ingredient) => (
        <BurgerIngredientsCard
          key={ingredient._id}
          ingredient={ingredient}
          // onSelect={onSelect}
        />
      ))}
    </div>
  );
};
