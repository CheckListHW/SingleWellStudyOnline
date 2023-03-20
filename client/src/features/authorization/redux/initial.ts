import { IReduxState } from '../namespace';

const initial: IReduxState = {
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
  },
};

export { initial };
