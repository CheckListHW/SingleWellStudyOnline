import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';

import { IDependencies } from 'shared/types/app';
import { IPersonalData } from 'shared/types/models';
import { getErrorMsg } from 'shared/helpers';

import * as actions from '../actions';
import * as NS from '../../namespace';


const savePesonalDataType: NS.ISavePersonalData['type'] = 'PRIVATE_AREA:SAVE_PERSONAL_DATA';

function rootSaga(deps: IDependencies) {
  return function* saga(): SagaIterator {
    yield takeLatest(savePesonalDataType, savePersonalDataSaga, deps);
  };
}

function* savePersonalDataSaga({ api }: IDependencies,
  action: { payload: IPersonalData & { token: string } }) {
  try {
    const data = action.payload;
    const user = yield call(api.savePersonalData, data);
    yield put(actions.savePersonalDataCompleted(user.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.savePersonalDataFailed(errorMsg));
  }
}

export { rootSaga };
