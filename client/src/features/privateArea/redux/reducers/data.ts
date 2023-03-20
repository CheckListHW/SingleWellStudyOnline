import * as NS from '../../namespace';
import { initial } from '../initial';

export function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action) {
  switch (action.type) {
    case 'PRIVATE_AREA:SAVE_PERSONAL_DATA_COMPLETED': {
      const { message, name, surname, speciality, course, experience,
        expectations } = action.payload;

      return {
        ...state,
        serverMessage: message,
        messageStatus: 200,
        name,
        surname,
        speciality,
        course,
        experience,
        expectations,
      };
    }

    case 'PRIVATE_AREA:SAVE_PERSONAL_DATA_FAILED': {
      const { error } = action;
      const status = Number(error.match(/\d+/));
      if (status >= 400 && status < 500) {
        return {
          ...state,
          serverMessage: 'Ошибка авторизации. Попробуйте еще раз. Authorisation Error. Try again.',
          messageStatus: status,
        };
      }
      if (status >= 500 && status < 600) {
        return {
          ...state,
          serverMessage: 'Ошибка на сервере, попробуйте еще раз позднее. Server error, please try again later.',
          messageStatus: status,
        };
      }
      return {
        ...state,
        serverMessage: '',
        messageStatus: 400,
      };
    }

    case 'PRIVATE_AREA:CLEAR_MESSAGE': {
      return {
        ...state,
        serverMessage: '',
        messageStatus: 400,
      };
    }

    default:
      return state;
  }
}
