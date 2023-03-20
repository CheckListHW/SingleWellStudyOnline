import React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Redirect } from 'react-router-dom';
import { Badge } from 'consta-uikit-fork/Badge';
import { Button } from 'consta-uikit-fork/Button';

import { routes } from 'modules/routes';
import { IAppReduxState } from 'shared/types/app';
import { PersonalDataForm, MainHeaderBar } from 'shared/view/components';
import { selectors as userSelectors, actions as userActions } from 'services/user';
import { actionCreators as notificationActions } from 'services/notification';
import { withTranslation, ITranslationProps, tKeys } from 'services/i18n';
import { IPersonalData, ITraceItem } from 'shared/types/models';

import { actions, selectors } from '../../../redux';
import './PrivateArea.scss';


interface IOwnProps {
  onRedirectHandler(to: string): void;
}

interface IStateProps {
  message: string;
  messageStatus: number;
  name: string;
  surname: string;
  speciality: string;
  course: string;
  experience: number;
  expectations: string;

  userToken: string;
  userId: string;
  userEmail: string;
  userName: string;
  userSurname: string;
  userSpeciality: string;
  userCourse: string;
  userExperience: number;
  userExpectations: string;
  userTraceData: ITraceItem[];
  userAppPosition: number;
}

type ActionProps = typeof mapDispatch;

type Props = IStateProps & ActionProps & IOwnProps & ITranslationProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    message: selectors.selectServerMessage(state),
    messageStatus: selectors.selectServerMessageStatus(state),
    name: selectors.selectName(state),
    surname: selectors.selectSurname(state),
    speciality: selectors.selectSpecialty(state),
    course: selectors.selectCourse(state),
    experience: selectors.selectExperience(state),
    expectations: selectors.selectExpectations(state),

    userToken: userSelectors.selectUserToken(state),
    userId: userSelectors.selectUserId(state),
    userEmail: userSelectors.selectUserEmail(state),
    userName: userSelectors.selectUserName(state),
    userSurname: userSelectors.selectUserSurname(state),
    userSpeciality: userSelectors.selectUserSpeciality(state),
    userCourse: userSelectors.selectUserCourse(state),
    userExperience: userSelectors.selectUserExperience(state),
    userExpectations: userSelectors.selectUserExpectations(state),
    userTraceData: userSelectors.selectUserTraceData(state),
    userAppPosition: userSelectors.selectUserAppPosition(state),
  };
}

const mapDispatch = {
  savePersonalDataOnServer: actions.savePersonalData,
  clearMessage: actions.clearMessage,

  deleteUserDataForApp: userActions.deleteUserData,
  setUserDataForApp: userActions.setUserData,
  saveAppPositionOnServer: userActions.saveAppPosition,
  clearSessionStorage: userActions.clearLocalStorage,
  saveRouteTimePoint: userActions.saveRouteTimePoint,

  setNotification: notificationActions.setNotification,
};

const b = block('private-area');
const { privateArea: intl } = tKeys.features;
const { shared: sharedIntl, warningMessages: warnIntl } = tKeys;

class PrivateAreaComponent extends React.Component<Props> {
  public componentDidUpdate(prevProps: Props) {
    const {
      message, messageStatus, clearMessage, setNotification,
      setUserDataForApp, userToken, userId, userEmail, name,
      surname, speciality, course, experience, expectations,
    } = this.props;

    if (message !== '' && prevProps.message !== message) {
      setNotification({
        text: message,
        kind: messageStatus >= 200 && messageStatus < 300 ? 'success' : 'alert',
      });
      clearMessage();
    }

    const userDataWasChanged = prevProps.name !== name
      || prevProps.surname !== surname
      || prevProps.speciality !== speciality
      || prevProps.course !== course
      || prevProps.experience !== experience
      || prevProps.expectations !== expectations;

    if (userDataWasChanged) {
      setUserDataForApp({
        token: userToken,
        id: userId,
        email: userEmail,
        name,
        surname,
        speciality,
        course,
        experience,
        expectations,
      });
    }
  }

