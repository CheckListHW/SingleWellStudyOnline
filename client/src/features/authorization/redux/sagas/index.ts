import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';

import { IDependencies } from 'shared/types/app';
import { getErrorMsg } from 'shared/helpers';

import * as actions from '../actions';
import * as NS from '../../namespace';

const loginType: NS.ILoginUser['type'] = 'AUTHORIZATION:LOGIN_USER';


function rootSaga(deps: IDependencies) {
  return function* saga(): SagaIterator {
    yield takeLatest(loginType, loginSaga, deps);
  };
}

function* loginSaga({ api }: IDependencies,
  action: { payload: { email: string, password: string } }) {
  try {
    const { email, password } = action.payload;

    const user = yield call(api.loginUser, email, password);
    yield put(actions.loginUserCompleted(user.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.loginUserFailed(errorMsg));
  }
}

export { rootSaga };
