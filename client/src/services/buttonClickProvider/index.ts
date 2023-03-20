import { IReduxEntry } from 'shared/types/app';

import * as namespace from './namespace';
import { actionCreators, selectors, reducer, getSaga } from './redux';

export { namespace, selectors, actionCreators };

export const reduxEntry: IReduxEntry = {
  reducers: { buttonClickProvider: reducer },
  sagas: [getSaga],
};
