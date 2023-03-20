import { TRACE_ITEMS } from 'shared/constants';

import * as NS from '../namespace';

export const initial: NS.IReduxState = {
  data: {
    serverMessage: '',
    messageStatus: 400,
    token: '',
    id: '',
    name: '',
    surname: '',
    speciality: '',
    course: '',
    experience: 0,
    expectations: '',
    email: '',
    traceData: TRACE_ITEMS.map(item => ({ id: item.id, text: '' })),
    appPosition: 0,
    researchData: {},
    calculatedCurves: {},
    calculatedCurvesForTabs: {},
    basicParameters: [],
    featuresStates: TRACE_ITEMS.reduce((acc, item) => ({ ...acc, [String(item.id)]: {} }), {}),
    passedPoints: [],
    time: '',
    verticalScale: 1,
    coreData: [],
    curvesExpressions: {},
    isSavingStateProcess: false,
    currentTabStateForSave: {},
    isDownloadingResearchData: false,
    isDownloadingCalculatedCurves: false,
    isDownloadingCalculatedCurvesForTabs: false,
    isDownloadingFeaturesStates: false,
    isDownloadingCoreData: false,
  },
};
