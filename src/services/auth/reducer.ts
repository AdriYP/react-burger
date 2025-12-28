import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_ERROR,
  AUTH_LOGOUT,
  AUTH_CHECKED,
} from './actions';

import type { TUser } from '@/types/user';

export type TAuthState = {
  user: TUser | null;
  loading: boolean;
  error: string | null;
  isAuthChecked: boolean;
};

const initialState: TAuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthChecked: false,
};

type TAuthRequestAction = { type: typeof AUTH_REQUEST };
type TAuthSuccessAction = { type: typeof AUTH_SUCCESS; payload: TUser };
type TAuthErrorAction = { type: typeof AUTH_ERROR; payload: string };
type TAuthLogoutAction = { type: typeof AUTH_LOGOUT };
type TAuthCheckedAction = { type: typeof AUTH_CHECKED };

type TAuthActions =
  | TAuthRequestAction
  | TAuthSuccessAction
  | TAuthErrorAction
  | TAuthLogoutAction
  | TAuthCheckedAction;

export const authReducer = (
  state: TAuthState = initialState,
  action: TAuthActions
): TAuthState => {
  switch (action.type) {
    case AUTH_REQUEST:
      return { ...state, loading: true, error: null };

    case AUTH_SUCCESS:
      return { ...state, loading: false, error: null, user: action.payload };

    case AUTH_ERROR:
      return { ...state, loading: false, error: action.payload };

    case AUTH_LOGOUT:
      return { ...state, loading: false, error: null, user: null };

    case AUTH_CHECKED:
      return { ...state, isAuthChecked: true };

    default:
      return state;
  }
};
