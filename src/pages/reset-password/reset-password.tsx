import {
  Input,
  PasswordInput,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useForm } from '@/hooks/useForm';
import { resetPassword } from '@/utils/auth-api';

import type React from 'react';

import styles from './reset-password.module.css';

const RESET_FLAG_KEY = 'resetPassword' as const;

type TFrom = { pathname: string };
type TLocationState = { from?: TFrom };

type TResetPasswordFormValues = {
  password: string;
  code: string;
};

export function ResetPasswordPage(): React.ReactElement {
  const { values: form, handleChange: onChange } = useForm<TResetPasswordFormValues>({
    password: '',
    code: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const state = (location.state as TLocationState | null) ?? null;
  const from: TFrom = state?.from ?? { pathname: '/' };

  const [isAllowed] = useState<boolean>(
    () => localStorage.getItem(RESET_FLAG_KEY) === 'true'
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await resetPassword({
        password: form.password,
        token: form.code,
      });

      // убираем флаг — reset выполнен
      localStorage.removeItem(RESET_FLAG_KEY);

      navigate('/login', { replace: true, state: { from } });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : typeof err === 'string' ? err : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAllowed) {
    return <Navigate to="/forgot-password" replace state={{ from }} />;
  }

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>

        <PasswordInput
          onChange={onChange}
          value={form.password}
          name="password"
          placeholder="Введите новый пароль"
          icon="ShowIcon"
          extraClass="mb-6"
        />

        <Input
          onChange={onChange}
          value={form.code}
          name="code"
          placeholder="Введите код из письма"
          extraClass="mb-6"
        />

        {error && (
          <p className="text text_type_main-default text_color_error mb-4">{error}</p>
        )}

        <Button
          htmlType="submit"
          type="primary"
          size="large"
          extraClass={styles.button}
          disabled={loading}
        >
          {loading ? 'Сохраняем…' : 'Сохранить'}
        </Button>

        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?{' '}
          <Link to="/login" state={{ from }} className={styles.link}>
            Войти
          </Link>
        </p>
      </form>
    </main>
  );
}
