import {
  Input,
  EmailInput,
  PasswordInput,
  Button,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { register } from '@/services/auth/actions';
import { selectAuthLoading, selectAuthError } from '@/services/auth/selectors';

import styles from './register.module.css';

export function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const location = useLocation();
  const from = location.state?.from || { pathname: '/' };

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(
      register({
        name: form.name,
        email: form.email,
        password: form.password,
      })
    )
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
    <main className={styles.page}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h1 className="text text_type_main-medium mb-6">Регистрация</h1>

        <Input
          onChange={onChange}
          value={form.name}
          name="name"
          placeholder="Имя"
          extraClass="mb-6"
        />

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

        {error && (
          <p className="text text_type_main-default text_color_error mb-4">{error}</p>
        )}

        <Button htmlType="submit" type="primary" size="large" extraClass={styles.button}>
          Зарегистрироваться
        </Button>

        <p className="text text_type_main-default text_color_inactive">
          Уже зарегистрированы?{' '}
          <Link to="/login" state={{ from }} className={styles.link}>
            Войти
          </Link>
        </p>
      </form>
    </main>
  );
}
