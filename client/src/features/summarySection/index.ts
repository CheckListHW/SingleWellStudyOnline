import { IReduxEntry } from 'shared/types/app';

import * as namespace from './namespace';

export { SummarySection } from './view/containers/SummarySection/SummarySection';
export { namespace };
export const reduxEntry: IReduxEntry = {
  reducers: {},
};
