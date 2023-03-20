import { UserData } from 'shared/types/models';
import { IAction, IPlainAction, IPlainFailAction } from 'shared/types/redux';

export interface IReduxState {
  data: { serverMessage: string; messageStatus: number; } & UserData;
}

export type ILoginUser = IAction<'AUTHORIZATION:LOGIN_USER', { email: string, password: string }>;
export type ILoginUserCompleted = IAction<'AUTHORIZATION:LOGIN_USER_COMPLETED', UserData>;
export type ILoginUserFailed = IPlainFailAction<'AUTHORIZATION:LOGIN_USER_FAILED'>;

export type ILogoutUser = IPlainAction<'AUTHORIZATION:LOGOUT'>;
export type IClearMessage = IPlainAction<'AUTHORIZATION:CLEAR_MESSAGE'>;

export type Action = ILoginUser
| ILoginUserCompleted
| ILoginUserFailed
| ILogoutUser
| IClearMessage;
