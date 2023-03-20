import { takeLatest, put, call, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { IDependencies } from 'shared/types/app';

import * as actionCreators from './actionCreators';
import * as NS from '../namespace';

export function getSaga(deps: IDependencies) {
  const setNotificationType: NS.ISetNotification['type'] = 'NOTIFICATION:SET_NOTIFICATION';

  function* saga() {
    yield all([
      takeLatest(setNotificationType, executeSetNotificationSaga, deps),
    ]);
  }

  return saga;
}

export function* executeSetNotificationSaga(_apiObject: IDependencies,
  action: { payload: { duration?: number } }) {
  const { duration } = action.payload;
  yield call(delay, duration ? duration * 1000 : 10000);
  yield put(actionCreators.removeNotification());
}
