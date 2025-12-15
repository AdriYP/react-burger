import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { selectIngredients } from '@/services/app/selectors';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';

import styles from './ingredient-details.module.css';

export const IngredientDetailsPage = () => {
  const { id } = useParams();

  const ingredients = useSelector(selectIngredients);

  // если в state нет — ищем по id в сторе
  const ingredientFromStore =
    ingredients && Array.isArray(ingredients)
      ? ingredients.find((item) => item._id === id)
      : null;

  const ingredient = ingredientFromStore;

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
