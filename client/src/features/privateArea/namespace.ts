import { IAction, IPlainAction, IPlainFailAction } from 'shared/types/redux';
import { IPersonalData } from 'shared/types/models';

export interface IReduxState {
  data: {
    serverMessage: string;
    messageStatus: number;
  } & IPersonalData;
}

export interface IDataForChangePassword {
  passwords: { oldPassword: string; newPassword: string; };
  token: string;
}

// tslint:disable:max-line-length
export type ISavePersonalData = IAction<'PRIVATE_AREA:SAVE_PERSONAL_DATA', IPersonalData & { token: string }>;
export type ISavePersonalDataCompleted = IAction<'PRIVATE_AREA:SAVE_PERSONAL_DATA_COMPLETED', { message: string } & IPersonalData>;
export type ISavePersonalDataFailed = IPlainFailAction<'PRIVATE_AREA:SAVE_PERSONAL_DATA_FAILED'>;
export type IClearMessage = IPlainAction<'PRIVATE_AREA:CLEAR_MESSAGE'>;

export type Action = ISavePersonalData
| ISavePersonalDataCompleted
| ISavePersonalDataFailed
| IClearMessage;
