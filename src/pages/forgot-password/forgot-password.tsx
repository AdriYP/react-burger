import { EmailInput, Button } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useForm } from '@/hooks/useForm';
import { requestPasswordReset } from '@/utils/auth-api';

import type React from 'react';

import styles from './forgot-password.module.css';

const RESET_FLAG_KEY = 'resetPassword' as const;

type TFrom = { pathname: string };
type TLocationState = { from?: TFrom };

type TForgotPasswordFormValues = {
  email: string;
};

export function ForgotPasswordPage(): React.ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state as TLocationState | null) ?? null;
  const from: TFrom = state?.from ?? { pathname: '/' };

  const { values: form, handleChange: onChange } = useForm<TForgotPasswordFormValues>({
    email: '',
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await requestPasswordReset({ email: form.email });

      // разрешаем доступ на reset-password
      localStorage.setItem(RESET_FLAG_KEY, 'true');

      navigate('/reset-password', { replace: true, state: { from } });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : typeof err === 'string' ? err : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>

        <EmailInput
          onChange={onChange}
          value={form.email}
          name="email"
          placeholder="Укажите e-mail"
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
          {loading ? 'Отправляем…' : 'Восстановить'}
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
