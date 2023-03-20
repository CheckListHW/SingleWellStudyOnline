/* eslint-disable no-console */

import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import html2canvas from 'html2canvas';

import { IDependencies } from 'shared/types/app';
import { ITraceItem, ICurves, IBasicParameter, ICoreData } from 'shared/types/models';
import { getErrorMsg } from 'shared/helpers';

import * as actions from '../actions';
import * as NS from '../../namespace';

const getAllUserDataType: NS.IGetAllUserData['type'] = 'APP:GET_ALL_USER_DATA';
const getTraceDataType: NS.IGetTraceData['type'] = 'APP:GET_TRACE_DATA';
const saveTraceDataType: NS.ISaveTraceData['type'] = 'APP:SAVE_TRACE_DATA';
const getAppPositionType: NS.IGetAppPosition['type'] = 'APP:GET_APP_POSITION';
const saveAppPositionType: NS.ISaveAppPosition['type'] = 'APP:SAVE_APP_POSITION';
const saveTabStateType: NS.ISaveTabState['type'] = 'APP:SAVE_TAB_STATE';
const getTabsStatesType: NS.IGetTabsStates['type'] = 'APP:GET_TABS_STATES';
const saveCalculatedCurvesType: NS.ISaveCalculatedCurvesData['type'] = 'APP:SAVE_CALCULATED_CURVES_DATA';
const getCalculatedCurvesType: NS.IGetCalculatedCurvesData['type'] = 'APP:GET_CALCULATED_CURVES_DATA';
const saveCalculatedCurvesForTabsType: NS.ISaveCalculatedCurvesForTabData['type'] = 'APP:SAVE_CALCULATED_CURVES_FOR_TAB_DATA';
const getCalculatedCurvesForTabsType: NS.IGetCalculatedCurvesForTabsData['type'] = 'APP:GET_CALCULATED_CURVES_FOR_TABS_DATA';
const saveBasicParametersType: NS.ISaveBasicParameters['type'] = 'APP:SAVE_BASIC_PARAMETERS';
const getBasicParametersType: NS.IGetBasicParameters['type'] = 'APP:GET_BASIC_PARAMETERS';
const savePassedPointsType: NS.ISavePassedPoints['type'] = 'APP:SAVE_PASSED_POINTS';
const getPassedPointsType: NS.IGetPassedPoints['type'] = 'APP:GET_PASSED_POINTS';
const setTokenAndTimeToLocalStorageType: NS.ISetTokenAndTimeToLocalStorage['type'] = 'APP:SET_TOKEN_AND_TIME_TO_LOCAL_STORAGE';
const getTokenAndTimeFromLocalStorageType: NS.IGetTokenAndTimeFromLocalStorage['type'] = 'APP:GET_TOKEN_AND_TIME_FROM_LOCAL_STORAGE';
const clearLocalStorageType: NS.IClearLocalStorage['type'] = 'APP:CLEAR_LOCAL_STORAGE';
const saveCoreDataType: NS.ISaveCoreData['type'] = 'APP:SAVE_CORE_DATA';
const getCoreDataType: NS.IGetCoreData['type'] = 'APP:GET_CORE_DATA';
const saveCurvesExpressionsType: NS.ISaveCurvesExpressions['type'] = 'APP:SAVE_CURVES_EXPRESSIONS';
const getCurvesExpressionsType: NS.IGetCurvesExpressions['type'] = 'APP:GET_CURVES_EXPRESSIONS';
const getResearchDataType: NS.IGetResearchData['type'] = 'APP:GET_RESEARCH_DATA';
const getAndSaveScreenshotType: NS.IGetAndSaveScreenshot['type'] = 'APP:GET_AND_SAVE_SCREENSHOT';
const saveRouteTimePointType: NS.ISaveRouteTimePoint['type'] = 'APP:SAVE_ROUTE_TIME_POINT';

