import { IAction, IPlainAction, IPlainFailAction } from 'shared/types/redux';
import { IAllUserAndAppData } from 'shared/types/models';

export interface IUser {
  id: string;
  email: string;
  isActive: boolean;
  activeUntil: number;
  datasetId: number;
}

export interface IUsersListItem {
  orderNumber: number;
  email: string;
  password: string;
  isActive: boolean;
  activeUntil: number;
  datasetId: number;
}

interface IAdminRegistrationData {
  adminToken: string;
  adminId: string;
  adminEmail: string;
}

export interface IDataset {
  datasetId: number;
  description: string;
  downloadDate: string;
  dataset?: { [key: string]: number[]; };
}

export interface IReduxState {
  data: {
    serverMessage: string;
    messageStatus: number;
    foundUsers: IUser[];
    registratedUsers: { email: string; orderNumber: number; }[];
    currentUserAllData: IAllUserAndAppData;
    datasetList: IDataset[];
    usersList: IUsersListItem[];
    currentUserReportResponse: any;
    isDeleting: { status: boolean; userId: string; };
    isPasswordChanging: { status: boolean; userId: string; };
    isActivityStatusChanging: { status: boolean; userId: string; };
    isGettingUserAllData: { status: boolean; userId: string; };
    isGettingUsersList: boolean;
    isGettingUsersReports: boolean;
    isUpdatingUserActivitiesByList: boolean;
  } & IAdminRegistrationData;
}

export { IAllUserAndAppData };

// tslint:disable:max-line-length
export type ILoginAdmin = IAction<'ADMIN_PANEL:LOGIN_ADMIN', { email: string, password: string }>;
export type ILoginAdminCompleted = IAction<'ADMIN_PANEL:LOGIN_ADMIN_COMPLETED', IAdminRegistrationData>;
export type ILoginAdminFailed = IPlainFailAction<'ADMIN_PANEL:LOGIN_ADMIN_FAILED'>;

export type IFindUsers = IAction<'ADMIN_PANEL:FIND_USERS', { token: string; userEmail: string; }>;
export type IFindUsersCompleted = IAction<'ADMIN_PANEL:FIND_USERS_COMPLETED', { foundUsers: IUser[]; }>;
export type IFindUsersFailed = IPlainFailAction<'ADMIN_PANEL:FIND_USERS_FAILED'>;

export type IDeleteUser = IAction<'ADMIN_PANEL:DELETE_USER', { userId: string; token: string; }>;
export type IDeleteUserCompleted = IAction<'ADMIN_PANEL:DELETE_USER_COMPLETED', { message: string; foundUsers: IUser[]; }>;
export type IDeleteUserFailed = IPlainFailAction<'ADMIN_PANEL:DELETE_USER_FAILED'>;

export type IChangeUserPassword = IAction<'ADMIN_PANEL:CHANGE_USER_PASSWORD', { userId: string; newPassword: string; token: string; }>;
export type IChangeUserPasswordCompleted = IAction<'ADMIN_PANEL:CHANGE_USER_PASSWORD_COMPLETED', { message: string; }>;
export type IChangeUserPasswordFailed = IPlainFailAction<'ADMIN_PANEL:CHANGE_USER_PASSWORD_FAILED'>;

export type IRegistrateAllUsers = IAction<'ADMIN_PANEL:REGISTRATE_ALL_USERS', { token: string; usersList: { email: string; password: string; activeUntil: number; datasetId: number; }[]; }>;
export type IRegistrateAllUsersCompleted = IAction<'ADMIN_PANEL:REGISTRATE_ALL_USERS_COMPLETED', { message: string; }>;
export type IRegistrateAllUsersFailed = IPlainFailAction<'ADMIN_PANEL:REGISTRATE_ALL_USERS_FAILED'>;
export type IRegistrateAllUsersСontinues = IAction<'ADMIN_PANEL:REGISTRATE_ALL_USERS_CONTINUES', { email: string; orderNumber: number; }>;

export type IChangeUserActivityByUserList = IAction<'ADMIN_PANEL:CHANGE_USER_ACTIVITY_BY_USER_LIST', { token: string; userListForChangeActivity: { userId: string; activeUntil: number; isActive: boolean; }[]; }>;
export type IChangeUserActivityByUserListCompleted = IAction<'ADMIN_PANEL:CHANGE_USER_ACTIVITY_BY_USER_LIST_COMPLETED', { message: string; }>;
export type IChangeUserActivityByUserListFailed = IPlainFailAction<'ADMIN_PANEL:CHANGE_USER_ACTIVITY_BY_USER_LIST_FAILED'>;

export type IChangeUserActivity = IAction<'ADMIN_PANEL:CHANGE_USER_ACTIVITY', { token: string; userId: string; activeUntil: number; isActive: boolean; }>;
export type IChangeUserActivityCompleted = IAction<'ADMIN_PANEL:CHANGE_USER_ACTIVITY_COMPLETED', { message: string; foundUsers: IUser[]; }>;
export type IChangeUserActivityFailed = IPlainFailAction<'ADMIN_PANEL:CHANGE_USER_ACTIVITY_FAILED'>;

