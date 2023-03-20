import { IAppReduxState } from 'shared/types/app';

function selectState(state: IAppReduxState) {
  return state.authorization;
}

export function selectServerMessage(state: IAppReduxState): string {
  return selectState(state).data.serverMessage;
}

export function selectServerMessageStatus(state: IAppReduxState): number {
  return selectState(state).data.messageStatus;
}

export function selectToken(state: IAppReduxState): string {
  return selectState(state).data.token;
}

export function selectId(state: IAppReduxState): string {
  return selectState(state).data.id;
}

export function selectName(state: IAppReduxState): string {
  return selectState(state).data.name;
}

export function selectSurname(state: IAppReduxState): string {
  return selectState(state).data.surname;
}

export function selectSpeciality(state: IAppReduxState): string {
  return selectState(state).data.speciality;
}

export function selectCourse(state: IAppReduxState): string {
  return selectState(state).data.course;
}

export function selectExperience(state: IAppReduxState): number {
  return selectState(state).data.experience;
}

export function selectExpectations(state: IAppReduxState): string {
  return selectState(state).data.expectations;
}

export function selectEmail(state: IAppReduxState): string {
  return selectState(state).data.email;
}
