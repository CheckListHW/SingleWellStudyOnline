import { IAppReduxState } from 'shared/types/app';

import * as NS from '../namespace';

function selectServiceState(state: IAppReduxState): NS.IReduxState {
  return state.notification;
}

export function selectNotification(state: IAppReduxState) {
  return selectServiceState(state).edit.notification;
}
