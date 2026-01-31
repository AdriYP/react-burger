import { Navigate, useLocation } from 'react-router-dom';

import { CenteredPreloader } from '@/components/custom-preloader/custom-preloader';
import { selectIsAuthChecked, selectUser } from '@/services/auth/selectors';
import { useAppSelector } from '@/services/hooks';

import type React from 'react';

type TLocationState = {
  from?: { pathname: string };
};

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  component,
}: TProtectedRouteProps): React.ReactElement => {
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const user = useAppSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) return <CenteredPreloader />;

  // Страница только для авторизованных
  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Страница только для НЕавторизованных
  if (onlyUnAuth && user) {
    const state = location.state as TLocationState | null;
    const from = state?.from ?? { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  return component;
};
