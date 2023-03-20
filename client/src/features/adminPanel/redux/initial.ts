import { IReduxState } from '../namespace';

const initial: IReduxState = {
  data: {
    serverMessage: '',
    messageStatus: 400,
    adminToken: '',
    adminId: '',
    adminEmail: '',
    foundUsers: [],
    registratedUsers: [],
    currentUserAllData: {
      token: '',
      id: '',
      traceData: [],
      appPosition: 20,
      featuresStates: {},
      calculatedCurves: {},
      calculatedCurvesForTabs: {},
      basicParameters: [],
      passedPoints: [],
      coreData: [],
      curvesExpressions: {},
      researchData: {},
    },
    datasetList: [],
    currentUserReportResponse: null,
    usersList: [],
    isDeleting: { status: false, userId: '' },
    isPasswordChanging: { status: false, userId: '' },
    isActivityStatusChanging: { status: false, userId: '' },
    isGettingUserAllData: { status: false, userId: '' },
    isGettingUsersList: false,
    isGettingUsersReports: false,
    isUpdatingUserActivitiesByList: false,
  },
};

export { initial };
