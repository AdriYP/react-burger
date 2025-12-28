export type TApiResponseBase = {
  success: boolean;
  message?: string;
};

export type TApiSuccess<T extends Record<string, unknown> = Record<string, never>> =
  TApiResponseBase & { success: true } & T;

export type TApiFail = TApiResponseBase & { success: false };

export type TApiError = Error & {
  status?: number;
  data?: unknown;
};
