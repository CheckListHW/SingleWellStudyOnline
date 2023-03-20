/* eslint-disable max-len */
import { makeCommunicationActionCreators } from 'redux-make-communication';

import * as NS from '../../namespace';

export const { execute: loginAdmin, completed: loginAdminCompleted, failed: loginAdminFailed } = makeCommunicationActionCreators<NS.ILoginAdmin, NS.ILoginAdminCompleted, NS.ILoginAdminFailed>(
  'ADMIN_PANEL:LOGIN_ADMIN',
  'ADMIN_PANEL:LOGIN_ADMIN_COMPLETED',
  'ADMIN_PANEL:LOGIN_ADMIN_FAILED',
);

export const { execute: deleteUser, completed: deleteUserCompleted, failed: deleteUserFailed } = makeCommunicationActionCreators<NS.IDeleteUser, NS.IDeleteUserCompleted, NS.IDeleteUserFailed>(
  'ADMIN_PANEL:DELETE_USER',
  'ADMIN_PANEL:DELETE_USER_COMPLETED',
  'ADMIN_PANEL:DELETE_USER_FAILED',
);

export const { execute: changeUserPassword, completed: changeUserPasswordCompleted, failed: changeUserPasswordFailed } = makeCommunicationActionCreators<NS.IChangeUserPassword, NS.IChangeUserPasswordCompleted, NS.IChangeUserPasswordFailed>(
  'ADMIN_PANEL:CHANGE_USER_PASSWORD',
  'ADMIN_PANEL:CHANGE_USER_PASSWORD_COMPLETED',
  'ADMIN_PANEL:CHANGE_USER_PASSWORD_FAILED',
);

export const { execute: registrateAllUsers, completed: registrateAllUsersCompleted, failed: registrateAllUsersFailed } = makeCommunicationActionCreators<NS.IRegistrateAllUsers, NS.IRegistrateAllUsersCompleted, NS.IRegistrateAllUsersFailed>(
  'ADMIN_PANEL:REGISTRATE_ALL_USERS',
  'ADMIN_PANEL:REGISTRATE_ALL_USERS_COMPLETED',
  'ADMIN_PANEL:REGISTRATE_ALL_USERS_FAILED',
);

export const { execute: findUsers, completed: findUsersCompleted, failed: findUsersFailed } = makeCommunicationActionCreators<NS.IFindUsers, NS.IFindUsersCompleted, NS.IFindUsersFailed>(
  'ADMIN_PANEL:FIND_USERS',
  'ADMIN_PANEL:FIND_USERS_COMPLETED',
  'ADMIN_PANEL:FIND_USERS_FAILED',
);

export const { execute: changeUserActivity, completed: changeUserActivityCompleted, failed: changeUserActivityFailed } = makeCommunicationActionCreators<NS.IChangeUserActivity, NS.IChangeUserActivityCompleted, NS.IChangeUserActivityFailed>(
  'ADMIN_PANEL:CHANGE_USER_ACTIVITY',
  'ADMIN_PANEL:CHANGE_USER_ACTIVITY_COMPLETED',
  'ADMIN_PANEL:CHANGE_USER_ACTIVITY_FAILED',
);

export const { execute: changeUserActivityByUserList, completed: changeUserActivityByUserListCompleted, failed: changeUserActivityByUserListFailed } = makeCommunicationActionCreators<NS.IChangeUserActivityByUserList, NS.IChangeUserActivityByUserListCompleted, NS.IChangeUserActivityByUserListFailed>(
  'ADMIN_PANEL:CHANGE_USER_ACTIVITY_BY_USER_LIST',
  'ADMIN_PANEL:CHANGE_USER_ACTIVITY_BY_USER_LIST_COMPLETED',
  'ADMIN_PANEL:CHANGE_USER_ACTIVITY_BY_USER_LIST_FAILED',
);

export const { execute: getCurrentUserAllData, completed: getCurrentUserAllDataCompleted, failed: getCurrentUserAllDataFailed } = makeCommunicationActionCreators<NS.IGetUserAndAppAllData, NS.IGetUserAndAppAllDataCompleted, NS.IGetUserAndAppAllDataFailed>(
  'ADMIN_PANEL:GET_USER_AND_APP_ALL_DATA',
  'ADMIN_PANEL:GET_USER_AND_APP_ALL_DATA_COMPLETED',
  'ADMIN_PANEL:GET_USER_AND_APP_ALL_DATA_FAILED',
);

export const { execute: getDatasetList, completed: getDatasetListCompleted, failed: getDatasetListFailed } = makeCommunicationActionCreators<NS.IGetDatasetList, NS.IGetDatasetListCompleted, NS.IGetDatasetListFailed>(
  'ADMIN_PANEL:GET_DATASET_LIST',
  'ADMIN_PANEL:GET_DATASET_LIST_COMPLETED',
  'ADMIN_PANEL:GET_DATASET_LIST_FAILED',
);

export const { execute: saveDataset, completed: saveDatasetCompleted, failed: saveDatasetFailed } = makeCommunicationActionCreators<NS.ISaveDataset, NS.ISaveDatasetCompleted, NS.ISaveDatasetFailed>(
  'ADMIN_PANEL:SAVE_DATASET',
  'ADMIN_PANEL:SAVE_DATASET_COMPLETED',
  'ADMIN_PANEL:SAVE_DATASET_FAILED',
);

export const { execute: removeDataset, completed: removeDatasetCompleted, failed: removeDatasetFailed } = makeCommunicationActionCreators<NS.IRemoveDataset, NS.IRemoveDatasetCompleted, NS.IRemoveDatasetFailed>(
  'ADMIN_PANEL:REMOVE_DATASET',
  'ADMIN_PANEL:REMOVE_DATASET_COMPLETED',
  'ADMIN_PANEL:REMOVE_DATASET_FAILED',
);

export const { execute: getUsersReports, completed: getUsersReportsCompleted, failed: getUsersReportsFailed } = makeCommunicationActionCreators<NS.IGetUsersReports, NS.IGetUsersReportsCompleted, NS.IGetUsersReportsFailed>(
  'ADMIN_PANEL:GET_USERS_REPORTS',
  'ADMIN_PANEL:GET_USERS_REPORTS_COMPLETED',
  'ADMIN_PANEL:GET_USERS_REPORTS_FAILED',
);

export const { execute: getUsersList, completed: getUsersListCompleted, failed: getUsersListFailed } = makeCommunicationActionCreators<NS.IGetUsersList, NS.IGetUsersListCompleted, NS.IGetUsersListFailed>(
  'ADMIN_PANEL:GET_USERS_LIST',
  'ADMIN_PANEL:GET_USERS_LIST_COMPLETED',
  'ADMIN_PANEL:GET_USERS_LIST_FAILED',
);