function rootSaga(deps: IDependencies) {
  return function* saga(): SagaIterator {
    yield takeLatest(getAllUserDataType, getAllUserDataSaga, deps);
    yield takeLatest(getTraceDataType, getTraceDataSaga, deps);
    yield takeLatest(saveTraceDataType, saveTraceDataSaga, deps);
    yield takeLatest(getAppPositionType, getAppPositionSaga, deps);
    yield takeLatest(saveAppPositionType, saveAppPositionSaga, deps);
    yield takeLatest(saveTabStateType, saveTabStateSaga, deps);
    yield takeLatest(getTabsStatesType, getTabsStatesSaga, deps);
    yield takeLatest(saveCalculatedCurvesType, saveCalculatedCurvesSaga, deps);
    yield takeLatest(getCalculatedCurvesType, getCalculatedCurvesSaga, deps);
    yield takeLatest(saveCalculatedCurvesForTabsType, saveCalculatedCurvesForTabsSaga, deps);
    yield takeLatest(getCalculatedCurvesForTabsType, getCalculatedCurvesForTabsSaga, deps);
    yield takeLatest(saveBasicParametersType, saveBasicParametersSaga, deps);
    yield takeLatest(getBasicParametersType, getBasicParametersSaga, deps);
    yield takeLatest(savePassedPointsType, savePassedPointsSaga, deps);
    yield takeLatest(getPassedPointsType, getPassedPointsSaga, deps);
    yield takeLatest(setTokenAndTimeToLocalStorageType, setTokenAndTimeToLocalStorageSaga, deps);
    yield takeLatest(getTokenAndTimeFromLocalStorageType,
      getTokenAndTimeFromLocalStorageSaga, deps);
    yield takeLatest(clearLocalStorageType, clearLocalStorageSaga, deps);
    yield takeLatest(saveCoreDataType, saveCoreDataSaga, deps);
    yield takeLatest(getCoreDataType, getCoreDataSaga, deps);
    yield takeLatest(saveCurvesExpressionsType, saveCurvesExpressionsSaga, deps);
    yield takeLatest(getCurvesExpressionsType, getCurvesExpressionsSaga, deps);
    yield takeLatest(getResearchDataType, getResearchDataSaga, deps);
    yield takeLatest(getAndSaveScreenshotType, getAndSaveScreenshotSaga, deps);
    yield takeLatest(saveRouteTimePointType, saveRouteTimePointSaga, deps);
  };
}

