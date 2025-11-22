import styles from './ingredient-details.module.css';

export const IngredientDetails = ({ ingredient }) => {
  if (!ingredient) return null;
  return (
    <div className={`${styles.wrapper} pl-10 pr-10 pb-15`}>
      <div className={`${styles.imageBox} pb-4`}>
        <img src={ingredient.image_large} alt={ingredient.name} />
      </div>

      <p className={`${styles.name} text text_type_main-medium pb-8`}>
        {ingredient.name}
      </p>

      <div className={styles.facts}>
        <div className={styles.fact}>
          <div className="text text_type_main-default">Калории, ккал</div>
          <div className="text text_type_digits-default">{ingredient.calories}</div>
        </div>
        <div className={styles.fact}>
          <div className="text text_type_main-default">Белки, г</div>
          <div className="text text_type_digits-default">{ingredient.proteins}</div>
        </div>
        <div className={styles.fact}>
          <div className="text text_type_main-default">Жиры, г</div>
          <div className="text text_type_digits-default">{ingredient.fat}</div>
        </div>
        <div className={styles.fact}>
          <div className="text text_type_main-default">Углеводы, г</div>
          <div className="text text_type_digits-default">{ingredient.carbohydrates}</div>
        </div>
      </div>
    </div>
  );
};
//.propTypes удалён в соответствии с комментарием к "Sprint 1/step 2"
