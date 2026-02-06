import { refreshToken } from '@/utils/auth-api';
import { getAccessToken } from '@/utils/token';

import type {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  Middleware,
} from '@reduxjs/toolkit';

import type { RootState } from '../store';

const buildWsUrlWithToken = (baseUrl: string): string => {
  const token = getAccessToken() ?? '';
  const u = new URL(baseUrl);

  if (token) {
    u.searchParams.set('token', normalizeAccessTokenForWs(token));
  } else {
    u.searchParams.delete('token');
  }

  return u.toString();
};

type TWsActionTypes<R, S> = {
  connect: ActionCreatorWithPayload<string>;
  disconnect: ActionCreatorWithoutPayload;
  onConnecting?: ActionCreatorWithoutPayload;
  onOpen?: ActionCreatorWithoutPayload;
  onClose?: ActionCreatorWithoutPayload;
  onError: ActionCreatorWithPayload<string>;
  onMessage: ActionCreatorWithPayload<R>;
  sendMessage?: ActionCreatorWithPayload<S>;
  isMessage?: (data: unknown) => data is R;
};

const RECONNECT_TIMEOUT = 3000;

const normalizeAccessTokenForWs = (token: string): string => {
  return encodeURIComponent(token.replace(/^Bearer\s+/i, ''));
};

const updateWsUrlToken = (rawUrl: string, accessToken: string): string => {
  const u = new URL(rawUrl);
  u.searchParams.set('token', normalizeAccessTokenForWs(accessToken));
  return u.toString();
};

export const socketMiddleware = <R, S>(
  wsActions: TWsActionTypes<R, S>,
  withTokenRefresh = false
): Middleware<Record<string, never>, RootState> => {
  return (store) => {
    let socket: WebSocket | null = null;

    const {
      connect,
      disconnect,
      onConnecting,
      onOpen,
      onClose,
      onError,
      onMessage,
      sendMessage,
      isMessage,
    } = wsActions;

    const { dispatch } = store;

    let isConnected = false;
    let url = '';
    let reconnectTimer: number | null = null;

    // чтобы не дергать refreshToken пачкой параллельных вызовов
    let refreshPromise: Promise<string> | null = null;

    const cleanupReconnectTimer = (): void => {
      if (reconnectTimer !== null) {
        window.clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    const forceReconnect = (nextUrl: string): void => {
      cleanupReconnectTimer();

      // не даём onclose запланировать reconnect по старому url
      isConnected = false;

      if (socket) {
        socket.close();
        socket = null;
      }

      url = nextUrl;
      isConnected = true;

      dispatch(connect(nextUrl));
    };

    return (next) => (action) => {
      if (connect.match(action)) {
        url = withTokenRefresh ? buildWsUrlWithToken(action.payload) : action.payload;
        socket = new WebSocket(url);
        isConnected = true;

        if (onConnecting) dispatch(onConnecting());

        socket.onopen = (): void => {
          if (onOpen) dispatch(onOpen());
        };

        socket.onerror = (): void => {
          dispatch(onError('WebSocket error'));
        };

        socket.onclose = (): void => {
          if (onClose) dispatch(onClose());

          if (isConnected) {
            reconnectTimer = window.setTimeout((): void => {
              const nextUrl = withTokenRefresh ? buildWsUrlWithToken(url) : url;
              dispatch(connect(nextUrl));
            }, RECONNECT_TIMEOUT);
          }
        };

        socket.onmessage = async (event: MessageEvent): Promise<void> => {
          try {
            const data = JSON.parse(event.data) as R & { message?: string };

            if (withTokenRefresh && data?.message === 'Invalid or missing token') {
              if (!refreshPromise) {
                refreshPromise = refreshToken()
                  .then((res) => res.accessToken)
                  .finally((): void => {
                    refreshPromise = null;
                  });
              }

              const newAccessToken = await refreshPromise;
              const nextUrl = updateWsUrlToken(url, newAccessToken);

              forceReconnect(nextUrl);
              return;
            }
            //валидация полезного payload (по ТЗ мусор пропускаем)
            if (isMessage && !isMessage(data)) {
              dispatch(onError('Invalid WS payload format'));
              return;
            }

            dispatch(onMessage(data as R));
          } catch (e) {
            dispatch(onError((e as Error).message));
          }
        };

        return;
      }

      if (disconnect.match(action)) {
        cleanupReconnectTimer();

        isConnected = false;

        if (socket) {
          socket.close();
          socket = null;
        }

        return;
      }

      if (socket && sendMessage?.match(action)) {
        try {
          socket.send(JSON.stringify(action.payload));
        } catch (e) {
          dispatch(onError((e as Error).message));
        }
        return;
      }

      return next(action);
    };
  };
};
