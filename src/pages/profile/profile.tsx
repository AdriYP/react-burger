import { NavLink, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { ProfileForm } from '@/components/profile-form/profile-form';
import { ProtectedRoute } from '@/components/protected-route/protected-route';
import { logout as logoutThunk } from '@/services/auth/actions';
import { useAppDispatch } from '@/services/hooks';

import { ProfileOrdersPage } from '../profile-orders/profile-orders';

import type React from 'react';

import styles from './profile.module.css';

export function ProfilePage(): React.ReactElement {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isOrdersActive = location.pathname.startsWith('/profile/orders');
  const isProfileActive = !isOrdersActive;

  const onLogout = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();

    void dispatch(logoutThunk())
      .then(() => navigate('/login', { replace: true }))
      .catch((err: unknown) => {
        console.error(err);
        navigate('/login', { replace: true });
      });
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* LEFT NAV */}
        <aside className={styles.nav}>
          <NavLink
            to="/profile"
            end
            className={`${styles.navLink} ${isProfileActive ? styles.navLinkActive : ''}`}
          >
            <p className="text text_type_main-medium">Профиль</p>
          </NavLink>

          <NavLink
            to="/profile/orders"
            className={`${styles.navLink} ${isOrdersActive ? styles.navLinkActive : ''}`}
          >
            <p className="text text_type_main-medium">История заказов</p>
          </NavLink>

          <a href="#" className={styles.navLink} onClick={onLogout}>
            <p className="text text_type_main-medium">Выход</p>
          </a>

          <p
            className={`text text_type_main-default text_color_inactive ${styles.hint}`}
          >
            В этом разделе вы можете
            <br />
            изменить свои персональные данные
          </p>
        </aside>

        {/* RIGHT CONTENT */}
        <section className={styles.content}>
          <Routes>
            <Route index element={<ProfileForm />} />
            <Route
              path="orders"
              element={<ProtectedRoute component={<ProfileOrdersPage />} />}
            />
          </Routes>
        </section>
      </div>
    </main>
  );
}
