import { IAction, IPlainAction, IPlainFailAction } from 'shared/types/redux';
import { UserData, ITraceItem, IBasicParameter, ICurves, ICoreData, IAllUserAndAppData } from 'shared/types/models';

export interface IReduxState {
  data: UserData & {
    serverMessage: string;
    messageStatus: number;
    time: string;
    verticalScale: number;
    isSavingStateProcess: boolean;
    currentTabStateForSave: { [key: string]: any };
    traceData: ITraceItem[];
    appPosition: number;
    researchData: ICurves;
    calculatedCurves: ICurves;
    calculatedCurvesForTabs: { [key: string]: ICurves };
    basicParameters: IBasicParameter[];
    featuresStates: { [key: string]: { [key: string]: any }};
    passedPoints: string[];
    coreData: ICoreData[];
    curvesExpressions: { [key: string]: string };
    isDownloadingResearchData: boolean;
    isDownloadingCalculatedCurves: boolean;
    isDownloadingCalculatedCurvesForTabs: boolean;
    isDownloadingFeaturesStates: boolean;
    isDownloadingCoreData: boolean;
  }
}


export { UserData, ITraceItem, IAllUserAndAppData };

export type ISetUserData = IAction<'APP:SET_USER_DATA', UserData>;
export type IDeleteUserData = IPlainAction<'APP:DELETE_USER_DATA'>;
export type ISetAllUserAndAppData = IAction<'APP:SET_ALL_USER_AND_APP_DATA', IAllUserAndAppData>;

export type IIncreaseVerticalScale = IAction<'APP:INCREASE_VERTICAL_SCALE', number>;
export type IDecreaseVerticalScale = IAction<'APP:DECREASE_VERTICAL_SCALE', number>;

export type IGetAllUserData = IAction<'APP:GET_ALL_USER_DATA', string>;
export type IGetAllUserDataCompleted = IAction<'APP:GET_ALL_USER_DATA_COMPLETED', UserData>;
export type IGetAllUserDataFailed = IPlainFailAction<'APP:GET_ALL_USER_DATA_FAILED'>;

export type ISetTokenAndTimeToLocalStorage = IAction<'APP:SET_TOKEN_AND_TIME_TO_LOCAL_STORAGE', { token: string; time: string; }>;
export type IGetTokenAndTimeFromLocalStorage = IPlainAction<'APP:GET_TOKEN_AND_TIME_FROM_LOCAL_STORAGE'>;
export type IGetTokenAndTimeFromLocalStorageCompleted = IAction<'APP:GET_TOKEN_AND_TIME_FROM_LOCAL_STORAGE_COMPLETED', { token: string; time: string; }>;
export type IClearLocalStorage = IPlainAction<'APP:CLEAR_LOCAL_STORAGE'>;

export type IGetTraceData = IAction<'APP:GET_TRACE_DATA', string>;
export type IGetTraceDataCompleted = IAction<'APP:GET_TRACE_DATA_COMPLETED', { traceData: ITraceItem[]; }>;
export type IGetTraceDataFailed = IPlainFailAction<'APP:GET_TRACE_DATA_FAILED'>;

export type ISaveTraceData = IAction<'APP:SAVE_TRACE_DATA', { traceData: ITraceItem[]; token: string; }>;
export type ISaveTraceDataCompleted = IAction<'APP:SAVE_TRACE_DATA_COMPLETED', { message: string; }>;
export type ISaveTraceDataFailed = IPlainFailAction<'APP:SAVE_TRACE_DATA_FAILED'>;

export type IGetAppPosition = IAction<'APP:GET_APP_POSITION', string>;
export type IGetAppPositionCompleted = IAction<'APP:GET_APP_POSITION_COMPLETED', { appPosition: number; }>;
export type IGetAppPositionFailed = IPlainFailAction<'APP:GET_APP_POSITION_FAILED'>;

export type ISaveAppPosition = IAction<'APP:SAVE_APP_POSITION', { appPosition: number; token: string; }>;
export type ISaveAppPositionCompleted = IAction<'APP:SAVE_APP_POSITION_COMPLETED', { message: string; }>;
export type ISaveAppPositionFailed = IPlainFailAction<'APP:SAVE_APP_POSITION_FAILED'>;

export type ISaveTabState = IAction<'APP:SAVE_TAB_STATE', { tabState: { [key: string]: { [key: string]: any }; }; token: string; }>;
export type ISaveTabStateCompleted = IAction<'APP:SAVE_TAB_STATE_COMPLETED', { message: string; }>;
export type ISaveTabStateFailed = IPlainFailAction<'APP:SAVE_TAB_STATE_FAILED'>;

export type IGetTabsStates = IAction<'APP:GET_TABS_STATES', string>;
export type IGetTabsStatesCompleted = IAction<'APP:GET_TABS_STATES_COMPLETED', { tabStates: string; }>;
export type IGetTabsStatesFailed = IPlainFailAction<'APP:GET_TABS_STATES_FAILED'>;

