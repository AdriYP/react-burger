import type { TApiError } from '@/types/api';

export const buildError = (
  message: string,
  status?: number,
  data?: unknown
): TApiError => {
  const err = new Error(message) as TApiError;
  err.status = status;
  err.data = data;
  return err;
};

export const getErrorMessage = (e: unknown): string =>
  e instanceof Error ? e.message : String(e);

export const getErrorStatus = (e: unknown): number | undefined => {
  if (typeof e !== 'object' || e === null) return undefined;
  if (!('status' in e)) return undefined;
  const status = (e as Record<string, unknown>).status;
  return typeof status === 'number' ? status : undefined;
};
