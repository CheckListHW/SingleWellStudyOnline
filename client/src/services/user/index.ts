import { IReduxEntry } from 'shared/types/app';

import { actions, selectors, reducer, rootSaga, initial } from './redux';
import * as namespace from './namespace';

export { namespace, selectors, actions, initial };

export const reduxEntry: IReduxEntry = {
  reducers: { user: reducer },
  sagas: [rootSaga],
};
