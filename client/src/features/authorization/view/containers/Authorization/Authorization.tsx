import React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Redirect } from 'react-router-dom';
import { Loader } from 'consta-uikit-fork/Loader';

import { routes } from 'modules/routes';
import { IAppReduxState } from 'shared/types/app';
import { AuthForm } from 'shared/view/components';
import { actions as userActions, selectors as userSelectors } from 'services/user';
import { actionCreators as notificationActions } from 'services/notification';
import { withTranslation, ITranslationProps, tKeys } from 'services/i18n';

import { actions, selectors } from '../../../redux';
import './Authorization.scss';


interface IAuthData {
  email: string;
  password: string;
}

interface IStateProps {
  message: string;
  messageStatus: number;
  token: string;
  id: string;
  name: string;
  surname: string;
  speciality: string;
  course: string;
  experience: number;
  expectations: string;
  email: string;
  userId: string;
  userToken: string;
  time: string;
  isDownloadingResearchData: boolean;
  isDownloadingCalculatedCurves: boolean;
  isDownloadingCalculatedCurvesForTabs: boolean;
  isDownloadingFeaturesStates: boolean;
  isDownloadingCoreData: boolean;
}

type ActionProps = typeof mapDispatch;

type Props = IStateProps & ActionProps & ITranslationProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    message: selectors.selectServerMessage(state),
    messageStatus: selectors.selectServerMessageStatus(state),
    token: selectors.selectToken(state),
    id: selectors.selectId(state),
    email: selectors.selectEmail(state),
    name: selectors.selectName(state),
    surname: selectors.selectSurname(state),
    speciality: selectors.selectSpeciality(state),
    course: selectors.selectCourse(state),
    experience: selectors.selectExperience(state),
    expectations: selectors.selectExpectations(state),

    userId: userSelectors.selectUserId(state),
    userToken: userSelectors.selectUserToken(state),
    time: userSelectors.selectTime(state),
    isDownloadingResearchData: userSelectors.selectDownloadingResearchDataProcessStatus(state),
    isDownloadingCalculatedCurves: userSelectors
      .selectDownloadingCalculatedCurvesProcessStatus(state),
    isDownloadingCalculatedCurvesForTabs: userSelectors
      .selectDownloadingCalculatedCurvesForTabsProcessStatus(state),
    isDownloadingFeaturesStates: userSelectors.selectDownloadingFeaturesStatesProcessStatus(state),
    isDownloadingCoreData: userSelectors.selectDownloadingCoreDataProcessStatus(state),
  };
}

const mapDispatch = {
  loginUser: actions.loginUser,
  deleteDataFromFeatureState: actions.logoutUser,
  clearMessage: actions.clearMessage,

  getAllUserDataFromServer: userActions.getAllUserData,
  getUserAppPositionFromServer: userActions.getAppPosition,
  setUserDataForApp: userActions.setUserData,
  getTraceDataFromServer: userActions.getTraceData,
  getTabsStates: userActions.getTabsStates,
  getCalculatedCurves: userActions.getCalculatedCurvesData,
  getCalculatedCurvesForTabs: userActions.getCalculatedCurvesForTabData,
  getBasicParameters: userActions.getBasicParameters,
  getPassedPoints: userActions.getPassedPoints,
  setTokenAndTimeToSessionStorage: userActions.setTokenAndTimeToLocalStorage,
  getTokenAndTimeFromSessionStorage: userActions.getTokenAndTimeFromLocalStorage,
  getCoreData: userActions.getCoreData,
  getCurvesExpressions: userActions.getCurvesExpressions,
  getResearchData: userActions.getResearchData,
  deleteUserDataForApp: userActions.deleteUserData,
  clearSessionStorage: userActions.clearLocalStorage,

  setNotification: notificationActions.setNotification,
};

const b = block('authorization');
const { authorization: intl } = tKeys.features;