export type ISaveCalculatedCurvesData = IAction<'APP:SAVE_CALCULATED_CURVES_DATA', { calculatedCurves: ICurves; token: string; }>;
export type ISaveCalculatedCurvesDataCompleted = IAction<'APP:SAVE_CALCULATED_CURVES_DATA_COMPLETED', { message: string; }>;
export type ISaveCalculatedCurvesDataFailed = IPlainFailAction<'APP:SAVE_CALCULATED_CURVES_DATA_FAILED'>;

export type IGetCalculatedCurvesData = IAction<'APP:GET_CALCULATED_CURVES_DATA', string>;
export type IGetCalculatedCurvesDataCompleted = IAction<'APP:GET_CALCULATED_CURVES_DATA_COMPLETED', { calculatedCurves: string; }>;
export type IGetCalculatedCurvesDataFailed = IPlainFailAction<'APP:GET_CALCULATED_CURVES_DATA_FAILED'>;

export type ISaveCalculatedCurvesForTabData = IAction<'APP:SAVE_CALCULATED_CURVES_FOR_TAB_DATA', { calculatedCurvesForTabs: { [key: string]: ICurves; }; token: string; }>;
export type ISaveCalculatedCurvesForTabDataCompleted = IAction<'APP:SAVE_CALCULATED_CURVES_FOR_TAB_DATA_COMPLETED', { message: string; }>;
export type ISaveCalculatedCurvesForTabDataFailed = IPlainFailAction<'APP:SAVE_CALCULATED_CURVES_FOR_TAB_DATA_FAILED'>;

export type IGetCalculatedCurvesForTabsData = IAction<'APP:GET_CALCULATED_CURVES_FOR_TABS_DATA', string>;
export type IGetCalculatedCurvesForTabsDataCompleted = IAction<'APP:GET_CALCULATED_CURVES_FOR_TABS_DATA_COMPLETED', { calculatedCurvesForTabs: string; }>;
export type IGetCalculatedCurvesForTabsDataFailed = IPlainFailAction<'APP:GET_CALCULATED_CURVES_FOR_TABS_DATA_FAILED'>;

export type ISaveBasicParameters = IAction<'APP:SAVE_BASIC_PARAMETERS', { basicParameters: IBasicParameter[]; token: string; }>;
export type ISaveBasicParametersCompleted = IAction<'APP:SAVE_BASIC_PARAMETERS_COMPLETED', { message: string; }>;
export type ISaveBasicParametersFailed = IPlainFailAction<'APP:SAVE_BASIC_PARAMETERS_FAILED'>;

export type IGetBasicParameters = IAction<'APP:GET_BASIC_PARAMETERS', string>;
export type IGetBasicParametersCompleted = IAction<'APP:GET_BASIC_PARAMETERS_COMPLETED', { basicParameters: IBasicParameter[]; }>;
export type IGetBasicParametersFailed = IPlainFailAction<'APP:GET_BASIC_PARAMETERS_FAILED'>;

export type ISavePassedPoints = IAction<'APP:SAVE_PASSED_POINTS', { passedPoints: string[]; token: string; }>;
export type ISavePassedPointsCompleted = IAction<'APP:SAVE_PASSED_POINTS_COMPLETED', { message: string; }>;
export type ISavePassedPointsFailed = IPlainFailAction<'APP:SAVE_PASSED_POINTS_FAILED'>;

export type IGetPassedPoints = IAction<'APP:GET_PASSED_POINTS', string>;
export type IGetPassedPointsCompleted = IAction<'APP:GET_PASSED_POINTS_COMPLETED', { passedPoints: string[]; }>;
export type IGetPassedPointsFailed = IPlainFailAction<'APP:GET_PASSED_POINTS_FAILED'>;

export type ISaveCoreData = IAction<'APP:SAVE_CORE_DATA', { coreData: ICoreData[]; token: string; }>;
export type ISaveCoreDataCompleted = IAction<'APP:SAVE_CORE_DATA_COMPLETED', { message: string; }>;
export type ISaveCoreDataFailed = IPlainFailAction<'APP:SAVE_CORE_DATA_FAILED'>;

export type IGetCoreData = IAction<'APP:GET_CORE_DATA', string>;
export type IGetCoreDataCompleted = IAction<'APP:GET_CORE_DATA_COMPLETED', { coreData: ICoreData[]; }>;
export type IGetCoreDataFailed = IPlainFailAction<'APP:GET_CORE_DATA_FAILED'>;

