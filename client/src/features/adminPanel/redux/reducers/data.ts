import * as NS from '../../namespace';
import { initial } from '../initial';

export function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action) {
  switch (action.type) {
    case 'ADMIN_PANEL:LOGIN_ADMIN_COMPLETED': {
      return {
        ...state,
        ...action.payload,
      };
    }

    case 'ADMIN_PANEL:LOGIN_ADMIN_FAILED': {
      const { error } = action;
      const status = Number(error.match(/\d+/));
      if (status >= 400 && status < 500) {
        return {
          ...state,
          serverMessage: 'Неверные учетные данные, либо админ с таким e-mail отсутствует',
          messageStatus: status,
        };
      }
      if (status >= 500 && status < 600) {
        return {
          ...state,
          serverMessage: 'Внутренняя ошибка сервера',
          messageStatus: status,
        };
      }
      return {
        ...state,
        serverMessage: '',
        messageStatus: 400,
      };
    }

    case 'ADMIN_PANEL:FIND_USERS_COMPLETED': {
      const { foundUsers } = action.payload;
      return {
        ...state,
        foundUsers,
      };
    }

    case 'ADMIN_PANEL:FIND_USERS_FAILED': {
      const { error } = action;
      const status = Number(error.match(/\d+/));
      if (status >= 400 && status < 500) {
        return {
          ...state,
          serverMessage: 'Пользователь(и) не найден(ы) либо не верные учетные данные',
          messageStatus: status,
          foundUsers: [],
        };
      }
      if (status >= 500 && status < 600) {
        return {
          ...state,
          serverMessage: 'Внутренняя ошибка сервера',
          messageStatus: status,
          foundUsers: [],
        };
      }
      return {
        ...state,
        serverMessage: '',
        messageStatus: 400,
        foundUsers: [],
      };
    }

    case 'ADMIN_PANEL:GET_USERS_LIST': {
      return {
        ...state,
        isGettingUsersList: true,
      };
    }

    case 'ADMIN_PANEL:GET_USERS_LIST_COMPLETED': {
      const { usersList } = action.payload;
      return {
        ...state,
        usersList,
        isGettingUsersList: false,
      };
    }

    case 'ADMIN_PANEL:GET_USERS_LIST_FAILED': {
      const { error } = action;
      const status = Number(error.match(/\d+/));
      if (status >= 400 && status < 500) {
        return {
          ...state,
          serverMessage: 'Неверная авторизация',
          messageStatus: status,
          isGettingUsersList: false,
        };
      }
      if (status >= 500 && status < 600) {
        return {
          ...state,
          serverMessage: 'Внутренняя ошибка сервера',
          messageStatus: status,
          isGettingUsersList: false,
        };
      }
      return {
        ...state,
        serverMessage: '',
        messageStatus: 400,
        isGettingUsersList: false,
      };
    }

    case 'ADMIN_PANEL:DELETE_USER': {
      const { userId } = action.payload;
      return {
        ...state,
        isDeleting: { status: true, userId },
      };
    }

    case 'ADMIN_PANEL:DELETE_USER_COMPLETED': {
      const { message, foundUsers } = action.payload;
      return {
        ...state,
        serverMessage: message,
        messageStatus: 200,
        foundUsers,
        isDeleting: { status: false, userId: '' },
      };
    }

    case 'ADMIN_PANEL:DELETE_USER_FAILED': {
      const { error } = action;
      const status = Number(error.match(/\d+/));
      if (status >= 400 && status < 500) {
        return {
          ...state,
          serverMessage: 'Неверная авторизация',
          messageStatus: status,
          isDeleting: { status: false, userId: '' },
        };
      }
      if (status >= 500 && status < 600) {
        return {
          ...state,
          serverMessage: 'Внутренняя ошибка сервера',
          messageStatus: status,
          isDeleting: { status: false, userId: '' },
        };
      }
      return {
        ...state,
        serverMessage: '',
        messageStatus: 400,
        isDeleting: { status: false, userId: '' },
      };
    }

    case 'ADMIN_PANEL:CHANGE_USER_PASSWORD': {
      const { userId } = action.payload;
      return {
        ...state,
        isPasswordChanging: { status: true, userId },
      };
    }

    case 'ADMIN_PANEL:CHANGE_USER_PASSWORD_COMPLETED': {
      const { message } = action.payload;
      return {
        ...state,
        serverMessage: message,
        messageStatus: 200,
        isPasswordChanging: { status: false, userId: '' },
      };
    }

    case 'ADMIN_PANEL:CHANGE_USER_PASSWORD_FAILED': {
      const { error } = action;
      const status = Number(error.match(/\d+/));
      if (status >= 400 && status < 500) {
        return {
          ...state,
          serverMessage: 'Неверная авторизация',
          messageStatus: status,
          isPasswordChanging: { status: false, userId: '' },
        };
      }
      if (status >= 500 && status < 600) {
        return {
          ...state,
          serverMessage: 'Внутренняя ошибка сервера',
          messageStatus: status,
          isPasswordChanging: { status: false, userId: '' },
        };
      }
      return {
        ...state,
        serverMessage: '',
        messageStatus: 400,
        isPasswordChanging: { status: false, userId: '' },
      };
    }

    case 'ADMIN_PANEL:REGISTRATE_ALL_USERS_CONTINUES': {
      return {
        ...state,
        registratedUsers: [...state.registratedUsers, action.payload],
      };
    }

    case 'ADMIN_PANEL:CLEAR_REGISTRATED_USERS': {
      return {
        ...state,
        registratedUsers: [],
      };
    }

    case 'ADMIN_PANEL:CHANGE_USER_ACTIVITY': {
      const { userId } = action.payload;
      return {
        ...state,
        isActivityStatusChanging: { status: true, userId },
      };
    }

    case 'ADMIN_PANEL:CHANGE_USER_ACTIVITY_COMPLETED': {
      const { message, foundUsers } = action.payload;
      return {
        ...state,
        serverMessage: message,
        messageStatus: 200,
        foundUsers,
        isActivityStatusChanging: { status: false, userId: '' },
      };
    }

    case 'ADMIN_PANEL:CHANGE_USER_ACTIVITY_FAILED': {
      const { error } = action;
      const status = Number(error.match(/\d+/));
      if (status >= 400 && status < 500) {
        return {
          ...state,
          serverMessage: 'Неверная авторизация',
          messageStatus: status,
          isActivityStatusChanging: { status: false, userId: '' },
        };
      }
      if (status >= 500 && status < 600) {
        return {
          ...state,
          serverMessage: 'Внутренняя ошибка сервера',
          messageStatus: status,
          isActivityStatusChanging: { status: false, userId: '' },
        };
      }
      return {
        ...state,
        serverMessage: '',
        messageStatus: 400,
        isActivityStatusChanging: { status: false, userId: '' },
      };
    }

    case 'ADMIN_PANEL:CHANGE_USER_ACTIVITY_BY_USER_LIST': {
      return {
        ...state,
        isUpdatingUserActivitiesByList: true,
      };
    }

    case 'ADMIN_PANEL:CHANGE_USER_ACTIVITY_BY_USER_LIST_COMPLETED': {
      const { message } = action.payload;
      return {
        ...state,
        serverMessage: message,
        messageStatus: 200,
        isUpdatingUserActivitiesByList: false,
      };
    }

    case 'ADMIN_PANEL:CHANGE_USER_ACTIVITY_BY_USER_LIST_FAILED': {
      return {
        ...state,
        isUpdatingUserActivitiesByList: false,
      };
    }

    case 'ADMIN_PANEL:GET_USER_AND_APP_ALL_DATA': {
      const { userId } = action.payload;
      return {
        ...state,
        isGettingUserAllData: { status: true, userId },
      };
    }

    case 'ADMIN_PANEL:GET_USER_AND_APP_ALL_DATA_COMPLETED': {
      return {
        ...state,
        currentUserAllData: action.payload,
        isGettingUserAllData: { status: false, userId: '' },
      };
    }

    case 'ADMIN_PANEL:GET_USER_AND_APP_ALL_DATA_FAILED': {
      const { error } = action;
      const status = Number(error.match(/\d+/));
      if (status >= 400 && status < 500) {
        return {
          ...state,
          serverMessage: 'Неверная авторизация',
          messageStatus: status,
          isGettingUserAllData: { status: false, userId: '' },
        };
      }
      if (status >= 500 && status < 600) {
        return {
          ...state,
          serverMessage: 'Внутренняя ошибка сервера',
          messageStatus: status,
          isGettingUserAllData: { status: false, userId: '' },
        };
      }
      return {
        ...state,
        serverMessage: '',
        messageStatus: 400,
        isGettingUserAllData: { status: false, userId: '' },
      };
    }

    case 'ADMIN_PANEL:GET_DATASET_LIST_COMPLETED':
    case 'ADMIN_PANEL:SAVE_DATASET_COMPLETED':
    case 'ADMIN_PANEL:REMOVE_DATASET_COMPLETED': {
      const { datasetList } = action.payload;
      return {
        ...state,
        datasetList,
      };
    }

    case 'ADMIN_PANEL:GET_DATASET_LIST_FAILED':
    case 'ADMIN_PANEL:SAVE_DATASET_FAILED':
    case 'ADMIN_PANEL:REMOVE_DATASET_FAILED': {
      const { error } = action;
      const status = Number(error.match(/\d+/));
      if (status >= 400 && status < 500) {
        return {
          ...state,
          serverMessage: 'Неверная авторизация',
          messageStatus: status,
        };
      }
      if (status >= 500 && status < 600) {
        return {
          ...state,
          serverMessage: 'Внутренняя ошибка сервера',
          messageStatus: status,
        };
      }
      return {
        ...state,
        serverMessage: '',
        messageStatus: 400,
      };
    }

    case 'ADMIN_PANEL:GET_USERS_REPORTS': {
      return {
        ...state,
        isGettingUsersReports: true,
      };
    }

    case 'ADMIN_PANEL:GET_USERS_REPORTS_COMPLETED': {
      const currentUserReportResponse = action.payload;
      return {
        ...state,
        currentUserReportResponse,
        isGettingUsersReports: false,
      };
    }

    case 'ADMIN_PANEL:GET_USERS_REPORTS_FAILED': {
      return {
        ...state,
        isGettingUsersReports: false,
      };
    }

    case 'ADMIN_PANEL:CLEAR_MESSAGE': {
      return {
        ...state,
        serverMessage: '',
        messageStatus: 400,
      };
    }

    case 'ADMIN_PANEL:LOGOUT_ADMIN': {
      return {
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
          appPosition: 0,
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
        isGettingUserAllData: { status: false, userId: '' },
        isActivityStatusChanging: { status: false, userId: '' },
        isGettingUsersList: false,
        isGettingUsersReports: false,
        isUpdatingUserActivitiesByList: false,
      };
    }

    default:
      return state;
  }
}
