import { IReduxEntry } from 'shared/types/app';

import { actions, selectors, reducer, rootSaga } from './redux';
import * as namespace from './namespace';

export { AdminPanel } from './view/containers/AdminPanel/AdminPanel';
export { namespace, selectors, actions };
export const reduxEntry: IReduxEntry = {
  reducers: { adminPanel: reducer },
  sagas: [rootSaga],
};
