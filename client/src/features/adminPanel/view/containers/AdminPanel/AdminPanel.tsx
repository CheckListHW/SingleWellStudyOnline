/* eslint-disable react/no-did-update-set-state */

import React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Table } from 'consta-uikit-fork/Table';
import { Button } from 'consta-uikit-fork/Button';
import { Text } from 'consta-uikit-fork/Text';
import { IconConnection } from 'consta-uikit-fork/IconConnection';
import { IconDocExport } from 'consta-uikit-fork/IconDocExport';
import { IconDownload } from 'consta-uikit-fork/IconDownload';

import { IAppReduxState } from 'shared/types/app';
import { RoutesTypes } from 'shared/types/routes';
import { AuthForm } from 'shared/view/components';
import { downloadFile } from 'shared/helpers';
import { IAllUserAndAppData } from 'shared/types/models';
import { actionCreators as notificationActions } from 'services/notification';
import { actions as userActions } from 'services/user';
import { withTranslation, ITranslationProps } from 'services/i18n';

import { AdminPanelHeaderBar } from './elements/AdminPanelHeaderBar/AdminPanelHeaderBar';
import { RemoveButton } from './elements/RemoveButton/RemoveButton';
import { ActivateCheckbox } from './elements/ActivateCheckbox/ActivateCheckbox';
import { ChangePasswordForm } from './elements/ChangePasswordForm/ChangePasswordForm';
import { RegistrateUserList } from './elements/RegistrateUserList/RegistrateUserList';
import { ChangeActiveUntilDateForm } from './elements/ChangeActiveUntilDateForm/ChangeActiveUntilDateForm';
import { ModalWindow } from './elements/ModalWindow/ModalWindow';
import { UploadDatasetForm } from './elements/UploadDatasetForm/UploadDatasetForm';
import { FindUserForm } from './elements/FindUserForm/FindUserForm';
import { MassChangeActivityForm } from './elements/MassChangeActivityForm/MassChangeActivityForm';
import { actions, selectors } from '../../../redux';
import { IUser, IDataset, IUsersListItem } from '../../../namespace';
import { USERS_COLUMNS, DATA_SETS_COLUMNS } from './constants';
import { RESEARCH_DATA } from './defaultResearchData';
import './AdminPanel.scss';


interface IAuthData {
  email: string;
  password: string;
}

interface IOwnProps {
  userTraceFeature: any;
  propsForTraceFeature: any[];
  onRedirectHandler(to: RoutesTypes): void;
}

interface IState {
  isModalOpen: boolean;
  currentAction: 'deleteUser' | 'changePassword' | 'registrateAll' | 'activateUser' | null;
  currentUserId: string;
  currentNewPassword: string;
  currentTab: number;
  currentPrefix: string;
  currentFromNumber: number;
  currentToNumber: number;
  currentMailServer: string;
  currentDateForRegistration: string;
  currentActivityDate: string;
  numberOfUsersToRegistrate: number;
  currentDatasetFileString: string;
  currentDatasetFileName: string;
  currentDatasetFileDescription: string;
  currentDatasetFileId: number;
  currentDatasetIdForUsers: number;
  searchingUserEmail: string;
}

interface IStateProps {
  message: string;
  messageStatus: number;
  adminEmail: string;
  adminId: string;
  adminToken: string;
  foundUsers: IUser[];
  registratedUsers: { email: string; orderNumber: number; }[];
  currentUserAllData: IAllUserAndAppData;
  datasetList: IDataset[];
  currentUserReportResponse: any;
  usersList: IUsersListItem[];
  isDeleting: { status: boolean; userId: string; };
  isPasswordChanging: { status: boolean; userId: string; };
  isActivityStatusChanging: { status: boolean; userId: string; };
  isGettingUserAllData: { status: boolean; userId: string; };
  isGettingUsersList: boolean;
  isGettingUsersReports: boolean;
  isUpdatingUserActivitiesByList: boolean;
}

type ActionProps = typeof mapDispatch;

