/* eslint-disable max-len */
import { makeCommunicationActionCreators } from 'redux-make-communication';

import * as NS from '../../namespace';

export const { execute: loginUser, completed: loginUserCompleted, failed: loginUserFailed } = makeCommunicationActionCreators<NS.ILoginUser, NS.ILoginUserCompleted, NS.ILoginUserFailed>(
  'AUTHORIZATION:LOGIN_USER',
  'AUTHORIZATION:LOGIN_USER_COMPLETED',
  'AUTHORIZATION:LOGIN_USER_FAILED',
);
