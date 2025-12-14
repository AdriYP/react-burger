import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './token';

export const AUTH_API_BASE_URL = 'https://norma.education-services.ru/api';

const buildError = (message, status, data) => {
  const err = new Error(message);
  err.status = status;
  err.data = data;
  return err;
};

const parseJsonSafe = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const isTokenError = (err) => {
  const msg = String(err?.message || '').toLowerCase();
  return (
    err?.status === 401 ||
    msg.includes('jwt expired') ||
    msg.includes('you should be authorised')
  );
};

const request = async (endpoint, options) => {
  const res = await fetch(`${AUTH_API_BASE_URL}${endpoint}`, options);
  const data = await parseJsonSafe(res);

  if (!res.ok) {
    throw buildError(
      data?.message || `HTTP ${res.status}: ${res.statusText}`,
      res.status,
      data
    );
  }
  if (!data?.success) {
    throw buildError(data?.message || 'API response success=false', res.status, data);
  }
  return data;
};

const jsonRequest = async (endpoint, method, body, extraHeaders = {}) => {
  return request(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });
};

export const refreshToken = async () => {
  const token = getRefreshToken();
  if (!token) throw buildError('No refresh token', 401, null);

  const data = await jsonRequest('/auth/token', 'POST', { token });

  //сохраняем обновлённые токены в localStorage
  saveTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });

  return data;
};

// универсальный запрос с авто-обновлением accessToken
const fetchWithRefresh = async (endpoint, options = {}) => {
  try {
    return await request(endpoint, options);
  } catch (err) {
    if (!isTokenError(err)) throw err;

    // пробуем обновить токен
    const refreshed = await refreshToken().catch((refreshErr) => {
      clearTokens();
      throw refreshErr;
    });

    // повторяем исходный запрос с новым accessToken
    const headers = new Headers(options.headers || {});
    headers.set('authorization', refreshed.accessToken);

    return request(endpoint, { ...options, headers });
  }
};

//endpoints
export const requestPasswordReset = async ({ email }) => {
  return jsonRequest('/password-reset', 'POST', { email });
};

export const resetPassword = async ({ password, token }) => {
  return jsonRequest('/password-reset/reset', 'POST', { password, token });
};

export const loginUser = async ({ email, password }) => {
  const data = await jsonRequest('/auth/login', 'POST', { email, password });
  saveTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
};

export const registerUser = async ({ email, password, name }) => {
  const data = await jsonRequest('/auth/register', 'POST', { email, password, name });
  saveTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
};

export const logoutUser = async () => {
  const refreshTokenValue = getRefreshToken();

  // даже если токена нет — локально считаем "вышли"
  if (!refreshTokenValue) {
    clearTokens();
    return { success: true, message: 'No refresh token, local logout' };
  }

  try {
    const data = await jsonRequest('/auth/logout', 'POST', { token: refreshTokenValue });
    clearTokens();
    return data;
  } catch (err) {
    // даже если запрос упал — токены всё равно чистим
    clearTokens();
    throw err;
  }
};

export const getUser = async () => {
  const accessToken = getAccessToken();

  return fetchWithRefresh('/auth/user', {
    method: 'GET',
    headers: {
      Authorization: accessToken,
    },
  });
};

export const updateUser = async (userData) => {
  const accessToken = getAccessToken();

  return fetchWithRefresh('/auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken,
    },
    body: JSON.stringify(userData),
  });
};