export type IGetUserAndAppAllData = IAction<'ADMIN_PANEL:GET_USER_AND_APP_ALL_DATA', { token: string; userId: string; }>;
export type IGetUserAndAppAllDataCompleted = IAction<'ADMIN_PANEL:GET_USER_AND_APP_ALL_DATA_COMPLETED', IAllUserAndAppData>;
export type IGetUserAndAppAllDataFailed = IPlainFailAction<'ADMIN_PANEL:GET_USER_AND_APP_ALL_DATA_FAILED'>;

export type IGetDatasetList = IAction<'ADMIN_PANEL:GET_DATASET_LIST', string>;
export type IGetDatasetListCompleted = IAction<'ADMIN_PANEL:GET_DATASET_LIST_COMPLETED', { datasetList: IDataset[]; }>;
export type IGetDatasetListFailed = IPlainFailAction<'ADMIN_PANEL:GET_DATASET_LIST_FAILED'>;

export type ISaveDataset = IAction<'ADMIN_PANEL:SAVE_DATASET', { token: string; dataset: { [key: string]: number[]; }; datasetId: number; description: string; }>;
export type ISaveDatasetCompleted = IAction<'ADMIN_PANEL:SAVE_DATASET_COMPLETED', { message: string; datasetList: IDataset[]; }>;
export type ISaveDatasetFailed = IPlainFailAction<'ADMIN_PANEL:SAVE_DATASET_FAILED'>;

export type IRemoveDataset = IAction<'ADMIN_PANEL:REMOVE_DATASET', { token: string; datasetId: number; }>;
export type IRemoveDatasetCompleted = IAction<'ADMIN_PANEL:REMOVE_DATASET_COMPLETED', { message: string; datasetList: IDataset[]; }>;
export type IRemoveDatasetFailed = IPlainFailAction<'ADMIN_PANEL:REMOVE_DATASET_FAILED'>;

export type IGetUsersReports = IAction<'ADMIN_PANEL:GET_USERS_REPORTS', { token: string; usersList: { userId: string; email: string; }[] }>;
export type IGetUsersReportsCompleted = IAction<'ADMIN_PANEL:GET_USERS_REPORTS_COMPLETED', any>;
export type IGetUsersReportsFailed = IPlainFailAction<'ADMIN_PANEL:GET_USERS_REPORTS_FAILED'>;

export type IGetUsersList = IAction<'ADMIN_PANEL:GET_USERS_LIST', string>;
export type IGetUsersListCompleted = IAction<'ADMIN_PANEL:GET_USERS_LIST_COMPLETED', { usersList: IUsersListItem[]; }>;
export type IGetUsersListFailed = IPlainFailAction<'ADMIN_PANEL:GET_USERS_LIST_FAILED'>;

export type IClearRegistratedUsers = IPlainAction<'ADMIN_PANEL:CLEAR_REGISTRATED_USERS'>;
export type ILogoutAdmin = IPlainAction<'ADMIN_PANEL:LOGOUT_ADMIN'>;
export type IClearMessage = IPlainAction<'ADMIN_PANEL:CLEAR_MESSAGE'>;
export type IClearCurrentUserReportUrl = IPlainAction<'ADMIN_PANEL:CLEAR_CURRENT_USER_REPORT_URL'>;

export type Action = ILoginAdmin
| ILoginAdminCompleted
| ILoginAdminFailed
| IFindUsers
| IFindUsersCompleted
| IFindUsersFailed
| IDeleteUser
| IDeleteUserCompleted
| IDeleteUserFailed
| IChangeUserPassword
| IChangeUserPasswordCompleted
| IChangeUserPasswordFailed
| IRegistrateAllUsers
| IRegistrateAllUsersCompleted
| IRegistrateAllUsersFailed
| IRegistrateAllUsersСontinues
| IChangeUserActivity
| IChangeUserActivityCompleted
| IChangeUserActivityFailed
| IChangeUserActivityByUserList
| IChangeUserActivityByUserListCompleted
| IChangeUserActivityByUserListFailed
| IGetUserAndAppAllData
| IGetUserAndAppAllDataCompleted
| IGetUserAndAppAllDataFailed
| IGetDatasetList
| IGetDatasetListCompleted
| IGetDatasetListFailed
| ISaveDataset
| ISaveDatasetCompleted
| ISaveDatasetFailed
| IRemoveDataset
| IRemoveDatasetCompleted
| IRemoveDatasetFailed
| IGetUsersReports
| IGetUsersReportsCompleted
| IGetUsersReportsFailed
| IGetUsersList
| IGetUsersListCompleted
| IGetUsersListFailed
| IClearRegistratedUsers
| ILogoutAdmin
| IClearMessage
| IClearCurrentUserReportUrl;
