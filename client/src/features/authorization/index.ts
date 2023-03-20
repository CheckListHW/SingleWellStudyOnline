import { IReduxEntry } from 'shared/types/app';

import { actions, selectors, reducer, rootSaga } from './redux';
import * as namespace from './namespace';

export { Authorization } from './view/containers/Authorization/Authorization';
export { namespace, selectors, actions };
export const reduxEntry: IReduxEntry = {
  reducers: { authorization: reducer },
  sagas: [rootSaga],
};
