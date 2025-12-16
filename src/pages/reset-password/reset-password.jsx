import {
  Input,
  PasswordInput,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useForm } from '@/hooks/useForm';
import { resetPassword } from '@/utils/auth-api';

import styles from './reset-password.module.css';

const RESET_FLAG_KEY = 'resetPassword';

export function ResetPasswordPage() {
  const { values: form, handleChange: onChange } = useForm({
    password: '',
    code: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || { pathname: '/' };

  const [isAllowed] = useState(() => localStorage.getItem(RESET_FLAG_KEY) === 'true');

  const onSubmit = async (e) => {
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
      return;
    } catch (err) {
      setError(err?.message || String(err));
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
