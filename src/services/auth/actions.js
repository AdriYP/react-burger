import {
  loginUser,
  registerUser,
  logoutUser,
  getUser,
  updateUser,
} from '@/utils/auth-api';
import { isTokenExist } from '@/utils/token';

export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const AUTH_CHECKED = 'AUTH_CHECKED';

export const authRequest = () => ({ type: AUTH_REQUEST });
export const authSuccess = (user) => ({ type: AUTH_SUCCESS, payload: user });
export const authError = (message) => ({ type: AUTH_ERROR, payload: message });
export const authLogout = () => ({ type: AUTH_LOGOUT });
export const authChecked = () => ({ type: AUTH_CHECKED });

export const login =
  ({ email, password }) =>
  async (dispatch) => {
    dispatch(authRequest());
    try {
      const res = await loginUser({ email, password });
      dispatch(authSuccess(res.user));
      dispatch(authChecked());
      return res;
    } catch (err) {
      dispatch(authError(err?.message || String(err)));
      dispatch(authChecked());
      throw err;
    }
  };

export const register =
  ({ email, password, name }) =>
  async (dispatch) => {
    dispatch(authRequest());
    try {
      const res = await registerUser({ email, password, name });
      dispatch(authSuccess(res.user));
      dispatch(authChecked());
      return res;
    } catch (err) {
      dispatch(authError(err?.message || String(err)));
      dispatch(authChecked());
      throw err;
    }
  };

export const logout = () => async (dispatch) => {
  dispatch(authRequest());
  try {
    const res = await logoutUser();
    dispatch(authLogout());
    dispatch(authChecked());
    return res;
  } catch (err) {
    dispatch(authLogout());
    dispatch(authError(err?.message || String(err)));
    dispatch(authChecked());
    throw err;
  }
};

//Проверка авторизации при старте
export const checkAuth = () => async (dispatch) => {
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
  } catch (err) {
    dispatch(authError(err?.message || String(err)));
    dispatch(authChecked());
    throw err;
  }
};

export const patchUser = (userData) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const res = await updateUser(userData);
    dispatch(authSuccess(res.user));
    dispatch(authChecked());
    return res;
  } catch (err) {
    dispatch(authError(err?.message || String(err)));
    dispatch(authChecked());
    throw err;
  }
};
