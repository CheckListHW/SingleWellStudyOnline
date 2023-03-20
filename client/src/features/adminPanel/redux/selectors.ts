import { IAppReduxState } from 'shared/types/app';

import { IUser, IAllUserAndAppData, IDataset, IUsersListItem } from '../namespace';

function selectState(state: IAppReduxState) {
  return state.adminPanel;
}

export function selectAdminToken(state: IAppReduxState): string {
  return selectState(state).data.adminToken;
}

export function selectAdminId(state: IAppReduxState): string {
  return selectState(state).data.adminId;
}

export function selectAdminEmail(state: IAppReduxState): string {
  return selectState(state).data.adminEmail;
}

export function selectFoundUsers(state: IAppReduxState): IUser[] {
  return selectState(state).data.foundUsers;
}

export function selectServerMessage(state: IAppReduxState): string {
  return selectState(state).data.serverMessage;
}

export function selectServerMessageStatus(state: IAppReduxState): number {
  return selectState(state).data.messageStatus;
}

export function selectRegistratedUsers(state: IAppReduxState):
{ email: string; orderNumber: number; }[] {
  return selectState(state).data.registratedUsers;
}

export function selectUserAndAppAllData(state: IAppReduxState): IAllUserAndAppData {
  return selectState(state).data.currentUserAllData;
}

export function selectDatasetList(state: IAppReduxState): IDataset[] {
  return selectState(state).data.datasetList;
}

export function selectCurrentUserReportResponse(state: IAppReduxState): any {
  return selectState(state).data.currentUserReportResponse;
}

export function selectUsersList(state: IAppReduxState): IUsersListItem[] {
  return selectState(state).data.usersList;
}

export function selectDeletingProcessStatus(state: IAppReduxState):
{ status: boolean; userId: string; } {
  return selectState(state).data.isDeleting;
}

export function selectPasswordChangingProcessStatus(state: IAppReduxState):
{ status: boolean; userId: string; } {
  return selectState(state).data.isPasswordChanging;
}

export function selectActivityChangingProcessStatus(state: IAppReduxState):
{ status: boolean; userId: string; } {
  return selectState(state).data.isActivityStatusChanging;
}

export function selectActivityChangingByListProcessStatus(state: IAppReduxState): boolean {
  return selectState(state).data.isUpdatingUserActivitiesByList;
}

export function selectGettingUserAllDataProcessStatus(state: IAppReduxState):
{ status: boolean; userId: string; } {
  return selectState(state).data.isGettingUserAllData;
}

export function selectGettingUsersListProcessStatus(state: IAppReduxState): boolean {
  return selectState(state).data.isGettingUsersList;
}

export function selectGettingUsersReportsProcessStatus(state: IAppReduxState): boolean {
  return selectState(state).data.isGettingUsersReports;
}
