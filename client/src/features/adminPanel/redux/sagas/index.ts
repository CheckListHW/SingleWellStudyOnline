/* eslint-disable no-restricted-syntax */
import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';

import { IDependencies } from 'shared/types/app';
import { getErrorMsg } from 'shared/helpers';

import * as actions from '../actions';
import * as NS from '../../namespace';

const loginAdminType: NS.ILoginAdmin['type'] = 'ADMIN_PANEL:LOGIN_ADMIN';
const deleteUserType: NS.IDeleteUser['type'] = 'ADMIN_PANEL:DELETE_USER';
const changeUserPasswordType: NS.IChangeUserPassword['type'] = 'ADMIN_PANEL:CHANGE_USER_PASSWORD';
const registrateAllUsersType: NS.IRegistrateAllUsers['type'] = 'ADMIN_PANEL:REGISTRATE_ALL_USERS';
const findUsersType: NS.IFindUsers['type'] = 'ADMIN_PANEL:FIND_USERS';
const changeUserActivityType: NS.IChangeUserActivity['type'] = 'ADMIN_PANEL:CHANGE_USER_ACTIVITY';
const changeUserActivityByUserListType: NS.IChangeUserActivityByUserList['type'] = 'ADMIN_PANEL:CHANGE_USER_ACTIVITY_BY_USER_LIST';
const getUserAndAppAllDataType: NS.IGetUserAndAppAllData['type'] = 'ADMIN_PANEL:GET_USER_AND_APP_ALL_DATA';
const getDatasetListType: NS.IGetDatasetList['type'] = 'ADMIN_PANEL:GET_DATASET_LIST';
const saveDatasetType: NS.ISaveDataset['type'] = 'ADMIN_PANEL:SAVE_DATASET';
const removeDatasetType: NS.IRemoveDataset['type'] = 'ADMIN_PANEL:REMOVE_DATASET';
const getUsersReportsType: NS.IGetUsersReports['type'] = 'ADMIN_PANEL:GET_USERS_REPORTS';
const getUsersListType: NS.IGetUsersList['type'] = 'ADMIN_PANEL:GET_USERS_LIST';


function rootSaga(deps: IDependencies) {
  return function* saga(): SagaIterator {
    yield takeLatest(loginAdminType, loginAdminSaga, deps);
    yield takeLatest(deleteUserType, deleteUserSaga, deps);
    yield takeLatest(changeUserPasswordType, changeUserPasswordSaga, deps);
    yield takeLatest(registrateAllUsersType, registrateAllUsersSaga, deps);
    yield takeLatest(findUsersType, findUsersSaga, deps);
    yield takeLatest(changeUserActivityType, changeUserActivitySaga, deps);
    yield takeLatest(changeUserActivityByUserListType, changeUserActivityByUserListSaga, deps);
    yield takeLatest(getUserAndAppAllDataType, getUserAndAppAllDataSaga, deps);
    yield takeLatest(getDatasetListType, getDatasetListSaga, deps);
    yield takeLatest(saveDatasetType, saveDatasetSaga, deps);
    yield takeLatest(removeDatasetType, removeDatasetSaga, deps);
    yield takeLatest(getUsersReportsType, getUsersReportsSaga, deps);
    yield takeLatest(getUsersListType, getUsersListSaga, deps);
  };
}

