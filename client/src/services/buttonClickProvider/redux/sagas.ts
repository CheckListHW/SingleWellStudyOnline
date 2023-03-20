import { takeLatest, put, call, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { IDependencies } from 'shared/types/app';

import * as actionCreators from './actionCreators';
import * as NS from '../namespace';

export function getSaga(deps: IDependencies) {
  const setSaveButtonClickEventType: NS.ISetSaveButtonClickEvent['type'] = 'BUTTON_CLICK_PROVIDER:SET_SAVE_BUTTON_CLICK_EVENT';

  function* saga() {
    yield all([
      takeLatest(setSaveButtonClickEventType, setSaveButtonClickEventSaga, deps),
    ]);
  }

  return saga;
}

export function* setSaveButtonClickEventSaga() {
  yield call(delay, 500);
  yield put(actionCreators.removeSaveButtonClickEvent());
}
