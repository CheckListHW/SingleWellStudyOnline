import * as NS from '../../namespace';

export function setUserData(payload: NS.UserData) {
  return { type: 'APP:SET_USER_DATA', payload };
}

export function deleteUserData() {
  return { type: 'APP:DELETE_USER_DATA' };
}

export function setTokenAndTimeToLocalStorage(payload: { token: string, time: string }) {
  return { type: 'APP:SET_TOKEN_AND_TIME_TO_LOCAL_STORAGE', payload };
}

export function getTokenAndTimeFromLocalStorage() {
  return { type: 'APP:GET_TOKEN_AND_TIME_FROM_LOCAL_STORAGE' };
}

export function getTokenAndTimeFromLocalStorageCompleted(payload: { token: string, time: string }) {
  return { type: 'APP:GET_TOKEN_AND_TIME_FROM_LOCAL_STORAGE_COMPLETED', payload };
}

export function clearLocalStorage() {
  return { type: 'APP:CLEAR_LOCAL_STORAGE' };
}

export function increaseVerticalScale(payload: number) {
  return { type: 'APP:INCREASE_VERTICAL_SCALE', payload };
}

export function decreaseVerticalScale(payload: number) {
  return { type: 'APP:DECREASE_VERTICAL_SCALE', payload };
}

export function setAllUserAndAppData(payload: NS.IAllUserAndAppData) {
  return { type: 'APP:SET_ALL_USER_AND_APP_DATA', payload };
}
