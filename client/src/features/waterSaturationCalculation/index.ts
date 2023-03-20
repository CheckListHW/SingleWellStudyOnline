import { IReduxEntry } from 'shared/types/app';

import * as namespace from './namespace';

export { WaterSaturationCalculation } from './view/containers/WaterSaturationCalculation/WaterSaturationCalculation';
export { namespace };
export const reduxEntry: IReduxEntry = {
  reducers: {},
};
