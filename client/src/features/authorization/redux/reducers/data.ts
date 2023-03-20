import * as NS from '../../namespace';
import { initial } from '../initial';

export function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action) {
  switch (action.type) {
    case 'AUTHORIZATION:LOGIN_USER': {
      const { email } = action.payload;
      return {
        ...state,
        email,
      };
    }

    case 'AUTHORIZATION:LOGIN_USER_COMPLETED': {
      return {
        ...state,
        ...action.payload,
      };
    }

    case 'AUTHORIZATION:LOGIN_USER_FAILED': {
      const { error } = action;
      const status = Number(error.match(/\d+/));
      if (status === 403) {
        return {
          ...state,
          serverMessage: 'Ваша учетная запись более не активна. Обратитесь к администратору. Your account is no longer active. Contact your administrator.',
          messageStatus: status,
        };
      }
      if (status >= 400 && status < 500) {
        return {
          ...state,
          serverMessage: 'Неверные учетные данные, либо пользователь с таким e-mail отсутствует.',
          messageStatus: status,
        };
      }
      if (status >= 500 && status < 600) {
        return {
          ...state,
          serverMessage: 'Внутренняя ошибка сервера. Internal server error.',
          messageStatus: status,
        };
      }
      return {
        ...state,
        serverMessage: '',
        messageStatus: 400,
      };
    }

    case 'AUTHORIZATION:CLEAR_MESSAGE': {
      return {
        ...state,
        serverMessage: '',
        messageStatus: 400,
      };
    }

    case 'AUTHORIZATION:LOGOUT': {
      return {
        serverMessage: '',
        messageStatus: 400,
        email: '',
        id: '',
        token: '',
        name: '',
        surname: '',
        speciality: '',
        course: '',
        experience: 0,
        expectations: '',
      };
    }

    default:
      return state;
  }
}