function* getAllUserDataSaga({ api }: IDependencies, action: { payload: string }) {
  try {
    const token = action.payload;
    const userData = yield call(api.getAllUserData, token);
    yield put(actions.getAllUserDataCompleted(userData.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.getAllUserDataFailed(errorMsg));
  }
}

function* setTokenAndTimeToLocalStorageSaga(_apiObject: IDependencies,
  action: { payload: { time: string; token: string; } }) {
  try {
    const { token, time } = action.payload;
    yield sessionStorage.setItem('token', token);
    yield sessionStorage.setItem('time', time);
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    console.log(errorMsg);
  }
}

function* getTokenAndTimeFromLocalStorageSaga() {
  try {
    const token = yield sessionStorage.getItem('token');
    const time = yield sessionStorage.getItem('time');
    yield put(actions.getTokenAndTimeFromLocalStorageCompleted(
      { token: token !== null ? token : '', time: time !== null ? time : '' },
    ));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    console.log(errorMsg);
  }
}

function* clearLocalStorageSaga() {
  try {
    yield sessionStorage.removeItem('token');
    yield sessionStorage.removeItem('time');
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    console.log(errorMsg);
  }
}

function* getTraceDataSaga({ api }: IDependencies, action: { payload: string }) {
  try {
    const token = action.payload;
    const traceData = yield call(api.getTraceData, token);
    yield put(actions.getTraceDataCompleted(traceData.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.getTraceDataFailed(errorMsg));
  }
}

function* saveTraceDataSaga({ api }: IDependencies,
  action: { payload: { traceData: ITraceItem[], token: string } }) {
  try {
    const { traceData, token } = action.payload;
    const message = yield call(api.saveTraceData, traceData, token);
    yield put(actions.saveTraceDataCompleted(message.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.saveTraceDataFailed(errorMsg));
  }
}

function* getAppPositionSaga({ api }: IDependencies, action: { payload: string }) {
  try {
    const token = action.payload;
    const appPosition = yield call(api.getAppPosition, token);
    yield put(actions.getAppPositionCompleted(appPosition.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.getAppPositionFailed(errorMsg));
  }
}

function* saveAppPositionSaga({ api }: IDependencies,
  action: { payload: { appPosition: number, token: string } }) {
  try {
    const { appPosition, token } = action.payload;
    const message = yield call(api.saveAppPosition, appPosition, token);
    yield put(actions.saveAppPositionCompleted(message.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.saveAppPositionFailed(errorMsg));
  }
}

function* saveTabStateSaga({ api }: IDependencies,
  action: { payload: { tabState: { [key: string]: { [key: string]: any } }, token: string } }) {
  try {
    const { tabState, token } = action.payload;
    const message = yield call(api.saveTabState, tabState, token);
    yield put(actions.saveTabStateCompleted(message.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.saveTabStateFailed(errorMsg));
  }
}

function* getTabsStatesSaga({ api }: IDependencies, action: { payload: string }) {
  try {
    const token = action.payload;
    const message = yield call(api.getTabsStates, token);
    yield put(actions.getTabsStatesCompleted(message.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.getTabsStatesFailed(errorMsg));
  }
}

function* saveCalculatedCurvesSaga({ api }: IDependencies,
  action: { payload: { calculatedCurves: ICurves, token: string } }) {
  try {
    const { calculatedCurves, token } = action.payload;
    const message = yield call(api.saveCalculatedCurves, calculatedCurves, token);
    yield put(actions.saveCalculatedCurvesDataCompleted(message.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.saveCalculatedCurvesDataFailed(errorMsg));
  }
}

function* getCalculatedCurvesSaga({ api }: IDependencies, action: { payload: string }) {
  try {
    const token = action.payload;
    const message = yield call(api.getCalculatedCurves, token);
    yield put(actions.getCalculatedCurvesDataCompleted(message.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.getCalculatedCurvesDataFailed(errorMsg));
  }
}

function* saveCalculatedCurvesForTabsSaga({ api }: IDependencies,
  action: { payload: { calculatedCurvesForTabs: { [key: string]: ICurves }, token: string } }) {
  try {
    const { calculatedCurvesForTabs, token } = action.payload;
    const message = yield call(api.saveCalculatedCurvesForTabs, calculatedCurvesForTabs, token);
    yield put(actions.saveCalculatedCurvesForTabDataCompleted(message.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.saveCalculatedCurvesForTabDataFailed(errorMsg));
  }
}

function* getCalculatedCurvesForTabsSaga({ api }: IDependencies, action: { payload: string }) {
  try {
    const token = action.payload;
    const message = yield call(api.getCalculatedCurvesForTabs, token);
    yield put(actions.getCalculatedCurvesForTabDataCompleted(message.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.getCalculatedCurvesForTabDataFailed(errorMsg));
  }
}

function* saveBasicParametersSaga({ api }: IDependencies,
  action: { payload: { basicParameters: IBasicParameter[], token: string } }) {
  try {
    const { basicParameters, token } = action.payload;
    const message = yield call(api.saveBasicParameters, basicParameters, token);
    yield put(actions.saveBasicParametersCompleted(message.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.saveBasicParametersFailed(errorMsg));
  }
}

function* getBasicParametersSaga({ api }: IDependencies, action: { payload: string }) {
  try {
    const token = action.payload;
    const message = yield call(api.getBasicParameters, token);
    yield put(actions.getBasicParametersCompleted(message.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.getBasicParametersFailed(errorMsg));
  }
}

function* savePassedPointsSaga({ api }: IDependencies,
  action: { payload: { passedPoints: string[], token: string } }) {
  try {
    const { passedPoints, token } = action.payload;
    const message = yield call(api.savePassedPoints, passedPoints, token);
    yield put(actions.savePassedPointsCompleted(message.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.savePassedPointsFailed(errorMsg));
  }
}

function* getPassedPointsSaga({ api }: IDependencies, action: { payload: string }) {
  try {
    const token = action.payload;
    const message = yield call(api.getPassedPoints, token);
    yield put(actions.getPassedPointsCompleted(message.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.getPassedPointsFailed(errorMsg));
  }
}

function* saveCoreDataSaga({ api }: IDependencies,
  action: { payload: { coreData: ICoreData[], token: string } }) {
  try {
    const { coreData, token } = action.payload;
    const message = yield call(api.saveCoreData, coreData, token);
    yield put(actions.saveCoreDataCompleted(message.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.saveCoreDataFailed(errorMsg));
  }
}

function* getCoreDataSaga({ api }: IDependencies, action: { payload: string }) {
  try {
    const token = action.payload;
    const message = yield call(api.getCoreData, token);
    yield put(actions.getCoreDataCompleted(message.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.getCoreDataFailed(errorMsg));
  }
}

function* saveCurvesExpressionsSaga({ api }: IDependencies,
  action: { payload: { curvesExpressions: { [key: string]: string; }, token: string } }) {
  try {
    const { curvesExpressions, token } = action.payload;
    const message = yield call(api.saveCurvesExpressions, curvesExpressions, token);
    yield put(actions.saveCurvesExpressionsCompleted(message.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.saveCurvesExpressionsFailed(errorMsg));
  }
}

function* getCurvesExpressionsSaga({ api }: IDependencies, action: { payload: string }) {
  try {
    const token = action.payload;
    const message = yield call(api.getCurvesExpressions, token);
    yield put(actions.getCurvesExpressionsCompleted(message.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.getCurvesExpressionsFailed(errorMsg));
  }
}

function* getResearchDataSaga({ api }: IDependencies, action: { payload: string }) {
  try {
    const token = action.payload;
    const researchData = yield call(api.getResearchData, token);
    yield put(actions.getResearchDataCompleted(researchData.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.getResearchDataFailed(errorMsg));
  }
}

function* getAndSaveScreenshotSaga({ api }: IDependencies, action:
{ payload: { appPosition: string; token: string; } }) {
  try {
    const { token, appPosition } = action.payload;
    const screenshot = yield html2canvas(document.body);
    const base64ImageString = screenshot.toDataURL('image/png');
    const response = yield call(api.saveScreenshot, token, appPosition, base64ImageString);
    yield put(actions.getAndSaveScreenshotCompleted(response.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.getAndSaveScreenshotFailed(errorMsg));
  }
}

function* saveRouteTimePointSaga({ api }: IDependencies, action: { payload:
{ routeTimePoint: { tracePoint: string; time: number; }; token: string; } }) {
  try {
    const { token, routeTimePoint } = action.payload;
    const response = yield call(api.saveRouteTimePoint, token, routeTimePoint);
    yield put(actions.saveRouteTimePointCompleted(response.data));
  } catch (error) {
    const errorMsg = getErrorMsg(error);
    yield put(actions.saveRouteTimePointFailed(errorMsg));
  }
}

export { rootSaga };
