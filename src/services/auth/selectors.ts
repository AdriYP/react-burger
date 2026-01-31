import type { RootState } from '@/services/store';
import type { TUser } from '@/types/user';

export const selectUser = (state: RootState): TUser | null => state.auth.user;
export const selectIsAuthChecked = (state: RootState): boolean =>
  state.auth.isAuthChecked;
export const selectAuthLoading = (state: RootState): boolean => state.auth.loading;
export const selectAuthError = (state: RootState): string | null => state.auth.error;
