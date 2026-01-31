import {
  Input,
  EmailInput,
  PasswordInput,
  Button,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useForm } from '@/hooks/useForm';
import { register } from '@/services/auth/actions';
import { selectAuthError, selectAuthLoading } from '@/services/auth/selectors';
import { useAppDispatch, useAppSelector } from '@/services/hooks';

import type React from 'react';

import styles from './register.module.css';

type TFrom = { pathname: string };
type TLocationState = { from?: TFrom };

type TRegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

export function RegisterPage(): React.ReactElement {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const state = (location.state as TLocationState | null) ?? null;
  const from: TFrom = state?.from ?? { pathname: '/' };

  const { values: form, handleChange: onChange } = useForm<TRegisterFormValues>({
    name: '',
    email: '',
    password: '',
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      await dispatch(
        register({
          name: form.name,
          email: form.email,
          password: form.password,
        })
      );
      navigate(from.pathname || '/', { replace: true });
    } catch (err: unknown) {
      console.error(err);
    }
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