type Props = IStateProps & ActionProps & ITranslationProps & IOwnProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    message: selectors.selectServerMessage(state),
    messageStatus: selectors.selectServerMessageStatus(state),
    adminToken: selectors.selectAdminToken(state),
    adminId: selectors.selectAdminId(state),
    adminEmail: selectors.selectAdminEmail(state),
    foundUsers: selectors.selectFoundUsers(state),
    registratedUsers: selectors.selectRegistratedUsers(state),
    isDeleting: selectors.selectDeletingProcessStatus(state),
    isPasswordChanging: selectors.selectPasswordChangingProcessStatus(state),
    isActivityStatusChanging: selectors.selectActivityChangingProcessStatus(state),
    isGettingUserAllData: selectors.selectGettingUserAllDataProcessStatus(state),
    currentUserAllData: selectors.selectUserAndAppAllData(state),
    datasetList: selectors.selectDatasetList(state),
    currentUserReportResponse: selectors.selectCurrentUserReportResponse(state),
    usersList: selectors.selectUsersList(state),
    isGettingUsersList: selectors.selectGettingUsersListProcessStatus(state),
    isGettingUsersReports: selectors.selectGettingUsersReportsProcessStatus(state),
    isUpdatingUserActivitiesByList: selectors.selectActivityChangingByListProcessStatus(state),
  };
}

const mapDispatch = {
  loginAdmin: actions.loginAdmin,
  logoutAdmin: actions.logoutAdmin,
  deleteUser: actions.deleteUser,
  changeUserPassword: actions.changeUserPassword,
  clearMessage: actions.clearMessage,
  registrateUsers: actions.registrateAllUsers,
  clearRegistratedUsers: actions.clearRegistratedUsers,
  findUsersOnServer: actions.findUsers,
  changeUserActivity: actions.changeUserActivity,
  changeUserActivityByUserList: actions.changeUserActivityByUserList,
  getUserAllDataFromServer: actions.getCurrentUserAllData,
  getDatasetListFromServer: actions.getDatasetList,
  saveDatasetOnServer: actions.saveDataset,
  removeDatasetFromServer: actions.removeDataset,
  getUsersReports: actions.getUsersReports,
  getUsersListFromServer: actions.getUsersList,

  deleteUserDataForApp: userActions.deleteUserData,
  saveAppPositionOnServer: userActions.saveAppPosition,
  clearSessionStorage: userActions.clearLocalStorage,
  setAllDataForCurrentUser: userActions.setAllUserAndAppData,

  setNotification: notificationActions.setNotification,
};

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth();
const day = currentDate.getDate();
const fileName = `registrations_${day}.${month + 1}.${year}.csv`;
const usersListFileName = `users_list_${day}.${month + 1}.${year}.csv`;
const b = block('admin-panel');

class AdminPanelComponent extends React.Component<Props, IState> {
  private userListForRegistration: { email: string; password: string;
    activeUntil: number; datasetId: number; }[] = [];

  public state = {
    isModalOpen: false,
    currentAction: null,
    currentUserId: '',
    currentNewPassword: '',
    currentTab: 0,
    currentPrefix: '',
    currentFromNumber: -1,
    currentToNumber: -1,
    currentMailServer: 'oilcase.ru',
    numberOfUsersToRegistrate: -1,
    currentDateForRegistration: '',
    currentActivityDate: '',
    currentDatasetFileString: '',
    currentDatasetFileName: '',
    currentDatasetFileDescription: '',
    currentDatasetFileId: 0,
    currentDatasetIdForUsers: 0,
    searchingUserEmail: '',
  };

