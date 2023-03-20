import * as NS from '../../namespace';

export function logoutUser(): NS.ILogoutUser {
  return { type: 'AUTHORIZATION:LOGOUT' };
}

export function clearMessage(): NS.IClearMessage {
  return { type: 'AUTHORIZATION:CLEAR_MESSAGE' };
}
