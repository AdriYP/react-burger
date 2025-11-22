import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { BurgerIngredientsCardSet } from '@/components/burger-ingredients-cardset/burger-ingredients-cardset';
import { selectIngredientsByType } from '@/services/burger-ingredients/selectors';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = () => {
  const buns = useSelector(selectIngredientsByType('bun'));
  const sauces = useSelector(selectIngredientsByType('sauce'));
  const mains = useSelector(selectIngredientsByType('main'));

  const [currentIngredient, setCurrentIngredient] = useState(null);
  const [currentTab, setCurrentTab] = useState('bun');

  const scrollContainerRef = useRef(null);
  // рефы на секции
  const bunsSectionRef = useRef(null);
  const mainsSectionRef = useRef(null);
  const saucesSectionRef = useRef(null);

  const getSectionRefByType = (type) => {
    if (type === 'bun') return bunsSectionRef;
    if (type === 'main') return mainsSectionRef;
    if (type === 'sauce') return saucesSectionRef;
    return bunsSectionRef;
  };

  // scrollTo
  const handleTabClick = useCallback((type) => {
    setCurrentTab(type);

    const container = scrollContainerRef.current;
    const sectionRef = getSectionRefByType(type);
    const section = sectionRef.current;

    if (container && section) {
      const containerTop = container.getBoundingClientRect().top;
      const sectionTop = section.getBoundingClientRect().top;
      const offset = sectionTop - containerTop + container.scrollTop;

      container.scrollTo({
        top: offset,
        behavior: 'smooth',
      });
    }
  }, []);

  //смена таба секции
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerTop = container.getBoundingClientRect().top;

    const sections = [
      { type: 'bun', node: bunsSectionRef.current },
      { type: 'main', node: mainsSectionRef.current },
      { type: 'sauce', node: saucesSectionRef.current },
    ];

    let closestType = currentTab;
    let minDelta = Infinity;

    sections.forEach(({ type, node }) => {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const delta = Math.abs(rect.top - containerTop);

      if (delta < minDelta) {
        minDelta = delta;
        closestType = type;
      }
    });

    if (closestType !== currentTab) {
      setCurrentTab(closestType);
    }
  }, [currentTab]);

  return (
    <>
      <section className={styles.burger_ingredients}>
        <nav>
          <ul className={styles.menu}>
            <Tab
              value="bun"
              active={currentTab === 'bun'}
              onClick={() => {
                handleTabClick('bun');
              }}
            >
              Булки
            </Tab>
            <Tab
              value="main"
              active={currentTab === 'main'}
              onClick={() => {
                handleTabClick('main');
              }}
            >
              Начинки
            </Tab>
            <Tab
              value="sauce"
              active={currentTab === 'sauce'}
              onClick={() => {
                handleTabClick('sauce');
              }}
            >
              Соусы
            </Tab>
          </ul>
        </nav>
        <div
          className={`${styles.burger_cardset} custom-scroll mt-10`}
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          <section key="buns" className="mb-10" ref={bunsSectionRef}>
            <h2 className={`${styles.cardset_title} text text_type_main-large m-1`}>
              Булки
            </h2>
            <div>
              <BurgerIngredientsCardSet ingredients={buns} />
            </div>
          </section>

          <section key="mains" className="mb-10" ref={mainsSectionRef}>
            <h2 className={`${styles.cardset_title} text text_type_main-large m-1`}>
              Начинки
            </h2>
            <div>
              <BurgerIngredientsCardSet
                ingredients={mains}
                // onSelect={setCurrentIngredient}
              />
            </div>
          </section>

          <section key="sauces" className="mb-10" ref={saucesSectionRef}>
            <h2 className={`${styles.cardset_title} text text_type_main-large m-1`}>
              Соусы
            </h2>
            <div>
              <BurgerIngredientsCardSet ingredients={sauces} />
            </div>
          </section>
        </div>
      </section>
      {currentIngredient && (
        <Modal title="Детали ингредиента" onClose={() => setCurrentIngredient(false)}>
          <IngredientDetails />
        </Modal>
      )}
    </>
  );
};
//.propTypes удалён в соответствии с комментарием к "Sprint 1/step 2"
