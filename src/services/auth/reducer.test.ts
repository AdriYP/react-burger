import { describe, it, expect } from 'vitest';

import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_ERROR,
  AUTH_LOGOUT,
  AUTH_CHECKED,
} from './actions';
import { authReducer, initialState } from './reducer';

import type { TUser } from '@/types/user';

import type { TAuthState } from './reducer';

describe('authReducer', () => {
  const mockUser: TUser = {
    email: 'arto@example.com',
    name: 'Arto',
  };

  it('should return default initial state', () => {
    expect(authReducer(undefined, { type: 'UNKNOWN_ACTION' } as never)).toEqual(
      initialState
    );
  });

  it('should handle AUTH_REQUEST', () => {
    const prevState: TAuthState = {
      ...initialState,
      error: 'some error',
      user: mockUser,
    };

    const nextState = authReducer(prevState, { type: AUTH_REQUEST });

    expect(nextState).toEqual({
      ...prevState,
      loading: true,
      error: null,
    });
  });

  it('should handle AUTH_SUCCESS', () => {
    const prevState: TAuthState = {
      ...initialState,
      loading: true,
      error: 'some error',
    };

    const nextState = authReducer(prevState, {
      type: AUTH_SUCCESS,
      payload: mockUser,
    });

    expect(nextState).toEqual({
      ...prevState,
      loading: false,
      error: null,
      user: mockUser,
    });
  });

  it('should handle AUTH_ERROR', () => {
    const prevState: TAuthState = {
      ...initialState,
      loading: true,
      error: null,
    };

    const nextState = authReducer(prevState, {
      type: AUTH_ERROR,
      payload: 'auth error',
    });

    expect(nextState).toEqual({
      ...prevState,
      loading: false,
      error: 'auth error',
    });
  });

  it('should handle AUTH_LOGOUT', () => {
    const prevState: TAuthState = {
      ...initialState,
      user: mockUser,
      loading: true,
      error: 'some error',
    };

    const nextState = authReducer(prevState, { type: AUTH_LOGOUT });

    expect(nextState).toEqual({
      ...prevState,
      loading: false,
      error: null,
      user: null,
    });
  });

  it('should handle AUTH_CHECKED', () => {
    const prevState: TAuthState = {
      ...initialState,
      isAuthChecked: false,
    };

    const nextState = authReducer(prevState, { type: AUTH_CHECKED });

    expect(nextState).toEqual({
      ...prevState,
      isAuthChecked: true,
    });
  });
});
