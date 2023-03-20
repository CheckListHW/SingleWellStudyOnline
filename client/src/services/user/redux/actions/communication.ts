/* eslint-disable max-len */
import { makeCommunicationActionCreators } from 'redux-make-communication';

import * as NS from '../../namespace';

export const { execute: getAllUserData, completed: getAllUserDataCompleted, failed: getAllUserDataFailed } = makeCommunicationActionCreators<NS.IGetAllUserData, NS.IGetAllUserDataCompleted, NS.IGetAllUserDataFailed>(
  'APP:GET_ALL_USER_DATA',
  'APP:GET_ALL_USER_DATA_COMPLETED',
  'APP:GET_ALL_USER_DATA_FAILED',
);

export const { execute: getTraceData, completed: getTraceDataCompleted, failed: getTraceDataFailed } = makeCommunicationActionCreators<NS.IGetTraceData, NS.IGetTraceDataCompleted, NS.IGetTraceDataFailed>(
  'APP:GET_TRACE_DATA',
  'APP:GET_TRACE_DATA_COMPLETED',
  'APP:GET_TRACE_DATA_FAILED',
);

export const { execute: saveTraceData, completed: saveTraceDataCompleted, failed: saveTraceDataFailed } = makeCommunicationActionCreators<NS.ISaveTraceData, NS.ISaveTraceDataCompleted, NS.ISaveTraceDataFailed>(
  'APP:SAVE_TRACE_DATA',
  'APP:SAVE_TRACE_DATA_COMPLETED',
  'APP:SAVE_TRACE_DATA_FAILED',
);

export const { execute: getAppPosition, completed: getAppPositionCompleted, failed: getAppPositionFailed } = makeCommunicationActionCreators<NS.IGetAppPosition, NS.IGetAppPositionCompleted, NS.IGetAppPositionFailed>(
  'APP:GET_APP_POSITION',
  'APP:GET_APP_POSITION_COMPLETED',
  'APP:GET_APP_POSITION_FAILED',
);

export const { execute: saveAppPosition, completed: saveAppPositionCompleted, failed: saveAppPositionFailed } = makeCommunicationActionCreators<NS.ISaveAppPosition, NS.ISaveAppPositionCompleted, NS.ISaveAppPositionFailed>(
  'APP:SAVE_APP_POSITION',
  'APP:SAVE_APP_POSITION_COMPLETED',
  'APP:SAVE_APP_POSITION_FAILED',
);

export const { execute: saveTabState, completed: saveTabStateCompleted, failed: saveTabStateFailed } = makeCommunicationActionCreators<NS.ISaveTabState, NS.ISaveTabStateCompleted, NS.ISaveTabStateFailed>(
  'APP:SAVE_TAB_STATE',
  'APP:SAVE_TAB_STATE_COMPLETED',
  'APP:SAVE_TAB_STATE_FAILED',
);

export const { execute: getTabsStates, completed: getTabsStatesCompleted, failed: getTabsStatesFailed } = makeCommunicationActionCreators<NS.IGetTabsStates, NS.IGetTabsStatesCompleted, NS.IGetTabsStatesFailed>(
  'APP:GET_TABS_STATES',
  'APP:GET_TABS_STATES_COMPLETED',
  'APP:GET_TABS_STATES_FAILED',
);

export const { execute: saveCalculatedCurvesData, completed: saveCalculatedCurvesDataCompleted, failed: saveCalculatedCurvesDataFailed } = makeCommunicationActionCreators<NS.ISaveCalculatedCurvesData, NS.ISaveCalculatedCurvesDataCompleted, NS.ISaveCalculatedCurvesDataFailed>(
  'APP:SAVE_CALCULATED_CURVES_DATA',
  'APP:SAVE_CALCULATED_CURVES_DATA_COMPLETED',
  'APP:SAVE_CALCULATED_CURVES_DATA_FAILED',
);

export const { execute: getCalculatedCurvesData, completed: getCalculatedCurvesDataCompleted, failed: getCalculatedCurvesDataFailed } = makeCommunicationActionCreators<NS.IGetCalculatedCurvesData, NS.IGetCalculatedCurvesDataCompleted, NS.IGetCalculatedCurvesDataFailed>(
  'APP:GET_CALCULATED_CURVES_DATA',
  'APP:GET_CALCULATED_CURVES_DATA_COMPLETED',
  'APP:GET_CALCULATED_CURVES_DATA_FAILED',
);

export const { execute: saveCalculatedCurvesForTabData, completed: saveCalculatedCurvesForTabDataCompleted, failed: saveCalculatedCurvesForTabDataFailed } = makeCommunicationActionCreators<NS.ISaveCalculatedCurvesForTabData, NS.ISaveCalculatedCurvesForTabDataCompleted, NS.ISaveCalculatedCurvesForTabDataFailed>(
  'APP:SAVE_CALCULATED_CURVES_FOR_TAB_DATA',
  'APP:SAVE_CALCULATED_CURVES_FOR_TAB_DATA_COMPLETED',
  'APP:SAVE_CALCULATED_CURVES_FOR_TAB_DATA_FAILED',
);

export const { execute: getCalculatedCurvesForTabData, completed: getCalculatedCurvesForTabDataCompleted, failed: getCalculatedCurvesForTabDataFailed } = makeCommunicationActionCreators<NS.IGetCalculatedCurvesForTabsData, NS.IGetCalculatedCurvesForTabsDataCompleted, NS.IGetCalculatedCurvesForTabsDataFailed>(
  'APP:GET_CALCULATED_CURVES_FOR_TABS_DATA',
  'APP:GET_CALCULATED_CURVES_FOR_TABS_DATA_COMPLETED',
  'APP:GET_CALCULATED_CURVES_FOR_TABS_DATA_FAILED',
);