  public componentDidUpdate(prevProps: Props, prevState: IState) {
    const {
      message,
      messageStatus,
      adminToken,
      isGettingUserAllData,
      currentUserAllData,
      currentUserReportResponse,
      usersList,
      isGettingUsersList,
      isUpdatingUserActivitiesByList,
      setNotification,
      clearMessage,
      setAllDataForCurrentUser,
      getDatasetListFromServer,
    } = this.props;

    const { currentTab } = this.state;

    if (message !== '' && prevProps.message !== message) {
      setNotification({
        text: message,
        kind: messageStatus >= 200 && messageStatus < 300 ? 'success' : 'alert',
      });
      clearMessage();
    }

    if (!isGettingUsersList && prevProps.isGettingUsersList) {
      const fileBodyString = usersList.reduce((acc, user) =>
        acc.concat(`${user.orderNumber};${user.email};${user.password};${user.datasetId};${new Date(user.activeUntil)};${user.isActive}\n`), ' №;EMAIL;PASSWORD;DATASET_ID;ACTIVE_UNTIL;IS_ACTIVE\n');
      downloadFile(usersListFileName, fileBodyString, 'text/csv');
    }

    if (!isGettingUserAllData.status
      && isGettingUserAllData.status !== prevProps.isGettingUserAllData.status) {
      setAllDataForCurrentUser(currentUserAllData);
      this.setState({ currentTab: 2 });
    }

    if (currentTab === 3 && prevState.currentTab !== currentTab) {
      getDatasetListFromServer(adminToken);
    }

    if (currentUserReportResponse && currentUserReportResponse !== prevProps.currentUserReportResponse) {
      const blob = new Blob([currentUserReportResponse], { type: "application/zip" });
      window.open(window.URL.createObjectURL(blob), '_blank');
    }

    if (!isUpdatingUserActivitiesByList
      && isUpdatingUserActivitiesByList !== prevProps.isUpdatingUserActivitiesByList) {
      this.onSearchButtonClick();
    }
  }

