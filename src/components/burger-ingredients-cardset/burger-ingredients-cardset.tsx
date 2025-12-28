import { BurgerIngredientsCard } from '@/components/burger-ingredients-card/burger-ingredients-card';

import type React from 'react';

import type { TIngredient } from '@/types/ingredient';

import styles from './burger-ingredients-cardset.module.css';

type TBurgerIngredientsCardSetProps = {
  ingredients: TIngredient[];
};

export const BurgerIngredientsCardSet = ({
  ingredients,
}: TBurgerIngredientsCardSetProps): React.ReactElement => {
  return (
    <div className={`${styles.grid} p-1`}>
      {ingredients.map((ingredient) => (
        <BurgerIngredientsCard key={ingredient._id} ingredient={ingredient} />
      ))}
    </div>
  );
};