  public render() {
    const { userToken, userEmail, userName, userSurname,
      userSpeciality, userCourse, userExperience, userExpectations,
      setNotification, userAppPosition, t } = this.props;
    const items = [
      {
        label: t(sharedIntl.profile),
        active: true,
      },
      {
        label: t(sharedIntl.traceBuild),
        onClick: this.onBuildTraceMenuItemClick,
      },
      {
        label: t(intl.trace),
        onClick: this.onGoToTraceMenuItemClick,
      },
    ];
    const userData = {
      email: userEmail,
      name: userName,
      surname: userSurname,
      speciality: userSpeciality,
      course: userCourse,
      experience: userExperience,
    };

    return (
      <div className={b()}>
        {userToken === '' && (
          <Redirect to={routes.login.getRedirectPath()} />
        )}
        {userToken !== '' && userAppPosition === 1 && (
          <Redirect to={routes['build-trace'].getRedirectPath()} />
        )}
        {userToken !== '' && userAppPosition > 1 && (
          <Redirect to={routes.trace.getRedirectPath()} />
        )}
        {userToken !== '' && (userAppPosition === 0 || userAppPosition === undefined) && (
          <div className={b('main-wrap')}>
            <MainHeaderBar
              menuItems={items}
              personalData={userData}
              onLogoutButtonClickHadler={this.onLogoutButtonClick}
              t={t}
            />
            <div className={b('content')}>
              <PersonalDataForm
                initData={{ ...userData, expectations: userExpectations }}
                onSavePersonalDataButtonClickHandler={this.onSavePersonalDataButtonClick}
                onWarningEventHandler={setNotification}
                t={t}
              />
              <div className={b('content-input-data')}>
                <div className={b('content-inner-wrapper')}>
                  <Badge label={t(intl.downloadHeader)} size="l" />
                </div>
                <a
                  className={b('content-link')}
                  href="https://disk.yandex.ru/d/9KlsbmbUo6IhXw"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Button
                    label={t(intl.download) as string}
                  />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  @autobind
  private onLogoutButtonClick(): void {
    const { deleteUserDataForApp, saveAppPositionOnServer,
      clearSessionStorage, userToken } = this.props;
    saveAppPositionOnServer({ appPosition: 0, token: userToken });
    clearSessionStorage();
    deleteUserDataForApp();
  }

  @autobind
  private onSavePersonalDataButtonClick(personalData: IPersonalData): void {
    const { savePersonalDataOnServer, userToken } = this.props;
    savePersonalDataOnServer({ ...personalData, token: userToken });
  }

  @autobind
  private onBuildTraceMenuItemClick(): void {
    const {
      userName, userToken, onRedirectHandler, setNotification,
      saveAppPositionOnServer, saveRouteTimePoint, t,
    } = this.props;
    if (userName !== '') {
      saveAppPositionOnServer({ appPosition: 1, token: userToken });
      saveRouteTimePoint({
        token: userToken,
        routeTimePoint: { tracePoint: '0', time: new Date().getTime() },
      });
      onRedirectHandler('build-trace');
    } else {
      setNotification({
        text: t(intl.needToFillUserInfo),
        kind: 'warning',
      });
    }
  }

  @autobind
  private onGoToTraceMenuItemClick(): void {
    const {
      onRedirectHandler, userName, userTraceData,
      setNotification, userToken, saveAppPositionOnServer, t,
    } = this.props;
    const isTraceNotBuilded = userTraceData.some(item => item.text === '');
    if (userName !== '' && !isTraceNotBuilded) {
      saveAppPositionOnServer({ appPosition: 20, token: userToken });
      onRedirectHandler('trace');
    } else if (userName !== '' && isTraceNotBuilded) {
      setNotification({
        text: t(warnIntl.needToBuildTrace),
        kind: 'warning',
      });
    } else if (userName === '' && isTraceNotBuilded) {
      setNotification({
        text: t(intl.needBoth),
        kind: 'warning',
      });
    }
  }
}

const connectedComponent = connect<IStateProps, ActionProps, {}>(mapState,
  mapDispatch)(PrivateAreaComponent);
const PrivateArea = withTranslation()(connectedComponent);

export { PrivateArea };
