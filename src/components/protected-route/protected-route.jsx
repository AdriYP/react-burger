import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { CenteredPreloader } from '@/components/custom-preloader/custom-preloader';
import { selectIsAuthChecked, selectUser } from '@/services/auth/selectors';

export const ProtectedRoute = ({ onlyUnAuth = false, component }) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) return <CenteredPreloader />;

  // Страница только для авторизованных
  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Страница только для НЕавторизованных
  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} replace />;
  }

  return component;
};
