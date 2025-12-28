import { useParams } from 'react-router-dom';

import { selectIngredients } from '@/services/app/selectors';
import { useAppSelector } from '@/services/hooks';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';

import type React from 'react';

import type { TIngredient } from '@/types/ingredient';

import styles from './ingredient-details.module.css';

type TParams = {
  id?: string;
};

export const IngredientDetailsPage = (): React.ReactElement => {
  const { id } = useParams<TParams>();

  const ingredients = useAppSelector(selectIngredients);

  const ingredient: TIngredient | null =
    id && Array.isArray(ingredients)
      ? (ingredients.find((item) => item._id === id) ?? null)
      : null;

  return (
    <div className="mt-30">
      {ingredient ? (
        <IngredientDetails ingredient={ingredient} />
      ) : (
        <div className={styles.centered}>
          <p className="text text_type_main-default mt-10">Ингредиент не найден</p>
        </div>
      )}
    </div>
  );
};
