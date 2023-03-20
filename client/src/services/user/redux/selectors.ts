import { IAppReduxState } from 'shared/types/app';
import { IBasicParameter, ICurves, ICoreData } from 'shared/types/models';

import * as NS from '../namespace';

export function selectState(state: IAppReduxState) {
  return state.user;
}

export function selectUserName(state: IAppReduxState): string {
  return selectState(state).data.name;
}

export function selectUserToken(state: IAppReduxState): string {
  return selectState(state).data.token;
}

export function selectUserId(state: IAppReduxState): string {
  return selectState(state).data.id;
}

export function selectUserSurname(state: IAppReduxState): string {
  return selectState(state).data.surname;
}

export function selectUserSpeciality(state: IAppReduxState): string {
  return selectState(state).data.speciality;
}

export function selectUserCourse(state: IAppReduxState): string {
  return selectState(state).data.course;
}

export function selectUserExperience(state: IAppReduxState): number {
  return selectState(state).data.experience;
}

export function selectUserEmail(state: IAppReduxState): string {
  return selectState(state).data.email;
}

export function selectUserExpectations(state: IAppReduxState): string {
  return selectState(state).data.expectations;
}

export function selectUserTraceData(state: IAppReduxState): NS.ITraceItem[] {
  return selectState(state).data.traceData;
}

export function selectUserAppPosition(state: IAppReduxState): number {
  return selectState(state).data.appPosition;
}

export function selectUserServerMessage(state: IAppReduxState): string {
  return selectState(state).data.serverMessage;
}

export function selectUserMessageStatus(state: IAppReduxState): number {
  return selectState(state).data.messageStatus;
}

export function selectResearchData(state: IAppReduxState): ICurves {
  return selectState(state).data.researchData;
}

export function selectCalculatedCurves(state: IAppReduxState): ICurves {
  return selectState(state).data.calculatedCurves;
}

export function selectCalculatedCurvesForTab(state: IAppReduxState): { [key: string]: ICurves } {
  return selectState(state).data.calculatedCurvesForTabs;
}

export function selectBasicParameters(state: IAppReduxState): IBasicParameter[] {
  return selectState(state).data.basicParameters;
}

export function selectFeaturesStates(state: IAppReduxState):
{ [key: string]: { [key: string]: any } } {
  return selectState(state).data.featuresStates;
}

export function selectPassedPoints(state: IAppReduxState): string[] {
  return selectState(state).data.passedPoints;
}

export function selectTime(state: IAppReduxState): string {
  return selectState(state).data.time;
}

export function selectVerticalScale(state: IAppReduxState): number {
  return selectState(state).data.verticalScale;
}

export function selectCoreData(state: IAppReduxState): ICoreData[] {
  return selectState(state).data.coreData;
}

export function selectCurvesExpressions(state: IAppReduxState): { [key: string]: string } {
  return selectState(state).data.curvesExpressions;
}

export function selectSavingStateProcessStatus(state: IAppReduxState): boolean {
  return selectState(state).data.isSavingStateProcess;
}

export function selectDownloadingResearchDataProcessStatus(state: IAppReduxState): boolean {
  return selectState(state).data.isDownloadingResearchData;
}

export function selectDownloadingCalculatedCurvesProcessStatus(state: IAppReduxState): boolean {
  return selectState(state).data.isDownloadingCalculatedCurves;
}

// eslint-disable-next-line max-len
export function selectDownloadingCalculatedCurvesForTabsProcessStatus(state: IAppReduxState): boolean {
  return selectState(state).data.isDownloadingCalculatedCurvesForTabs;
}

export function selectDownloadingFeaturesStatesProcessStatus(state: IAppReduxState): boolean {
  return selectState(state).data.isDownloadingFeaturesStates;
}

export function selectDownloadingCoreDataProcessStatus(state: IAppReduxState): boolean {
  return selectState(state).data.isDownloadingCoreData;
}
