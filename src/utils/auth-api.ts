import { API_BASE_URL } from './api-base';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './token';

import type { TApiSuccess } from '@/types/api';
import type { TUser } from '@/types/user';

type TSuccessFlag = { success: boolean; message?: string };

type TAuthTokensResponse = TApiSuccess<{ accessToken: string; refreshToken: string }>;
type TAuthWithUserResponse = TApiSuccess<{
  user: TUser;
  accessToken: string;
  refreshToken: string;
}>;
type TUserResponse = TApiSuccess<{ user: TUser }>;
type TMessageResponse = TApiSuccess<{ message?: string }>;

import { getErrorMessage, getErrorStatus, buildError } from '@/utils/errors';

const parseJsonSafe = async (res: Response): Promise<unknown> => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const hasMessage = (v: unknown): v is { message: string } => {
  if (typeof v !== 'object' || v === null) return false;
  const rec = v as Record<string, unknown>;
  return typeof rec.message === 'string';
};

const hasSuccessFlag = (v: unknown): v is TSuccessFlag => {
  if (typeof v !== 'object' || v === null) return false;
  const rec = v as Record<string, unknown>;
  return typeof rec.success === 'boolean';
};

const isTokenError = (err: unknown): boolean => {
  const msg = getErrorMessage(err).toLowerCase();
  return (
    getErrorStatus(err) === 401 ||
    msg.includes('jwt expired') ||
    msg.includes('you should be authorised')
  );
};

const request = async <T extends TSuccessFlag>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await parseJsonSafe(res);

  if (!res.ok) {
    const message = hasMessage(data)
      ? data.message
      : `HTTP ${res.status}: ${res.statusText}`;
    throw buildError(message, res.status, data);
  }

  if (!hasSuccessFlag(data) || !data.success) {
    const message = hasMessage(data) ? data.message : 'API response success=false';
    throw buildError(message, res.status, data);
  }

  return data as T;
};

const jsonRequest = async <T extends TSuccessFlag>(
  endpoint: string,
  method: string,
  body: unknown,
  extraHeaders: Record<string, string> = {}
): Promise<T> => {
  return request<T>(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });
};

// универсальный запрос с авто-обновлением accessToken
const fetchWithRefresh = async <T extends TSuccessFlag>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    return await request<T>(endpoint, options);
  } catch (err) {
    if (!isTokenError(err)) throw err;

    // пробуем обновить токен
    const refreshed = await refreshToken().catch((refreshErr) => {
      clearTokens();
      throw refreshErr;
    });

    // повторяем исходный запрос с новым accessToken
    const headers = new Headers(options.headers || {});
    headers.set('Authorization', refreshed.accessToken);

    return request<T>(endpoint, { ...options, headers });
  }
};

export const refreshToken = async (): Promise<TAuthTokensResponse> => {
  const token = getRefreshToken();
  if (!token) throw buildError('No refresh token', 401, null);

  const data = await jsonRequest<TAuthTokensResponse>('/auth/token', 'POST', { token });

  // сохраняем обновлённые токены в localStorage
  saveTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });

  return data;
};

// endpoints
export const requestPasswordReset = async ({
  email,
}: {
  email: string;
}): Promise<TMessageResponse> => {
  return jsonRequest<TMessageResponse>('/password-reset', 'POST', { email });
};

export const resetPassword = async ({
  password,
  token,
}: {
  password: string;
  token: string;
}): Promise<TMessageResponse> => {
  return jsonRequest<TMessageResponse>('/password-reset/reset', 'POST', {
    password,
    token,
  });
};

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<TAuthWithUserResponse> => {
  const data = await jsonRequest<TAuthWithUserResponse>('/auth/login', 'POST', {
    email,
    password,
  });
  saveTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
};

export const registerUser = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}): Promise<TAuthWithUserResponse> => {
  const data = await jsonRequest<TAuthWithUserResponse>('/auth/register', 'POST', {
    email,
    password,
    name,
  });
  saveTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
};

export const logoutUser = async (): Promise<TMessageResponse> => {
  const refreshTokenValue = getRefreshToken();

  // даже если токена нет — локально считаем "вышли"
  if (!refreshTokenValue) {
    clearTokens();
    return { success: true, message: 'No refresh token, local logout' };
  }

  try {
    const data = await jsonRequest<TMessageResponse>('/auth/logout', 'POST', {
      token: refreshTokenValue,
    });
    clearTokens();
    return data;
  } catch (err) {
    // даже если запрос упал — токены всё равно чистим
    clearTokens();
    throw err;
  }
};

export const getUser = async (): Promise<TUserResponse> => {
  const accessToken = getAccessToken();

  return fetchWithRefresh<TUserResponse>('/auth/user', {
    method: 'GET',
    headers: {
      Authorization: accessToken || '',
    },
  });
};

export const updateUser = async (
  userData: Partial<{ email: string; name: string; password: string }>
): Promise<TUserResponse> => {
  const accessToken = getAccessToken();

  return fetchWithRefresh<TUserResponse>('/auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken || '',
    },
    body: JSON.stringify(userData),
  });
};
