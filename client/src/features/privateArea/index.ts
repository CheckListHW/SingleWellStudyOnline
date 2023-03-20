import { IReduxEntry } from 'shared/types/app';

import { actions, selectors, reducer, rootSaga } from './redux';
import * as namespace from './namespace';

export { PrivateArea } from './view/containers/PrivateArea/PrivateArea';
export { namespace, selectors, actions };
export const reduxEntry: IReduxEntry = {
  reducers: { privateArea: reducer },
  sagas: [rootSaga],
};