  public render() {
    const { adminToken, adminId, adminEmail, foundUsers, registratedUsers, isActivityStatusChanging,
      isDeleting, isPasswordChanging, userTraceFeature, propsForTraceFeature,
      isGettingUserAllData, datasetList, isGettingUsersList, isGettingUsersReports,
      isUpdatingUserActivitiesByList, onRedirectHandler, t } = this.props;
    const { isModalOpen, currentUserId, currentNewPassword, currentTab, currentPrefix,
      currentAction, currentFromNumber, currentToNumber, currentMailServer,
      currentDateForRegistration, numberOfUsersToRegistrate, currentActivityDate,
      currentDatasetFileName, currentDatasetFileDescription, currentDatasetFileId,
      currentDatasetIdForUsers, searchingUserEmail } = this.state;
    const menuItems = [
      {
        label: 'Пользователи',
        onClick: this.onUsersMenuItemClick,
        active: currentTab === 0,
      },
      {
        label: 'Добавление пользователей',
        onClick: this.onAddUserMenuItemClick,
        active: currentTab === 1,
      },
      {
        label: 'Наборы данных',
        onClick: this.onDataSetsMenuItemClick,
        active: currentTab === 3,
      },
    ];
    const Trace = userTraceFeature;
    const foundUsersRows = foundUsers.map((user, index) => ({
      num: index + 1,
      id: user.id,
      email: user.email,
      datasetId: user.datasetId,
      trace: (
        <Button
          onlyIcon
          iconLeft={IconConnection}
          size="xs"
          loading={user.id === isGettingUserAllData.userId && isGettingUserAllData.status}
          onClick={() => this.onUserTraceButtonClick(user.id)}
        />
      ),
      activeUntil: (
        <ChangeActiveUntilDateForm
          id={user.id}
          index={index + 1}
          date={user.activeUntil}
          isActive={user.isActive}
          isLoading={user.isActive && user.id === isActivityStatusChanging.userId
            && isActivityStatusChanging.status}
          onSubmit={this.onChangeActiveUntilDateFormSubmit}
        />
      ),
      isActive: (
        <ActivateCheckbox
          id={user.id}
          isActive={user.isActive}
          isLoading={user.id === isActivityStatusChanging.userId && isActivityStatusChanging.status}
          onChange={this.onActivateCheckboxChange}
        />
      ),
      changePasswordComponent: (
        <ChangePasswordForm
          id={user.id}
          index={index + 1}
          passwordInputValue={currentNewPassword}
          currentUserId={currentUserId}
          isLoading={user.id === isPasswordChanging.userId && isPasswordChanging.status}
          onInputChange={this.onNewPasswordInputChange}
          onSubmit={this.onChangePasswordButtonClick}
        />
      ),
      removeButton: (
        <RemoveButton
          id={user.id}
          isLoading={user.id === isDeleting.userId && isDeleting.status}
          onClick={this.onDeleteUserButtonClick}
        />),
    }));

    const datasetsRows = datasetList.map((currentDataset, index) => ({
      id: String(index),
      num: index + 1,
      datasetId: currentDataset.datasetId,
      description: currentDataset.description,
      downloadDate: String(new Date(currentDataset.downloadDate)),
      removeButton: (
        <RemoveButton
          id={String(currentDataset.datasetId)}
          disabled={currentDataset.datasetId === 0}
          onClick={() => this.onRemoveDatasetButtonClick(currentDataset.datasetId)}
        />),
    }));

    return (
      <div className={b()}>
        {adminToken === '' && (
          <div className={b('auth-form-wrap')}>
            <div className={b('auth-form-caption')}>
              Административная часть OilCase
            </div>
            <AuthForm
              t={t}
              onSubmitButtonClickHadler={this.onSubmitButtonClick}
            />
          </div>
        )}
        {adminToken !== '' && adminId !== '' && (
          <div className={b('content-wrap')}>
            <AdminPanelHeaderBar
              menuItems={menuItems}
              adminData={{ adminEmail }}
              t={t}
              onRedirectHandler={onRedirectHandler}
              onLogoutButtonClickHadler={this.onLogoutButtonClick}
            />
            {currentTab === 0 && (
              <>
                <div className={b('upper-wrap')}>
                  <FindUserForm
                    searchingUserEmail={searchingUserEmail}
                    onSearchingUserEmailInputChangeHandler={this.onSearchingUserEmailInputChange}
                    onSearchButtonClickHandler={this.onSearchButtonClick}
                  />
                  <div className={b('distance-wrap')}>
                    <Button
                      label="Скачать пользователей в платформе"
                      iconLeft={IconDownload}
                      size="xs"
                      loading={isGettingUsersList}
                      onClick={this.onDownloadAllUsersListButtonClick}
                    />
                  </div>
                  <div className={b('distance-wrap')}>
                    <Button
                      label="Скачать отчеты найденных"
                      iconLeft={IconDocExport}
                      iconRight={IconDownload}
                      size="xs"
                      loading={isGettingUsersReports}
                      onClick={this.onGetAllFoundUsersReportsButtonClick}
                    />
                  </div>
                  <div className={b('distance-wrap')}>
                    <MassChangeActivityForm
                      isLoading={isUpdatingUserActivitiesByList}
                      onSubmit={this.onMassChangeActivityFormSubmit}
                    />
                  </div>
                </div>
                <div className={b('table-wrap')}>
                  <Table
                    columns={USERS_COLUMNS}
                    rows={foundUsersRows}
                    emptyRowsPlaceholder={<Text>Здесь пока нет данных</Text>}
                    stickyHeader
                    isResizable
                    zebraStriped="odd"
                    size="s"
                  />
                </div>
              </>
            )}
            {currentTab === 1 && (
              <RegistrateUserList
                registratedUsers={registratedUsers}
                currentPrefix={currentPrefix}
                currentFromNumber={currentFromNumber}
                currentToNumber={currentToNumber}
                currentMailServer={currentMailServer}
                currentDateForRegistration={currentDateForRegistration}
                currentDatasetId={currentDatasetIdForUsers}
                numberOfUsersToRegistrate={numberOfUsersToRegistrate}
                onDatasetIdForUserRegistrateInputChangeHandler={this
                  .onDatasetIdForUserRegistrateInputChange}
                onPrefixInputChangeHandler={this.onPrefixInputChange}
                onFromNumberInputChangeHandler={this.onFromNumberInputChange}
                onToNumberInputChangeHandler={this.onToNumberInputChange}
                onMailServerInputChangeHandler={this.onMailServerInputChange}
                onRegistrationActiveUntilDateInputChangeHandler={this
                  .onRegistrationActiveUntilDateInputChange}
                onRegistrateAllButtonClickHandler={this.onRegistrateAllButtonClick}
                onDownloadRegistratedUsersListButtonClickHandler={this
                  .onDownloadRegistratedUsersListButtonClick}
              />
            )}
            {currentTab === 2 && (
              <Trace tabsFeatures={propsForTraceFeature} view="for-admin-panel" onRedirectHandler={onRedirectHandler} />
            )}
            {currentTab === 3 && (
              <div className={b('tab-content-wrapper')}>
                <UploadDatasetForm
                  fileName={currentDatasetFileName}
                  datasetId={currentDatasetFileId}
                  description={currentDatasetFileDescription}
                  onFileInputChangeHandler={this.onFileInputChange}
                  onDatasetDiscriptionInputChangeHandler={this.onDatasetDiscriptionInputChange}
                  onDatasetIdInputChangeHandler={this.onDatasetIdInputChange}
                  onDownloadDataSetButtonClickHandler={this.onDownloadDataSetButtonClick}
                />
                <div className={b('data-set-block-wrapper')}>
                  <Table
                    columns={DATA_SETS_COLUMNS}
                    rows={datasetsRows}
                    emptyRowsPlaceholder={<Text>Здесь пока нет данных</Text>}
                    stickyHeader
                    isResizable
                    zebraStriped="odd"
                    size="s"
                  />
                </div>
              </div>
            )}
          </div>
        )}
        <ModalWindow
          isModalOpen={isModalOpen}
          currentAction={currentAction}
          currentActivityDate={currentActivityDate}
          question="Вы уверены, что хотите выполнить это действие?"
          activateQuestion={'Вы уверены, что хотите активировать пользователя?'
            + ' Если уверены, укажите дату активности в поле ниже и нажмите "Да".'}
          onModalDateInputChangeHandler={this.onModalDateInputChange}
          onModalSubmitButtonClickHandler={this.onModalSubmitButtonClick}
          onModalCancelButtonClickHandler={this.onModalCancelButtonClick}
        />
      </div>
    );
  }

