/* eslint-disable max-len */
import { makeCommunicationActionCreators } from 'redux-make-communication';

import * as NS from '../../namespace';

export const { execute: savePersonalData, completed: savePersonalDataCompleted, failed: savePersonalDataFailed } = makeCommunicationActionCreators<NS.ISavePersonalData, NS.ISavePersonalDataCompleted, NS.ISavePersonalDataFailed>(
  'PRIVATE_AREA:SAVE_PERSONAL_DATA',
  'PRIVATE_AREA:SAVE_PERSONAL_DATA_COMPLETED',
  'PRIVATE_AREA:SAVE_PERSONAL_DATA_FAILED',
);
