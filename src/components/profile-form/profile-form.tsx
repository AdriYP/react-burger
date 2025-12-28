import {
  Input,
  EmailInput,
  PasswordInput,
  Button,
  EditIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { useForm } from '@/hooks/useForm';
import { patchUser } from '@/services/auth/actions';
import {
  selectUser,
  selectAuthLoading,
  selectAuthError,
} from '@/services/auth/selectors';
import { useAppDispatch, useAppSelector } from '@/services/hooks';

import type React from 'react';

import styles from './profile-form.module.css';

type TProfileFormValues = {
  name: string;
  email: string;
  password: string;
};

export const ProfileForm = (): React.ReactElement => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [passwordResetKey, setPasswordResetKey] = useState<number>(0);

  const {
    values: form,
    handleChange: onChange,
    setValues: setForm,
  } = useForm<TProfileFormValues>({
    name: '',
    email: '',
    password: '',
  });

  const [initialForm, setInitialForm] = useState<TProfileFormValues>({
    name: '',
    email: '',
    password: '',
  });

  useEffect((): void => {
    const next: TProfileFormValues = {
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    };
    setForm(next);
    setInitialForm(next);
  }, [user?.name, user?.email, setForm]);

  const isDirty: boolean =
    form.name !== initialForm.name ||
    form.email !== initialForm.email ||
    form.password !== initialForm.password;

  const onCancel = (): void => {
    setForm(initialForm);
    // заново отрисовать PasswordInput, чтобы убрать "глюк" ошибки при пустом PasswordInput
    setPasswordResetKey((k) => k + 1);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    void dispatch(
      patchUser({
        name: form.name,
        email: form.email,
        password: form.password,
      })
    )
      .then((): void => {
        const nextInitial: TProfileFormValues = {
          name: form.name,
          email: form.email,
          password: '',
        };
        setInitialForm(nextInitial);
        setForm((prev) => ({ ...prev, password: '' }));
      })
      .catch((err: unknown): void => {
        console.error(err);
      });
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