  @autobind
  private onDownloadRegistratedUsersListButtonClick(): void {
    const fileBodyString = this.userListForRegistration.reduce((acc, user, index) =>
      acc.concat(`${index + 1};${user.email};${user.password};${new Date(user.activeUntil)}\n`), ' №;EMAIL;PASSWORD;ACTIVE_UNTIL\n');
    downloadFile(fileName, fileBodyString, 'text/csv');
  }

  @autobind
  private onSearchingUserEmailInputChange(args: { value: string | null }): void {
    const { value } = args;
    this.setState({ searchingUserEmail: value ? value.replace(/[^0-9A-Za-z@\.\s]/g, '') : '' });
  }

  @autobind
  private onSearchButtonClick(): void {
    const { adminToken, findUsersOnServer } = this.props;
    const { searchingUserEmail } = this.state;
    findUsersOnServer ({ token: adminToken, userEmail: searchingUserEmail });
  }

  @autobind
  private onDownloadAllUsersListButtonClick(): void {
    const { adminToken, getUsersListFromServer } = this.props;
    getUsersListFromServer(adminToken);    
  }

  @autobind
  private onSubmitButtonClick(data: IAuthData): void {
    const { loginAdmin } = this.props;
    const { email, password } = data;
    loginAdmin({ email, password });
  }

  @autobind
  private onLogoutButtonClick(): void {
    const { deleteUserDataForApp, clearSessionStorage, logoutAdmin } = this.props;
    clearSessionStorage();
    deleteUserDataForApp();
    logoutAdmin();
  }

  @autobind
  private onModalDateInputChange(args: { value: string | null }): void {
    this.setState({
      currentActivityDate: args.value ? args.value : '',
    });
  }

  @autobind
  private onModalSubmitButtonClick(): void {
    const { currentAction, currentUserId, currentNewPassword, currentPrefix, currentMailServer,
      currentFromNumber, currentToNumber, currentDateForRegistration, currentActivityDate,
      currentDatasetIdForUsers } = this.state;
    const { adminToken, deleteUser, changeUserPassword, registrateUsers, changeUserActivity,
      setNotification } = this.props;

    if (currentAction === 'deleteUser') {
      deleteUser({ userId: currentUserId, token: adminToken });
    }

    if (currentAction === 'changePassword') {
      changeUserPassword({
        userId: currentUserId,
        token: adminToken,
        newPassword: currentNewPassword,
      });
    }

    if (currentAction === 'registrateAll') {
      const userListForRegistration = createUserList(currentPrefix, currentFromNumber,
        currentToNumber, currentMailServer, currentDateForRegistration, currentDatasetIdForUsers);
      this.userListForRegistration = userListForRegistration;
      this.setState({ numberOfUsersToRegistrate: userListForRegistration.length });
      registrateUsers({ token: adminToken, usersList: userListForRegistration });
    }

    if (currentAction === 'activateUser') {
      const activateUserDate = new Date(currentActivityDate);
      currentDate.setSeconds(activateUserDate.getSeconds() + (17 * 60 * 60 - 1));

      if ((Number(activateUserDate) - Number(new Date())) >= 0) {
        changeUserActivity({
          token: adminToken,
          userId: currentUserId,
          isActive: true,
          activeUntil: activateUserDate.getTime(),
        });
      } else {
        setNotification({
          text: 'Дата должна быть не раньше сегодняшней',
          kind: 'warning',
        });
      }
    }

    this.setState({ currentUserId: '', currentAction: null, isModalOpen: false });
  }

