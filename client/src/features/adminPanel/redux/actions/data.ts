import * as NS from '../../namespace';

export function logoutAdmin(): NS.ILogoutAdmin {
  return { type: 'ADMIN_PANEL:LOGOUT_ADMIN' };
}

export function clearMessage(): NS.IClearMessage {
  return { type: 'ADMIN_PANEL:CLEAR_MESSAGE' };
}

export function registrateAllUsersContinues(payload:
{ email: string; orderNumber: number; }): NS.IRegistrateAllUsersСontinues {
  return { type: 'ADMIN_PANEL:REGISTRATE_ALL_USERS_CONTINUES', payload };
}

export function clearRegistratedUsers(): NS.IClearRegistratedUsers {
  return { type: 'ADMIN_PANEL:CLEAR_REGISTRATED_USERS' };
}
