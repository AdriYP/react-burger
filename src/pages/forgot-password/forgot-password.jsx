import { EmailInput, Button } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useForm } from '@/hooks/useForm';
import { requestPasswordReset } from '@/utils/auth-api';

import styles from './forgot-password.module.css';

const RESET_FLAG_KEY = 'resetPassword';

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || { pathname: '/' };

  const { values: form, handleChange: onChange } = useForm({ email: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await requestPasswordReset({ email: form.email });

      // разрешаем доступ на reset-password
      localStorage.setItem(RESET_FLAG_KEY, 'true');

      navigate('/reset-password', { replace: true, state: { from } });
    } catch (err) {
      setError(err?.message || String(err));
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
        {/* вывод ошибки */}
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