export const { execute: saveBasicParameters, completed: saveBasicParametersCompleted, failed: saveBasicParametersFailed } = makeCommunicationActionCreators<NS.ISaveBasicParameters, NS.ISaveBasicParametersCompleted, NS.ISaveBasicParametersFailed>(
  'APP:SAVE_BASIC_PARAMETERS',
  'APP:SAVE_BASIC_PARAMETERS_COMPLETED',
  'APP:SAVE_BASIC_PARAMETERS_FAILED',
);

export const { execute: getBasicParameters, completed: getBasicParametersCompleted, failed: getBasicParametersFailed } = makeCommunicationActionCreators<NS.IGetBasicParameters, NS.IGetBasicParametersCompleted, NS.IGetBasicParametersFailed>(
  'APP:GET_BASIC_PARAMETERS',
  'APP:GET_BASIC_PARAMETERS_COMPLETED',
  'APP:GET_BASIC_PARAMETERS_FAILED',
);

export const { execute: savePassedPoints, completed: savePassedPointsCompleted, failed: savePassedPointsFailed } = makeCommunicationActionCreators<NS.ISavePassedPoints, NS.ISavePassedPointsCompleted, NS.ISavePassedPointsFailed>(
  'APP:SAVE_PASSED_POINTS',
  'APP:SAVE_PASSED_POINTS_COMPLETED',
  'APP:SAVE_PASSED_POINTS_FAILED',
);

export const { execute: getPassedPoints, completed: getPassedPointsCompleted, failed: getPassedPointsFailed } = makeCommunicationActionCreators<NS.IGetPassedPoints, NS.IGetPassedPointsCompleted, NS.IGetPassedPointsFailed>(
  'APP:GET_PASSED_POINTS',
  'APP:GET_PASSED_POINTS_COMPLETED',
  'APP:GET_PASSED_POINTS_FAILED',
);

export const { execute: saveCoreData, completed: saveCoreDataCompleted, failed: saveCoreDataFailed } = makeCommunicationActionCreators<NS.ISaveCoreData, NS.ISaveCoreDataCompleted, NS.ISaveCoreDataFailed>(
  'APP:SAVE_CORE_DATA',
  'APP:SAVE_CORE_DATA_COMPLETED',
  'APP:SAVE_CORE_DATA_FAILED',
);

export const { execute: getCoreData, completed: getCoreDataCompleted, failed: getCoreDataFailed } = makeCommunicationActionCreators<NS.IGetCoreData, NS.IGetCoreDataCompleted, NS.IGetCoreDataFailed>(
  'APP:GET_CORE_DATA',
  'APP:GET_CORE_DATA_COMPLETED',
  'APP:GET_CORE_DATA_FAILED',
);

export const { execute: saveCurvesExpressions, completed: saveCurvesExpressionsCompleted, failed: saveCurvesExpressionsFailed } = makeCommunicationActionCreators<NS.ISaveCurvesExpressions, NS.ISaveCurvesExpressionsCompleted, NS.ISaveCurvesExpressionsFailed>(
  'APP:SAVE_CURVES_EXPRESSIONS',
  'APP:SAVE_CURVES_EXPRESSIONS_COMPLETED',
  'APP:SAVE_CURVES_EXPRESSIONS_FAILED',
);

export const { execute: getCurvesExpressions, completed: getCurvesExpressionsCompleted, failed: getCurvesExpressionsFailed } = makeCommunicationActionCreators<NS.IGetCurvesExpressions, NS.IGetCurvesExpressionsCompleted, NS.IGetCurvesExpressionsFailed>(
  'APP:GET_CURVES_EXPRESSIONS',
  'APP:GET_CURVES_EXPRESSIONS_COMPLETED',
  'APP:GET_CURVES_EXPRESSIONS_FAILED',
);

export const { execute: getResearchData, completed: getResearchDataCompleted, failed: getResearchDataFailed } = makeCommunicationActionCreators<NS.IGetResearchData, NS.IGetResearchDataCompleted, NS.IGetResearchDataFailed>(
  'APP:GET_RESEARCH_DATA',
  'APP:GET_RESEARCH_DATA_COMPLETED',
  'APP:GET_RESEARCH_DATA_FAILED',
);

export const { execute: getAndSaveScreenshot, completed: getAndSaveScreenshotCompleted, failed: getAndSaveScreenshotFailed } = makeCommunicationActionCreators<NS.IGetAndSaveScreenshot, NS.IGetAndSaveScreenshotCompleted, NS.IGetAndSaveScreenshotFailed>(
  'APP:GET_AND_SAVE_SCREENSHOT',
  'APP:GET_AND_SAVE_SCREENSHOT_COMPLETED',
  'APP:GET_AND_SAVE_SCREENSHOT_FAILED',
);

export const { execute: saveRouteTimePoint, completed: saveRouteTimePointCompleted, failed: saveRouteTimePointFailed } = makeCommunicationActionCreators<NS.ISaveRouteTimePoint, NS.ISaveRouteTimePointCompleted, NS.ISaveRouteTimePointFailed>(
  'APP:SAVE_ROUTE_TIME_POINT',
  'APP:SAVE_ROUTE_TIME_POINT_COMPLETED',
  'APP:SAVE_ROUTE_TIME_POINT_FAILED',
);
