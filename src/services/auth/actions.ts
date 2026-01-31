import {
  loginUser,
  registerUser,
  logoutUser,
  getUser,
  updateUser,
} from '@/utils/auth-api';
import { isTokenExist } from '@/utils/token';

import type { AppThunk } from '@/services/store';
import type { TUser } from '@/types/user';

// action types
export const AUTH_REQUEST = 'AUTH_REQUEST' as const;
export const AUTH_SUCCESS = 'AUTH_SUCCESS' as const;
export const AUTH_ERROR = 'AUTH_ERROR' as const;
export const AUTH_LOGOUT = 'AUTH_LOGOUT' as const;
export const AUTH_CHECKED = 'AUTH_CHECKED' as const;

// action creators
export const authRequest = () => ({ type: AUTH_REQUEST }) as const;
export const authSuccess = (user: TUser) =>
  ({ type: AUTH_SUCCESS, payload: user }) as const;
export const authError = (message: string) =>
  ({ type: AUTH_ERROR, payload: message }) as const;
export const authLogout = () => ({ type: AUTH_LOGOUT }) as const;
export const authChecked = () => ({ type: AUTH_CHECKED }) as const;

// actions union
export type TAuthActions =
  | ReturnType<typeof authRequest>
  | ReturnType<typeof authSuccess>
  | ReturnType<typeof authError>
  | ReturnType<typeof authLogout>
  | ReturnType<typeof authChecked>;

type TLoginArgs = { email: string; password: string };
type TRegisterArgs = { email: string; password: string; name: string };

export const login =
  ({ email, password }: TLoginArgs): AppThunk =>
  async (dispatch) => {
    dispatch(authRequest());
    try {
      const res = await loginUser({ email, password });
      dispatch(authSuccess(res.user));
      dispatch(authChecked());
      return res;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : err ? String(err) : 'Unknown error';
      dispatch(authError(message));
      dispatch(authChecked());
      throw err;
    }
  };

export const register =
  ({ email, password, name }: TRegisterArgs): AppThunk =>
  async (dispatch) => {
    dispatch(authRequest());
    try {
      const res = await registerUser({ email, password, name });
      dispatch(authSuccess(res.user));
      dispatch(authChecked());
      return res;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : err ? String(err) : 'Unknown error';
      dispatch(authError(message));
      dispatch(authChecked());
      throw err;
    }
  };

export const logout = (): AppThunk<Promise<unknown>> => async (dispatch) => {
  dispatch(authRequest());
  try {
    const res = await logoutUser();
    dispatch(authLogout());
    dispatch(authChecked());
    return res;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : err ? String(err) : 'Unknown error';
    dispatch(authLogout());
    dispatch(authError(message));
    dispatch(authChecked());
    throw err;
  }
};

// Проверка авторизации при старте
export const checkAuth = (): AppThunk<Promise<unknown | null>> => async (dispatch) => {
  if (!isTokenExist()) {
    dispatch(authChecked());
    return null;
  }

  dispatch(authRequest());
  try {
    const res = await getUser();
    dispatch(authSuccess(res.user));
    dispatch(authChecked());
    return res;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : err ? String(err) : 'Unknown error';
    dispatch(authError(message));
    dispatch(authChecked());
    throw err;
  }
};

export const patchUser =
  (userData: Partial<TUser>): AppThunk<Promise<{ user: TUser }>> =>
  async (dispatch) => {
    dispatch(authRequest());
    try {
      const res = await updateUser(userData);
      dispatch(authSuccess(res.user));
      dispatch(authChecked());
      return res;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : err ? String(err) : 'Unknown error';
      dispatch(authError(message));
      dispatch(authChecked());
      throw err;
    }
  };
