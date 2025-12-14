import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { ForgotPasswordPage } from '@/pages/forgot-password/forgot-password';
import { HomePage } from '@/pages/home/home';
import { IngredientDetailsPage } from '@/pages/ingredient-details/ingredient-details';
import { LoginPage } from '@/pages/login/login';
import { NotFoundPage } from '@/pages/not-found/not-found';
import { ProfilePage } from '@/pages/profile/profile';
import { RegisterPage } from '@/pages/register/register';
import { ResetPasswordPage } from '@/pages/reset-password/reset-password';
import {
  selectIngredientsError,
  selectIngredientsLoading,
} from '@/services/app/selectors';
import { checkAuth } from '@/services/auth/actions';
import { loadIngredients } from '@/services/burger-ingredients/actions';

import { AppHeader } from '../app-header/app-header';
import { Modal } from '../modal/modal';
import { ProtectedRoute } from '../protected-route/protected-route';

import styles from './app.module.css';

export const App = () => {
  const loading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);
  const dispatch = useDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state && location.state.background;
  const backgroundLocation = state || null;

  useEffect(() => {
    dispatch(loadIngredients());
    //проверяем авторизацию
    dispatch(checkAuth()).catch(() => {
      //если не авторизован/токен протух — ок
    });
  }, []);

  if (loading)
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Preloader />
      </div>
    );

  if (error) return <div>Ошибка: {error}</div>;

  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        {/* страницы доступны всем пользователям */}
        <Route path="/" element={<HomePage />} />
        <Route path="/ingredients/:id" element={<IngredientDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* onlyUnAuth - страницы доступны только НЕавторизованным */}
        <Route
          path="/login"
          element={<ProtectedRoute onlyUnAuth component={<LoginPage />} />}
        />
        <Route
          path="/register"
          element={<ProtectedRoute onlyUnAuth component={<RegisterPage />} />}
        />
        <Route
          path="/forgot-password"
          element={<ProtectedRoute onlyUnAuth component={<ForgotPasswordPage />} />}
        />
        <Route
          path="/reset-password"
          element={<ProtectedRoute onlyUnAuth component={<ResetPasswordPage />} />}
        />

        {/* страницы доступны только авторизованным */}
        <Route
          path="/profile/*"
          element={<ProtectedRoute component={<ProfilePage />} />}
        />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleCloseModal}>
                <IngredientDetailsPage />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};
