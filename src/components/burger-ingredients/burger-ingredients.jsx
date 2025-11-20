import { Tab } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { BurgerIngredientsCardSet } from '@/components/burger-ingredients-cardset/burger-ingredients-cardset';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';

import styles from './burger-ingredients.module.css';

const CATEGORIES = [
  { type: 'bun', title: 'Булки' },
  { type: 'main', title: 'Начинки' },
  { type: 'sauce', title: 'Соусы' },
];

export const BurgerIngredients = ({ ingredients }) => {
  console.log(ingredients);

  const [grouped, setGrouped] = useState({
    bun: [],
    main: [],
    sauce: [],
  });

  const [currentIngredient, setCurrentIngredient] = useState(null);

  useEffect(() => {
    const regrouped = { bun: [], main: [], sauce: [] };
    for (const ing of ingredients) {
      regrouped[ing.type].push(ing);
    }
    setGrouped(regrouped);
  }, [ingredients]);

  return (
    <>
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
          {CATEGORIES.map(({ type, title }) => (
            <section key={type} className="mb-10">
              <h2 className={`${styles.cardset_title} text text_type_main-large m-1`}>
                {title}
              </h2>
              <div>
                <BurgerIngredientsCardSet
                  ingredients={grouped[type]}
                  onSelect={setCurrentIngredient}
                />
              </div>
            </section>
          ))}
        </div>
      </section>
      {currentIngredient && (
        <Modal title="Детали ингредиента" onClose={() => setCurrentIngredient(false)}>
          <IngredientDetails ingredient={currentIngredient} />
        </Modal>
      )}
    </>
  );
};

BurgerIngredients.propTypes = {
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