function* loginAdminSaga({ api }: IDependencies,
  action: { payload: { email: string; password: string; } }) {
  try {
    const { email, password } = action.payload;

    const user = yield call(api.loginAdmin, email, password);
    yield put(actions.loginAdminCompleted(user.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.loginAdminFailed(errorMsg));
  }
}

function* deleteUserSaga({ api }: IDependencies,
  action: { payload: { token: string; userId: string; } }) {
  try {
    const { token, userId } = action.payload;

    const user = yield call(api.deleteUser, token, userId);
    yield put(actions.deleteUserCompleted(user.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.deleteUserFailed(errorMsg));
  }
}

function* changeUserPasswordSaga({ api }: IDependencies,
  action: { payload: { token: string; userId: string; newPassword: string; } }) {
  try {
    const { token, userId, newPassword } = action.payload;

    const user = yield call(api.changeUserPassword, token, userId, newPassword);
    yield put(actions.changeUserPasswordCompleted(user.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.changeUserPasswordFailed(errorMsg));
  }
}

function* registrateAllUsersSaga({ api }: IDependencies,
  action: { payload: { token: string; usersList: { email: string;
    password: string; activeUntil: number; datasetId: number; }[]; } }) {
  try {
    const { usersList, token } = action.payload;
    let i = 1;
    for (const item of usersList) {
      yield call(api.registrateUser, token, item.email, item.password,
        item.activeUntil, item.datasetId);
      yield put(actions.registrateAllUsersContinues({ email: item.email, orderNumber: i }));
      i += 1;
    }

    yield put(actions.registrateAllUsersCompleted({ message: 'Регистрация пользователей завершена!' }));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.registrateAllUsersFailed(errorMsg));
  }
}

function* findUsersSaga({ api }: IDependencies, action: { payload: { token: string; userEmail: string; } }) {
  try {
    const { token, userEmail } = action.payload;

    const users = yield call(api.findUsers, token, userEmail);
    yield put(actions.findUsersCompleted(users.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.findUsersFailed(errorMsg));
  }
}

function* changeUserActivitySaga({ api }: IDependencies,
  action: { payload: { token: string; userId: string; activeUntil: number; isActive: boolean; } }) {
  try {
    const { token, userId, activeUntil, isActive } = action.payload;

    const newUsersList = yield call(api.changeUserActivity, token, userId, activeUntil, isActive);
    yield put(actions.changeUserActivityCompleted(newUsersList.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.changeUserActivityFailed(errorMsg));
  }
}

function* changeUserActivityByUserListSaga({ api }: IDependencies,
  action: { payload: { token: string; userListForChangeActivity: { userId: string; activeUntil: number; isActive: boolean; }[]; } }) {
  try {
    const { token, userListForChangeActivity } = action.payload;

    for (const item of userListForChangeActivity) {
      yield call(api.changeUserActivity, token, item.userId, item.activeUntil, item.isActive);
    }

    yield put(actions.changeUserActivityByUserListCompleted({ message: 'Обновление активностей выполнено' }));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.changeUserActivityByUserListFailed(errorMsg));
  }
}

function* getUserAndAppAllDataSaga({ api }: IDependencies,
  action: { payload: { token: string; userId: string; } }) {
  try {
    const { token, userId } = action.payload;

    const allData = yield call(api.getAllUserAndAppData, token, userId);
    yield put(actions.getCurrentUserAllDataCompleted(allData.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.getCurrentUserAllDataFailed(errorMsg));
  }
}

function* getDatasetListSaga({ api }: IDependencies,
  action: { payload: string; }) {
  try {
    const token = action.payload;
    const response = yield call(api.getAllDatasets, token);
    yield put(actions.getDatasetListCompleted(response.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.getDatasetListFailed(errorMsg));
  }
}

function* saveDatasetSaga({ api }: IDependencies,
  action: { payload: { token: string; dataset: { [key: string]: number[]; };
    datasetId: number; description: string; }; }) {
  try {
    const { token, dataset, datasetId, description } = action.payload;
    const response = yield call(api.saveDataset, token, dataset, datasetId, description);
    yield put(actions.saveDatasetCompleted(response.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.saveDatasetFailed(errorMsg));
  }
}

function* removeDatasetSaga({ api }: IDependencies,
  action: { payload: { token: string; datasetId: number; }; }) {
  try {
    const { token, datasetId } = action.payload;
    const response = yield call(api.removeDataset, token, datasetId);
    yield put(actions.removeDatasetCompleted(response.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.removeDatasetFailed(errorMsg));
  }
}

function* getUsersReportsSaga({ api }: IDependencies,
  action: { payload: { token: string; usersList: { userId: string; email: string; }[] }; }) {
  try {
    const { token, usersList } = action.payload;
    const response = yield call(api.getUsersReports, token, usersList);
    yield put(actions.getUsersReportsCompleted(response.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.getUsersReportsFailed(errorMsg));
  }
}

function* getUsersListSaga({ api }: IDependencies,
  action: { payload: string; }) {
  try {
    const token = action.payload;
    const response = yield call(api.getUsersList, token);
    yield put(actions.getUsersListCompleted(response.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.getUsersListFailed(errorMsg));
  }
}

export { rootSaga };