  @autobind
  private onModalCancelButtonClick(): void {
    this.setState({ currentUserId: '', currentAction: null, isModalOpen: false });
  }

  @autobind
  private onChangeActiveUntilDateFormSubmit(userId: string, date: string): void {
    const { adminToken, changeUserActivity, setNotification } = this.props;
    const nowDate = new Date(date);
    nowDate.setSeconds(nowDate.getSeconds() + (17 * 60 * 60 - 1));
    if ((Number(nowDate) - Number(new Date())) >= 0) {
      changeUserActivity({
        token: adminToken,
        userId,
        isActive: true,
        activeUntil: nowDate.getTime(),
      });
    } else {
      setNotification({
        text: 'Дата должна быть не раньше сегодняшней',
        kind: 'warning',
      });
    }
  }

  @autobind
  private onMassChangeActivityFormSubmit(date: string, isActive: boolean): void {
    const { adminToken, foundUsers, setNotification, changeUserActivityByUserList } = this.props;
    const nowDate = new Date(date);
    nowDate.setSeconds(nowDate.getSeconds() + (17 * 60 * 60 - 1));
    if ((Number(nowDate) - Number(new Date())) >= 0) {
      const userListForChangeActivity = foundUsers.map(user => ({
        userId: user.id,
        activeUntil: nowDate.getTime(),
        isActive,
      }));
      changeUserActivityByUserList({ userListForChangeActivity, token: adminToken });
    } else {
      setNotification({
        text: 'Дата должна быть не раньше сегодняшней',
        kind: 'warning',
      });
    }
  }

  @autobind
  private onActivateCheckboxChange(userId: string): void {
    const { foundUsers, adminToken, changeUserActivity } = this.props;
    const currentUser = foundUsers.find(user => user.id === userId);

    if (currentUser && currentUser.isActive) {
      changeUserActivity({
        token: adminToken,
        userId,
        isActive: false,
        activeUntil: currentUser.activeUntil,
      });
    } else {
      this.setState({ currentUserId: userId, currentAction: 'activateUser', isModalOpen: true });
    }
  }

  private onUserTraceButtonClick(userId: string) {
    const { adminToken, getUserAllDataFromServer } = this.props;
    getUserAllDataFromServer({ token: adminToken, userId });
  }

  @autobind
  private onDeleteUserButtonClick(userId: string): void {
    this.setState({ currentUserId: userId, currentAction: 'deleteUser', isModalOpen: true });
  }

  @autobind
  private onGetAllFoundUsersReportsButtonClick(): void {
    const { adminToken, foundUsers, getUsersReports } = this.props;
    const usersList = foundUsers.map(user => ({ userId: user.id, email: user.email }));
    getUsersReports({ usersList, token: adminToken });
  }

  @autobind
  private onChangePasswordButtonClick(userId: string): void {
    const { setNotification } = this.props;
    const { currentNewPassword } = this.state;
    if (currentNewPassword) {
      this.setState({ currentUserId: userId, currentAction: 'changePassword', isModalOpen: true });
    } else {
      setNotification({
        text: 'Надо задать не пустой пароль',
        kind: 'warning',
      });
    }
  }

  @autobind
  private onNewPasswordInputChange(args: { value: string | null }, userId: string): void {
    this.setState({
      currentUserId: userId,
      currentNewPassword: args.value ? args.value.replace(/[^0-9A-Za-z\s]/g, '') : '',
    });
  }

