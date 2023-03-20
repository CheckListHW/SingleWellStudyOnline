import { IReduxEntry } from 'shared/types/app';

import * as namespace from './namespace';

export { CurvesDownload } from './view/containers/CurvesDownload/CurvesDownload';
export { namespace };
export const reduxEntry: IReduxEntry = {
  reducers: {},
};