export type ISaveCurvesExpressions = IAction<'APP:SAVE_CURVES_EXPRESSIONS', { curvesExpressions: { [key: string]: string }; token: string; }>;
export type ISaveCurvesExpressionsCompleted = IAction<'APP:SAVE_CURVES_EXPRESSIONS_COMPLETED', { message: string; }>;
export type ISaveCurvesExpressionsFailed = IPlainFailAction<'APP:SAVE_CURVES_EXPRESSIONS_FAILED'>;

export type IGetCurvesExpressions = IAction<'APP:GET_CURVES_EXPRESSIONS', string>;
export type IGetCurvesExpressionsCompleted = IAction<'APP:GET_CURVES_EXPRESSIONS_COMPLETED', { curvesExpressions: { [key: string]: string }; }>;
export type IGetCurvesExpressionsFailed = IPlainFailAction<'APP:GET_CURVES_EXPRESSIONS_FAILED'>;

export type IGetResearchData = IAction<'APP:GET_RESEARCH_DATA', string>;
export type IGetResearchDataCompleted = IAction<'APP:GET_RESEARCH_DATA_COMPLETED', { researchData: ICurves; }>;
export type IGetResearchDataFailed = IPlainFailAction<'APP:GET_RESEARCH_DATA_FAILED'>;

export type IGetAndSaveScreenshot = IAction<'APP:GET_AND_SAVE_SCREENSHOT', { appPosition: string; token: string; }>;
export type IGetAndSaveScreenshotCompleted = IAction<'APP:GET_AND_SAVE_SCREENSHOT_COMPLETED', { message: string; }>;
export type IGetAndSaveScreenshotFailed = IPlainFailAction<'APP:GET_AND_SAVE_SCREENSHOT_FAILED'>;

export type ISaveRouteTimePoint = IAction<'APP:SAVE_ROUTE_TIME_POINT', { routeTimePoint: { tracePoint: string; time: number; }; token: string; }>;
export type ISaveRouteTimePointCompleted = IAction<'APP:SAVE_ROUTE_TIME_POINT_COMPLETED', { message: string; }>;
export type ISaveRouteTimePointFailed = IPlainFailAction<'APP:SAVE_ROUTE_TIME_POINT_FAILED'>;

export type Action = ISetUserData
| IDeleteUserData
| ISetAllUserAndAppData
| IGetTraceData
| IGetTraceDataCompleted
| IGetTraceDataFailed
| ISaveTraceData
| ISaveTraceDataCompleted
| ISaveTraceDataFailed
| IGetAppPosition
| IGetAppPositionCompleted
| IGetAppPositionFailed
| ISaveAppPosition
| ISaveAppPositionCompleted
| ISaveAppPositionFailed
| ISaveTabState
| ISaveTabStateCompleted
| ISaveTabStateFailed
| IGetTabsStates
| IGetTabsStatesCompleted
| IGetTabsStatesFailed
| ISaveCalculatedCurvesData
| ISaveCalculatedCurvesDataCompleted
| ISaveCalculatedCurvesDataFailed
| IGetCalculatedCurvesData
| IGetCalculatedCurvesDataCompleted
| IGetCalculatedCurvesDataFailed
| ISaveCalculatedCurvesForTabData
| ISaveCalculatedCurvesForTabDataCompleted
| ISaveCalculatedCurvesForTabDataFailed
| IGetCalculatedCurvesForTabsData
| IGetCalculatedCurvesForTabsDataCompleted
| IGetCalculatedCurvesForTabsDataFailed
| ISaveBasicParameters
| ISaveBasicParametersCompleted
| ISaveBasicParametersFailed
| IGetBasicParameters
| IGetBasicParametersCompleted
| IGetBasicParametersFailed
| ISavePassedPoints
| ISavePassedPointsCompleted
| ISavePassedPointsFailed
| IGetPassedPoints
| IGetPassedPointsCompleted
| IGetPassedPointsFailed
| ISetTokenAndTimeToLocalStorage
| IGetTokenAndTimeFromLocalStorage
| IGetTokenAndTimeFromLocalStorageCompleted
| IClearLocalStorage
| IGetAllUserData
| IGetAllUserDataCompleted
| IGetAllUserDataFailed
| IIncreaseVerticalScale
| IDecreaseVerticalScale
| ISaveCoreData
| ISaveCoreDataCompleted
| ISaveCoreDataFailed
| IGetCoreData
| IGetCoreDataCompleted
| IGetCoreDataFailed
| ISaveCurvesExpressions
| ISaveCurvesExpressionsCompleted
| ISaveCurvesExpressionsFailed
| IGetCurvesExpressions
| IGetCurvesExpressionsCompleted
| IGetCurvesExpressionsFailed
| IGetResearchData
| IGetResearchDataCompleted
| IGetResearchDataFailed
| IGetAndSaveScreenshot
| IGetAndSaveScreenshotCompleted
| IGetAndSaveScreenshotFailed
| ISaveRouteTimePoint
| ISaveRouteTimePointCompleted
| ISaveRouteTimePointFailed;
