import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { CenteredPreloader } from '@/components/custom-preloader/custom-preloader';
import { FeedPage } from '@/pages/feed/feed';
import { ForgotPasswordPage } from '@/pages/forgot-password/forgot-password';
import { HomePage } from '@/pages/home/home';
import { IngredientDetailsPage } from '@/pages/ingredient-details/ingredient-details';
import { LoginPage } from '@/pages/login/login';
import { NotFoundPage } from '@/pages/not-found/not-found';
import { OrderInfoPage } from '@/pages/order-info/order-info';
import { ProfilePage } from '@/pages/profile/profile';
import { RegisterPage } from '@/pages/register/register';
import { ResetPasswordPage } from '@/pages/reset-password/reset-password';
import {
  selectIngredientsError,
  selectIngredientsLoading,
} from '@/services/app/selectors';
import { checkAuth } from '@/services/auth/actions';
import { loadIngredients } from '@/services/burger-ingredients/actions';
import { useAppDispatch, useAppSelector } from '@/services/hooks';

import { AppHeader } from '../app-header/app-header';
import { Modal } from '../modal/modal';
import { ProtectedRoute } from '../protected-route/protected-route';

import type React from 'react';
import type { Location } from 'react-router-dom';

import styles from './app.module.css';

type TLocationState = {
  background?: Location;
};

export const App = (): React.ReactElement => {
  const loading = useAppSelector(selectIngredientsLoading);
  const error = useAppSelector(selectIngredientsError);
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const backgroundLocation =
    (location.state as TLocationState | null)?.background ?? null;

  useEffect((): void => {
    dispatch(loadIngredients());

    // проверяем авторизацию (ошибка = норм, токена может не быть)
    void dispatch(checkAuth()).catch(() => undefined);
  }, [dispatch]);

  if (loading) return <CenteredPreloader />;

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  const handleCloseModal = (): void => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation ?? location}>
        {/* доступны всем */}
        <Route path="/" element={<HomePage />} />
        <Route path="/ingredients/:id" element={<IngredientDetailsPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/feed/:number" element={<OrderInfoPage />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* onlyUnAuth - только НЕавторизованным */}
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

        {/* только авторизованным */}
        <Route
          path="/profile/*"
          element={<ProtectedRoute component={<ProfilePage />} />}
        />
        <Route
          path="/profile/orders/:number"
          element={<ProtectedRoute component={<OrderInfoPage />} />}
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
          <Route
            path="/feed/:number"
            element={
              <Modal onClose={handleCloseModal}>
                <OrderInfoPage hideNumber />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute
                component={
                  <Modal onClose={handleCloseModal}>
                    <OrderInfoPage hideNumber />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};
