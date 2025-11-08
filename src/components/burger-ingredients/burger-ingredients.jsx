import { Tab } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';

import { BurgerIngredientsCardSet } from '@/components/burger-ingredients-cardset/burger-ingredients-cardset';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients }) => {
  console.log(ingredients);

  // Группируем ингредиенты по типу
  const groupedIngredients = {
    bun: ingredients.filter((ingredient) => ingredient.type === 'bun'),
    sauce: ingredients.filter((ingredient) => ingredient.type === 'sauce'),
    main: ingredients.filter((ingredient) => ingredient.type === 'main'),
  };

  // Функция для получения заголовка по типу
  const getTitleByType = (type) => {
    const titles = {
      bun: 'Булки',
      sauce: 'Соусы',
      main: 'Начинки',
    };
    return titles[type];
  };

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={true}
            onClick={() => {
              /* TODO */
            }}
          >
            Булки
          </Tab>
          <Tab
            value="main"
            active={false}
            onClick={() => {
              /* TODO */
            }}
          >
            Начинки
          </Tab>
          <Tab
            value="sauce"
            active={false}
            onClick={() => {
              /* TODO */
            }}
          >
            Соусы
          </Tab>
        </ul>
      </nav>
      <div className={`${styles.burger_cardset} custom-scroll mt-10`}>
        {Object.entries(groupedIngredients).map(([type, items]) => (
          <section key={type} className="mb-10">
            <h2 className={`${styles.cardset_title} text text_type_main-large m-1`}>
              {getTitleByType(type)}
            </h2>
            <div>
              <BurgerIngredientsCardSet ingredients={items} />
            </div>
          </section>
        ))}
      </div>
    </section>
  );
};

BurgerIngredients.propTypes = {
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