  @autobind
  private onRegistrateAllButtonClick(): void {
    const { clearRegistratedUsers, setNotification } = this.props;
    const { currentPrefix, currentMailServer,
      currentFromNumber, currentToNumber, currentDateForRegistration,
      currentDatasetIdForUsers } = this.state;
    const registrationDate = new Date(currentDateForRegistration);
    registrationDate.setSeconds(registrationDate.getSeconds() + (17 * 60 * 60 - 1));
    const isAllInputsValid = currentPrefix !== ''
      && currentMailServer !== ''
      && /\./.test(currentMailServer)
      && currentToNumber >= 0 && currentFromNumber >= 0
      && currentToNumber >= currentFromNumber
      && currentDateForRegistration !== ''
      && currentDatasetIdForUsers >= 0
      && (Number(registrationDate) - Number(new Date())) >= 0;
    if (isAllInputsValid) {
      clearRegistratedUsers();
      this.setState({ currentAction: 'registrateAll', isModalOpen: true });
    } else {
      setNotification({
        text: 'Поля заполнены неверно. Может быть одна из следующих проблем: 1. Поля не должны быть пустыми. 2. Числа'
          + ' должны быть либо равны, либо число "по" должно быть больше числа "с". 3. Сервер должен содержать минимум'
          + ' домен первого и второго уровня, разделенные точкой (пр. gmail.com, hw.tpu.ru). 4. Дата активности должна'
          + ' быть не раньше сегодняшней. 5. Номер набора данных целое число, больше нуля.',
        kind: 'warning',
      });
    }
  }

  @autobind
  private onDatasetIdForUserRegistrateInputChange(args: { value: string | null }): void {
    this.setState({ currentDatasetIdForUsers: args.value ? Number(args.value.replace(/[^0-9\s]/g, '')) : 0 });
  }

  @autobind
  private onPrefixInputChange(args: { value: string | null }): void {
    this.setState({ currentPrefix: args.value ? args.value.replace(/[^0-9a-z.\s]/g, '') : '' });
  }

  @autobind
  private onFromNumberInputChange(args: { value: string | null }): void {
    this.setState({ currentFromNumber: args.value ? Number(args.value.replace(/[^0-9\s]/g, '')) : -1 });
  }

  @autobind
  private onToNumberInputChange(args: { value: string | null }): void {
    this.setState({ currentToNumber: args.value ? Number(args.value.replace(/[^0-9\s]/g, '')) : -1 });
  }

  @autobind
  private onMailServerInputChange(args: { value: string | null }): void {
    this.setState({ currentMailServer: args.value ? args.value.replace(/[^0-9a-z.\s]/g, '') : '' });
  }

  @autobind
  private onRegistrationActiveUntilDateInputChange(args: { value: string | null }): void {
    this.setState({ currentDateForRegistration: args.value ? args.value : '' });
  }

