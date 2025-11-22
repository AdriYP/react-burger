import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectIngredientsError,
  selectIngredientsLoading,
} from '@/services/app/selectors';
import { loadIngredients } from '@/services/burger-ingredients/actions';
import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import styles from './app.module.css';

export const App = () => {
  const loading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);
  const dispath = useDispatch();

  useEffect(() => {
    dispath(loadIngredients());
  }, []);

  if (loading) return <div>Загрузка...</div>;

  if (error) return <div>Ошибка: {error}</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.app}>
        <AppHeader />
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Соберите бургер
        </h1>
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients />
          <BurgerConstructor />
        </main>
      </div>
    </DndProvider>
  );
};
