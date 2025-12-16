import {
  Input,
  EmailInput,
  PasswordInput,
  Button,
  EditIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useForm } from '@/hooks/useForm';
import { patchUser } from '@/services/auth/actions';
import {
  selectUser,
  selectAuthLoading,
  selectAuthError,
} from '@/services/auth/selectors';

import styles from './profile-form.module.css';

export const ProfileForm = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [passwordResetKey, setPasswordResetKey] = useState(0);

  const {
    values: form,
    handleChange: onChange,
    setValues: setForm,
  } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const [initialForm, setInitialForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const next = {
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '', // всегда пустой на старте
    };
    setForm(next);
    setInitialForm(next);
  }, [user?.name, user?.email]);

  const isDirty =
    form.name !== initialForm.name ||
    form.email !== initialForm.email ||
    form.password !== initialForm.password;

  const onCancel = () => {
    setForm(initialForm);
    //заного отрисовать компонент PasswordInput,
    //чтобы убрать "глюк" ошибки при пустом PasswordInput
    setPasswordResetKey((k) => k + 1);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(
      patchUser({
        name: form.name,
        email: form.email,
        password: form.password,
      })
    )
      .then(() => {
        // фиксируем успешное сохранение
        const nextInitial = {
          name: form.name,
          email: form.email,
          password: '',
        };
        setInitialForm(nextInitial);
        setForm((prev) => ({ ...prev, password: '' }));
      })
      .catch((err) => console.error(err));
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.field}>
        <Input onChange={onChange} value={form.name} name="name" placeholder="Имя" />
        <span className={styles.iconRight}>
          <EditIcon type="primary" />
        </span>
      </div>

      <div className={styles.field}>
        <EmailInput
          onChange={onChange}
          value={form.email}
          name="email"
          placeholder="Логин"
        />
        <span className={styles.iconRight}>
          <EditIcon type="primary" />
        </span>
      </div>

      <div className={styles.field}>
        <PasswordInput
          key={passwordResetKey}
          onChange={onChange}
          value={form.password}
          name="password"
          placeholder="Пароль"
        />
      </div>

      {error && (
        <p className="text text_type_main-default text_color_error mt-4">{error}</p>
      )}

      {/* кнопки появляются только если форма изменена */}
      {isDirty && (
        <div className={styles.actions}>
          <button
            type="button"
            className={`text text_type_main-default text_color_inactive ${styles.cancel}`}
            onClick={onCancel}
            disabled={loading}
          >
            Отмена
          </button>

          <Button htmlType="submit" type="primary" size="medium" disabled={loading}>
            {loading ? 'Сохранение…' : 'Сохранить'}
          </Button>
        </div>
      )}
    </form>
  );
};
