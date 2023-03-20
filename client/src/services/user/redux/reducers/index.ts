import { combineReducers } from 'redux';

import { initial } from '../initial';
import * as NS from '../../namespace';

export function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action) {
  switch (action.type) {
    case 'APP:SET_USER_DATA': {
      return { ...state, ...action.payload };
    }

    case 'APP:SAVE_TRACE_DATA': {
      const { traceData } = action.payload;
      return { ...state, traceData };
    }

    case 'APP:SAVE_TRACE_DATA_COMPLETED': {
      const { message } = action.payload;
      return { ...state, serverMessage: message, messageStatus: 200 };
    }

    case 'APP:GET_TRACE_DATA_COMPLETED': {
      const { traceData } = action.payload;
      if (traceData.length === 0) {
        return state;
      }
      return { ...state, traceData };
    }

    case 'APP:GET_RESEARCH_DATA': {
      return { ...state, isDownloadingResearchData: true };
    }

    case 'APP:GET_RESEARCH_DATA_COMPLETED': {
      const { researchData } = action.payload;
      if (Object.keys(researchData).length === 0) {
        return { ...state, isDownloadingResearchData: false };
      }
      return { ...state, researchData, isDownloadingResearchData: false };
    }

    case 'APP:GET_RESEARCH_DATA_FAILED': {
      return { ...state, isDownloadingResearchData: false };
    }

    case 'APP:SAVE_APP_POSITION': {
      const { appPosition } = action.payload;
      return { ...state, appPosition };
    }

    case 'APP:SAVE_APP_POSITION_COMPLETED': {
      const { message } = action.payload;
      return { ...state, serverMessage: message, messageStatus: 200 };
    }

    case 'APP:GET_APP_POSITION_COMPLETED': {
      const { appPosition } = action.payload;
      return { ...state, appPosition };
    }

    case 'APP:DELETE_USER_DATA': {
      return {
        token: '',
        id: '',
        name: '',
        surname: '',
        speciality: '',
        course: '',
        experience: 0,
        expectations: '',
        email: '',
        traceData: [
          { id: 0, text: '' },
          { id: 1, text: '' },
          { id: 2, text: '' },
          { id: 3, text: '' },
          { id: 4, text: '' },
          { id: 5, text: '' },
          { id: 6, text: '' },
          { id: 7, text: '' },
          { id: 8, text: '' },
          { id: 9, text: '' },
          { id: 10, text: '' },
          { id: 11, text: '' },
        ],
        appPosition: 0,
        serverMessage: '',
        messageStatus: 400,
        researchData: {},
        calculatedCurves: {},
        calculatedCurvesForTabs: {},
        basicParameters: [],
        featuresStates: {},
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
      };
    }

    case 'APP:SAVE_CALCULATED_CURVES_DATA': {
      const { calculatedCurves } = action.payload;
      return { ...state, calculatedCurves };
    }

    case 'APP:GET_CALCULATED_CURVES_DATA_COMPLETED': {
      const { calculatedCurves } = action.payload;
      return { ...state, calculatedCurves: JSON.parse(calculatedCurves) };
    }

    case 'APP:SAVE_CALCULATED_CURVES_FOR_TAB_DATA': {
      const { calculatedCurvesForTabs } = action.payload;
      return { ...state, calculatedCurvesForTabs };
    }

    case 'APP:GET_CALCULATED_CURVES_FOR_TABS_DATA_COMPLETED': {
      const { calculatedCurvesForTabs } = action.payload;
      return { ...state, calculatedCurvesForTabs: JSON.parse(calculatedCurvesForTabs) };
    }

    case 'APP:SAVE_BASIC_PARAMETERS': {
      const { basicParameters } = action.payload;
      return { ...state, basicParameters };
    }

    case 'APP:GET_BASIC_PARAMETERS_COMPLETED': {
      const { basicParameters } = action.payload;
      return { ...state, basicParameters };
    }

    case 'APP:SAVE_TAB_STATE': {
      const { tabState } = action.payload;
      return { ...state, currentTabStateForSave: { ...tabState }, isSavingStateProcess: true };
    }

    case 'APP:SAVE_TAB_STATE_COMPLETED': {
      return {
        ...state,
        featuresStates: { ...state.featuresStates, ...state.currentTabStateForSave },
        isSavingStateProcess: false,
      };
    }

    case 'APP:SAVE_TAB_STATE_FAILED': {
      return { ...state, currentTabStateForSave: {}, isSavingStateProcess: false };
    }

    case 'APP:GET_TABS_STATES_COMPLETED': {
      const { tabStates } = action.payload;
      return { ...state, featuresStates: { ...state.featuresStates, ...JSON.parse(tabStates) } };
    }

    case 'APP:SAVE_PASSED_POINTS': {
      const { passedPoints } = action.payload;
      return { ...state, passedPoints };
    }

    case 'APP:GET_PASSED_POINTS_COMPLETED': {
      const { passedPoints } = action.payload;
      return { ...state, passedPoints };
    }

    case 'APP:GET_TOKEN_AND_TIME_FROM_LOCAL_STORAGE_COMPLETED': {
      const { token, time } = action.payload;
      return { ...state, token, time };
    }

    case 'APP:GET_ALL_USER_DATA_COMPLETED': {
      return { ...state, ...action.payload };
    }

    case 'APP:INCREASE_VERTICAL_SCALE': {
      return { ...state, verticalScale: action.payload };
    }

    case 'APP:DECREASE_VERTICAL_SCALE': {
      return { ...state, verticalScale: action.payload };
    }

    case 'APP:SAVE_CORE_DATA':
    case 'APP:GET_CORE_DATA_COMPLETED': {
      const { coreData } = action.payload;
      if (coreData.length !== 0) {
        return { ...state, coreData };
      }

      return state;
    }

    case 'APP:SAVE_CURVES_EXPRESSIONS':
    case 'APP:GET_CURVES_EXPRESSIONS_COMPLETED': {
      const { curvesExpressions } = action.payload;
      return { ...state, curvesExpressions };
    }

    case 'APP:SET_ALL_USER_AND_APP_DATA': {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
}

export const reducer = combineReducers<NS.IReduxState>({
  data: dataReducer,
});
