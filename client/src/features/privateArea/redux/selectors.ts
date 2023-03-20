import { IAppReduxState } from 'shared/types/app';

function selectState(state: IAppReduxState) {
  return state.privateArea;
}

export function selectServerMessage(state: IAppReduxState): string {
  return selectState(state).data.serverMessage;
}

export function selectServerMessageStatus(state: IAppReduxState): number {
  return selectState(state).data.messageStatus;
}

export function selectName(state: IAppReduxState): string {
  return selectState(state).data.name;
}

export function selectSurname(state: IAppReduxState): string {
  return selectState(state).data.surname;
}

export function selectSpecialty(state: IAppReduxState): string {
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
