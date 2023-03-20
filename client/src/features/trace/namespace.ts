import { IAction, IPlainAction, IPlainFailAction } from 'shared/types/redux';

export interface IReduxState {
  data: {
    serverMessage: string;
    messageStatus: number;
    name: string;
    surname: string;
    speciality: string;
    course: string;
    experience: number;
    expectations: string;
    email: string;
  };
}

export interface IPersonalData {
  name: string;
  surname: string;
  speciality: string;
  course: string;
  experience: number;
  expectations: string;
}


// tslint:disable:max-line-length
export type IGetPersonalData = IPlainAction<'TRACE:GET_PERSONAL_DATA'>;
export type IGetPersonalDataCompleted = IAction<'TRACE:GET_PERSONAL_DATA_COMPLETED', (IPersonalData & { email: string }) | { email: string }>;
export type IGetPersonalDataFailed = IPlainFailAction<'TRACE:GET_PERSONAL_DATA_FAILED'>;

export type ISavePersonalData = IAction<'TRACE:SAVE_PERSONAL_DATA', IPersonalData >;
export type ISavePersonalDataCompleted = IAction<'TRACE:SAVE_PERSONAL_DATA_COMPLETED', any>;
export type ISavePersonalDataFailed = IPlainFailAction<'TRACE:SAVE_PERSONAL_DATA_FAILED'>;

export type IChangePassword = IAction<'TRACE:CHANGE_PASSWORD', { oldPassword: string, newPassword: string }>;
export type IChangePasswordCompleted = IAction<'TRACE:CHANGE_PASSWORD_COMPLETED', string>;
export type IChangePasswordFailed = IPlainFailAction<'TRACE:CHANGE_PASSWORD_FAILED'>;


export type Action = IGetPersonalData
| IGetPersonalDataCompleted
| IGetPersonalDataFailed
| ISavePersonalData
| ISavePersonalDataCompleted
| ISavePersonalDataFailed
| IChangePassword
| IChangePasswordCompleted
| IChangePasswordFailed;
