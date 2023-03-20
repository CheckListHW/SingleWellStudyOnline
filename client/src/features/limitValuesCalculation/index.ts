import { IReduxEntry } from 'shared/types/app';

import * as namespace from './namespace';

export { LimitValuesCalculation } from './view/containers/LimitValuesCalculation/LimitValuesCalculation';
export { namespace };
export const reduxEntry: IReduxEntry = {
  reducers: {},
};
