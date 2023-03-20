import { IAppReduxState } from 'shared/types/app';

import * as NS from '../namespace';

function selectServiceState(state: IAppReduxState): NS.IReduxState {
  return state.buttonClickProvider;
}

export function selectSaveButtonClickStatus(state: IAppReduxState): boolean {
  return selectServiceState(state).data.saveButtonClicked;
}
