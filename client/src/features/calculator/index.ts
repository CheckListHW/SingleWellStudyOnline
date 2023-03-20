import { IReduxEntry } from 'shared/types/app';

import * as namespace from './namespace';

export { Calculator } from './view/containers/Calculator/Calculator';
export { namespace };
export const reduxEntry: IReduxEntry = {
  reducers: {},
};