  @autobind
  private onFileInputChange(event: any): void {
    const { setNotification } = this.props;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      if (reader.result) {
        this.setState({ currentDatasetFileString: String(reader.result),
          currentDatasetFileName: file.name });
        setNotification({
          text: 'Файл прочитан',
          kind: 'success',
        });
      }
    };
    reader.onerror = () => {
      this.setState({ currentDatasetFileString: '' });
      setNotification({
        text: 'Чтение файла не удалась',
        kind: 'alert',
      });
    };
  }

  @autobind
  private onDatasetDiscriptionInputChange(args: { value: string | null }): void {
    this.setState({ currentDatasetFileDescription: args.value ? args.value : '' });
  }

  @autobind
  private onDatasetIdInputChange(args: { value: string | null }): void {
    this.setState({ currentDatasetFileId: args.value && Number(args.value) >= 0
      && Number(args.value) < 1000000000000 ? Number(args.value) : 0 });
  }

  @autobind
  private onDownloadDataSetButtonClick(): void {
    const { adminToken, datasetList, saveDatasetOnServer, setNotification } = this.props;
    const { currentDatasetFileString, currentDatasetFileDescription, currentDatasetFileId,
      currentDatasetFileName } = this.state;
    const existDatasetIds = datasetList.map(dataset => dataset.datasetId);
    const isAllFieldsNotEmptyAndCorrect = currentDatasetFileName !== ''
      && /\.las$/.test(currentDatasetFileName) && currentDatasetFileDescription !== ''
      && currentDatasetFileId >= 0 && !existDatasetIds.includes(currentDatasetFileId);
    if (isAllFieldsNotEmptyAndCorrect) {
      const dataset = currentDatasetFileId === 0
        ? RESEARCH_DATA
        : getCurvesObjectFromFileString(currentDatasetFileString);
      saveDatasetOnServer({
        token: adminToken,
        dataset,
        datasetId: currentDatasetFileId,
        description: currentDatasetFileDescription,
      });
      this.setState({
        currentDatasetFileString: '',
        currentDatasetFileName: '',
        currentDatasetFileDescription: '',
        currentDatasetFileId: 0,
      });
    } else {
      setNotification({
        text: 'Некорректное заполнение полей: 1. Поля должны быть не пустыми 2. Файл должен'
          + ' быть только типа .las 3. Номер набора данных - не должен повторяться и'
          + ' является числом больше 0.',
        kind: 'warning',
      });
    }
  }

  private onRemoveDatasetButtonClick(datasetId: number): void {
    const { adminToken, removeDatasetFromServer } = this.props;
    removeDatasetFromServer({ token: adminToken, datasetId });
  }

  @autobind
  private onAddUserMenuItemClick(): void {
    const { deleteUserDataForApp, clearSessionStorage } = this.props;
    clearSessionStorage();
    deleteUserDataForApp();
    this.setState({ currentTab: 1 });
  }

  @autobind
  private onUsersMenuItemClick(): void {
    const { deleteUserDataForApp, clearSessionStorage } = this.props;
    clearSessionStorage();
    deleteUserDataForApp();
    this.setState({ currentTab: 0 });
  }

  @autobind
  private onDataSetsMenuItemClick(): void {
    this.setState({ currentTab: 3 });
  }
}

const createUserList = (prefix: string, from: number, to: number, server: string,
  validDate: string, datasetId: number):
{ email: string; password: string; activeUntil: number; datasetId: number; }[] => {
  const date = new Date(validDate);
  date.setSeconds(date.getSeconds() + (17 * 60 * 60 - 1));
  return Array(to - from + 1).fill(null).map((_item, index) =>
    ({
      email: `${prefix}${index + from}@${server}`,
      password: generatePassword(),
      activeUntil: date.getTime(),
      datasetId,
    }));
};

const generatePassword = (passwordLength: number = 8): string => {
	const charset = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const initialBuffer = Array(passwordLength).fill(null);
  const buffer = initialBuffer.map(() => charset.charAt(Math.floor(Math.random() * charset.length)));

  return ''.concat(...buffer);
}

const getCurvesObjectFromFileString = (fileString: string): { [key: string]: number[]} => {
  let i = 0;
  let isBeginData = false;
  let curvesObject: { [key: string]: number[]} = {};

  for (; i < fileString.length; i += 1) {
    const prevIndex = i;
    i = fileString.indexOf('\n', i) < 0 ? fileString.length : fileString.indexOf('\n', i);

    const line = fileString.substring(prevIndex, i);
    const lineCharactersArray = line.replace(/\s+/g, ' ').trim().split(' ');

    if (/^~A/.test(''.concat(...lineCharactersArray))) {
      isBeginData = true;
      curvesObject = lineCharactersArray
        .reduce((acc, item, id) => {
          if (id > 0) {
            return item === 'DEPT'
              ? { ...acc, ...{ DEPTH: [] } }
              : { ...acc, ...{ [item.toUpperCase()]: [] } };
          }
          return acc;
        }, {});
    } else if (isBeginData) {
      Object.keys(curvesObject)
        // eslint-disable-next-line no-loop-func
        .forEach((item, index) => curvesObject[item].push(Number(lineCharactersArray[index])));
    }
  }

  return curvesObject;
};

const connectedComponent = connect<IStateProps, ActionProps, {}>(mapState,
  mapDispatch)(AdminPanelComponent);
const AdminPanel = withTranslation()(connectedComponent);

export { AdminPanel };
