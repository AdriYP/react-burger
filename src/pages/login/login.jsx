import {
  EmailInput,
  PasswordInput,
  Button,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { login } from '@/services/auth/actions';
import { selectAuthLoading, selectAuthError } from '@/services/auth/selectors';

import styles from './login.module.css';

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  //откуда пришли: либо из state.from, либо на главную
  const from = location.state?.from || { pathname: '/' };

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(login({ email: form.email, password: form.password }))
      .then(() => navigate(from.pathname || '/', { replace: true }))
      .catch((err) => console.error(err));
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <Preloader />
      </main>
    );
  }

  return (
    <main className={`${styles.page}`}>
      <form className={`${styles.form}`} onSubmit={onSubmit}>
        <h1 className="text text_type_main-medium mb-6">Вход</h1>

        <EmailInput
          onChange={onChange}
          value={form.email}
          name="email"
          placeholder="E-mail"
          extraClass="mb-6"
        />

        <PasswordInput
          onChange={onChange}
          value={form.password}
          name="password"
          placeholder="Пароль"
          icon="ShowIcon"
          extraClass="mb-6"
        />

        {/* если ошибка */}
        {error && (
          <p className="text text_type_main-default text_color_error mb-4">{error}</p>
        )}

        <Button htmlType="submit" type="primary" size="large" extraClass={styles.button}>
          Войти
        </Button>

        <p className="text text_type_main-default text_color_inactive mb-4">
          Вы — новый пользователь?{' '}
          <Link to="/register" state={{ from }} className={styles.link}>
            Зарегистрироваться
          </Link>
        </p>

        <p className="text text_type_main-default text_color_inactive">
          Забыли пароль?{' '}
          <Link to="/forgot-password" state={{ from }} className={styles.link}>
            Восстановить пароль
          </Link>
        </p>
      </form>
    </main>
  );
}