class AuthorizationComponent extends React.Component<Props> {
  public componentDidMount() {
    const { userToken, getTokenAndTimeFromSessionStorage } = this.props;
    if (userToken === '') {
      getTokenAndTimeFromSessionStorage();
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const {
      message,
      messageStatus,
      token,
      id,
      name,
      surname,
      speciality,
      course,
      experience,
      expectations,
      email,
      time,
      userToken,
      userId,
      isDownloadingResearchData,
      isDownloadingCalculatedCurves,
      isDownloadingCalculatedCurvesForTabs,
      isDownloadingFeaturesStates,
      isDownloadingCoreData,
      getUserAppPositionFromServer,
      getTraceDataFromServer,
      getTabsStates,
      getCalculatedCurves,
      getCalculatedCurvesForTabs,
      getBasicParameters,
      getPassedPoints,
      setUserDataForApp,
      deleteDataFromFeatureState,
      setNotification,
      clearMessage,
      setTokenAndTimeToSessionStorage,
      getAllUserDataFromServer,
      getCoreData,
      getCurvesExpressions,
      getResearchData,
      clearSessionStorage,
      deleteUserDataForApp,
    } = this.props;

    const twelveHoursInMilliseconds = 43200000;
    const isBigDataDownloaded = !isDownloadingResearchData && !isDownloadingCalculatedCurves
      && !isDownloadingCalculatedCurvesForTabs && !isDownloadingFeaturesStates
      && !isDownloadingCoreData;

    if (userToken !== '' && userId === '' && Number(new Date()) - Number(time) < twelveHoursInMilliseconds
      && isBigDataDownloaded) {
      getTabsStates(userToken);
      getTraceDataFromServer(userToken);
      getCalculatedCurves(userToken);
      getCalculatedCurvesForTabs(userToken);
      getBasicParameters(userToken);
      getPassedPoints(userToken);
      getCoreData(userToken);
      getCurvesExpressions(userToken);
      getUserAppPositionFromServer(userToken);
      getAllUserDataFromServer(userToken);
      getResearchData(userToken);
    }

    if (userToken !== '' && userId === '' && Number(new Date()) - Number(time) >= twelveHoursInMilliseconds
      && isBigDataDownloaded) {
      clearSessionStorage();
      deleteUserDataForApp();
    }

    if (token !== '' && id !== '' && isBigDataDownloaded) {
      setUserDataForApp({
        token,
        id,
        name,
        surname,
        speciality,
        course,
        experience,
        expectations,
        email,
      });
      setTokenAndTimeToSessionStorage({ token, time: String(Number(new Date())) });
      getTraceDataFromServer(token);
      getTabsStates(token);
      getCalculatedCurves(token);
      getCalculatedCurvesForTabs(token);
      getBasicParameters(token);
      getPassedPoints(token);
      getCoreData(token);
      getCurvesExpressions(token);
      getUserAppPositionFromServer(token);
      getResearchData(token);
      deleteDataFromFeatureState();
    }

    if (message !== '' && prevProps.message !== message) {
      setNotification({
        text: message,
        kind: messageStatus >= 200 && messageStatus < 300 ? 'success' : 'alert',
      });
      clearMessage();
    }
  }

  public render() {
    const { userToken, userId, isDownloadingResearchData, isDownloadingCalculatedCurves,
      isDownloadingCalculatedCurvesForTabs, isDownloadingFeaturesStates,
      isDownloadingCoreData, t } = this.props;
    const isBigDataDownloaded = !isDownloadingResearchData && !isDownloadingCalculatedCurves
      && !isDownloadingCalculatedCurvesForTabs && !isDownloadingFeaturesStates
      && !isDownloadingCoreData;

    return (
      <div className={b()}>
        <div className={b('wrap')}>
          {userToken !== '' && userId === '' && (
            <Loader />
          )}
          {userToken === '' && (
            <>
              <div className={b('caption')}>
                {t(intl.wellcomeMessage)}
              </div>
              <AuthForm
                t={t}
                onSubmitButtonClickHadler={this.onSubmitButtonClick}
              />
            </>
          )}
          {userToken !== '' && userId !== '' && isBigDataDownloaded && (
            <Redirect to={routes.profile.getRedirectPath()} />
          )}
        </div>
      </div>
    );
  }

  @autobind
  private onSubmitButtonClick(data: IAuthData): void {
    const { loginUser } = this.props;
    const { email, password } = data;
    loginUser({ email, password });
  }
}

const connectedComponent = connect<IStateProps, ActionProps, {}>(mapState,
  mapDispatch)(AuthorizationComponent);
const Authorization = withTranslation()(connectedComponent);

export { Authorization };
