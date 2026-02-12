import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useRef, useState } from 'react';

import { BurgerIngredientsCardSet } from '@/components/burger-ingredients-cardset/burger-ingredients-cardset';
import { selectIngredientsByType } from '@/services/burger-ingredients/selectors';
import { useAppSelector } from '@/services/hooks';

import type React from 'react';

import styles from './burger-ingredients.module.css';

type TIngredientType = 'bun' | 'main' | 'sauce';

export const BurgerIngredients = (): React.ReactElement => {
  // ВАЖНО: selectIngredientsByType(type) создаёт selector.
  // Чтобы не создавать новый selector на каждый рендер — мемоизируем.
  const selectBuns = useMemo(() => selectIngredientsByType('bun'), []);
  const selectMains = useMemo(() => selectIngredientsByType('main'), []);
  const selectSauces = useMemo(() => selectIngredientsByType('sauce'), []);

  const buns = useAppSelector(selectBuns);
  const mains = useAppSelector(selectMains);
  const sauces = useAppSelector(selectSauces);

  const [currentTab, setCurrentTab] = useState<TIngredientType>('bun');

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // refs на <section>
  const bunsSectionRef = useRef<HTMLElement | null>(null);
  const mainsSectionRef = useRef<HTMLElement | null>(null);
  const saucesSectionRef = useRef<HTMLElement | null>(null);

  const getSectionRefByType = (
    type: TIngredientType
  ): React.RefObject<HTMLElement | null> => {
    if (type === 'bun') return bunsSectionRef;
    if (type === 'main') return mainsSectionRef;
    return saucesSectionRef;
  };

  const handleTabClick = useCallback((type: TIngredientType): void => {
    setCurrentTab(type);

    const container = scrollContainerRef.current;
    const section = getSectionRefByType(type).current;

    if (!container || !section) return;

    const containerTop = container.getBoundingClientRect().top;
    const sectionTop = section.getBoundingClientRect().top;
    const offset = sectionTop - containerTop + container.scrollTop;

    container.scrollTo({ top: offset, behavior: 'smooth' });
  }, []);

  const handleScroll = useCallback((): void => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerTop = container.getBoundingClientRect().top;

    const sections: { type: TIngredientType; node: HTMLElement | null }[] = [
      { type: 'bun', node: bunsSectionRef.current },
      { type: 'main', node: mainsSectionRef.current },
      { type: 'sauce', node: saucesSectionRef.current },
    ];

    let closestType: TIngredientType = currentTab;
    let minDelta = Number.POSITIVE_INFINITY;

    sections.forEach(({ type, node }) => {
      if (!node) return;
      const delta = Math.abs(node.getBoundingClientRect().top - containerTop);
      if (delta < minDelta) {
        minDelta = delta;
        closestType = type;
      }
    });

    if (closestType !== currentTab) setCurrentTab(closestType);
  }, [currentTab]);

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={currentTab === 'bun'}
            onClick={() => handleTabClick('bun')}
          >
            Булки
          </Tab>

          <Tab
            value="main"
            active={currentTab === 'main'}
            onClick={() => handleTabClick('main')}
          >
            Начинки
          </Tab>

          <Tab
            value="sauce"
            active={currentTab === 'sauce'}
            onClick={() => handleTabClick('sauce')}
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
        <section className="mb-10" ref={bunsSectionRef}>
          <h2 className={`text text_type_main-medium m-1`}>Булки</h2>
          <BurgerIngredientsCardSet ingredients={buns} />
        </section>

        <section className="mb-10" ref={mainsSectionRef}>
          <h2 className={`text text_type_main-medium m-1`}>Начинки</h2>
          <BurgerIngredientsCardSet ingredients={mains} />
        </section>

        <section className="mb-10" ref={saucesSectionRef}>
          <h2 className={`text text_type_main-medium m-1`}>Соусы</h2>
          <BurgerIngredientsCardSet ingredients={sauces} />
        </section>
      </div>
    </section>
  );
};
