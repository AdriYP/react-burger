import { createAction } from '@reduxjs/toolkit';

export const profileConnect = createAction<string, 'profile/connect'>('profile/connect');
export const profileDisconnect = createAction('profile/disconnect');

export type TProfileConnectActions =
  | ReturnType<typeof profileConnect>
  | ReturnType<typeof profileDisconnect>;
