import React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Redirect } from 'react-router-dom';
import { Tabs } from 'consta-uikit-fork/Tabs';
import { Modal } from 'consta-uikit-fork/Modal';

import { routes } from 'modules/routes';
import { IAppReduxState } from 'shared/types/app';
import { MainHeaderBar } from 'shared/view/components';
import { ANALOGUE_FIELD_SELECTION_ID, TABS_TRANSLATIONS_KEYS } from 'shared/constants';
import { ITraceItem } from 'shared/types/models';
import { selectors as userSelectors, actions as userActions } from 'services/user';
import { actionCreators as notificationActions } from 'services/notification';
import { actionCreators as buttonClickProviderActions } from 'services/buttonClickProvider';
import { getTabIndex } from 'shared/helpers';
import { withTranslation, ITranslationProps, tKeys } from 'services/i18n';

import './Trace.scss';


interface ISpecialItemsProps {
  ref: React.RefObject<HTMLButtonElement>;
  label: string;
  key: string | number;
  onChange(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

interface IElement {
  id: number;
  text: string;
}

interface IOwnProps {
  tabsFeatures: any[];
  view?: 'for-admin-panel';
  onRedirectHandler(to: string): void;
}

interface IStateProps {
  email: string;
  name: string;
  surname: string;
  speciality: string;
  course: string;
  experience: number;
  expectations: string;

  userToken: string;
  userTraceData: ITraceItem[];
  userAppPosition: number;
  featuresStates: {[key: string]: { [key: string]: any }};
  passedPoints: string[];

  verticalScale: number;
  isSavingStateProcessStatus: boolean;
}

interface IState {
  currentTabsValue: IElement;
  isCalcModalOpen: boolean;
  isDownloadModalOpen: boolean;
}

type ActionProps = typeof mapDispatch;

type Props = IStateProps & ActionProps & IOwnProps & ITranslationProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    email: userSelectors.selectUserEmail(state),
    name: userSelectors.selectUserName(state),
    surname: userSelectors.selectUserSurname(state),
    speciality: userSelectors.selectUserSpeciality(state),
    course: userSelectors.selectUserCourse(state),
    experience: userSelectors.selectUserExperience(state),
    expectations: userSelectors.selectUserExpectations(state),
    userToken: userSelectors.selectUserToken(state),
    userTraceData: userSelectors.selectUserTraceData(state),
    userAppPosition: userSelectors.selectUserAppPosition(state),
    featuresStates: userSelectors.selectFeaturesStates(state),
    passedPoints: userSelectors.selectPassedPoints(state),
    verticalScale: userSelectors.selectVerticalScale(state),
    isSavingStateProcessStatus: userSelectors.selectSavingStateProcessStatus(state),
  };
}

const mapDispatch = {
  getTraceDataFromServer: userActions.getTraceData,
  deleteUserDataForApp: userActions.deleteUserData,
  saveAppPositionOnServer: userActions.saveAppPosition,
  clearSessionStorage: userActions.clearLocalStorage,
  increseChartsVerticalScale: userActions.increaseVerticalScale,
  decreseChartsVerticalScale: userActions.decreaseVerticalScale,

  setButtonClickEvent: buttonClickProviderActions.setSaveButtonClickEvent,

  setNotification: notificationActions.setNotification,
};

const b = block('trace');
const { shared: sharedIntl, tabs: tabsIntl, warningMessages: warnIntl } = tKeys;

type Key = keyof typeof tabsIntl;

class TraceComponent extends React.Component<Props, IState> {
  public state = {
    currentTabsValue: {
      id: this.props.userTraceData.length !== 0 ? getTabIndex(this.props.userAppPosition) : 0,
      text: this.props.t(tabsIntl[TABS_TRANSLATIONS_KEYS[getTabIndex(this.props
        .userAppPosition)] as Key].altText),
    },
    isCalcModalOpen: false,
    isDownloadModalOpen: false,
  };

  public componentDidMount() {
    const { getTraceDataFromServer, userToken } = this.props;
    getTraceDataFromServer(userToken);
  }

  public render() {
    const { userToken, email, name, surname, speciality, course, experience,
      userTraceData, tabsFeatures, userAppPosition, verticalScale,
      isSavingStateProcessStatus, view, t } = this.props;
    const { currentTabsValue, isCalcModalOpen, isDownloadModalOpen } = this.state;
    const items = [
      {
        label: t(sharedIntl.profile),
        onClick: this.onProfileMenuItemClick,
      },
      {
        label: t(sharedIntl.traceBuild),
        onClick: this.onGoToBuildTraceMenuItemClick,
      },
      {
        label: t(sharedIntl.trace),
        active: true,
      },
    ];
    const tabsItems = userTraceData.map(item => {
      const key = TABS_TRANSLATIONS_KEYS[item.id];
      return { id: item.id, text: t(tabsIntl[key as Key].altText) };
    });
    const PenultimateFeature = tabsFeatures[tabsFeatures.length - 2];
    const LastFeature = tabsFeatures[tabsFeatures.length - 1];
    const tabIndex = String(getTabIndex(userAppPosition));

    return (
      <div className={b()}>
        {userToken === '' && (
          <Redirect to={routes.login.getRedirectPath()} />
        )}
        {userToken !== '' && (
          <div className={b('main-wrap')}>
            <div className={b('header-bar')}>
              <MainHeaderBar
                menuItems={items}
                personalData={{ email, name, surname, speciality, course, experience }}
                saving={isSavingStateProcessStatus}
                scale={`${verticalScale * 100}%`}
                t={t}
                onChangeScaleButtonClickHandler={this.onChangeVerticalScale}
                onLogoutButtonClickHadler={this.onLogoutButtonClick}
                onCalcButtonClickHandler={this.onCalculatorButtonClick}
                onDownloadButtonClickHandler={this.onDownloadButtonClick}
                onSaveButtonClickHadler={tabIndex === ANALOGUE_FIELD_SELECTION_ID
                  ? undefined : this.onSaveButtonClick}
              />
            </div>
            <div className={b('tabs')}>
              <Tabs
                value={currentTabsValue}
                onChange={this.onTabsChange}
                items={tabsItems}
                getLabel={item => item.text}
                size="s"
                renderItem={renderTabsItem}
              />
            </div>
            <div className={b('content', { view })}>
              {tabsFeatures.map((Feature, index) =>
                currentTabsValue.id === index && index !== tabsFeatures.length - 1 && (
                  <div className={b('content-tab')} key={index * 100}>
                    <Feature />
                  </div>
                ))}
            </div>
            <Modal
              isOpen={isCalcModalOpen}
              hasOverlay
              onOverlayClick={this.onModalOverlayClick}
            >
              <PenultimateFeature
                onCloseButtonClickHandler={this.onModalCloseButtonClick}
              />
            </Modal>
            <Modal
              isOpen={isDownloadModalOpen}
              hasOverlay
              onOverlayClick={this.onModalOverlayClick}
            >
              <LastFeature
                onCloseButtonClickHandler={this.onModalCloseButtonClick}
              />
            </Modal>
          </div>
        )}
      </div>
    );
  }

  @autobind
  private onChangeVerticalScale(type: 'increase' | 'decrease'): void {
    const { increseChartsVerticalScale, decreseChartsVerticalScale, verticalScale } = this.props;
    if (type === 'increase') {
      const newVerticalScale = (verticalScale + 0.5) > 10 ? 10 : verticalScale + 0.5;
      increseChartsVerticalScale(newVerticalScale);
    } else {
      const newVerticalScale = (verticalScale - 0.5) < 1 ? 1 : verticalScale - 0.5;
      decreseChartsVerticalScale(newVerticalScale);
    }
  }

  @autobind
  private onCalculatorButtonClick(): void {
    this.setState({ isCalcModalOpen: true, isDownloadModalOpen: false });
  }

  @autobind
  private onDownloadButtonClick(): void {
    this.setState({ isCalcModalOpen: false, isDownloadModalOpen: true });
  }

  @autobind
  private onModalCloseButtonClick(): void {
    this.setState({ isCalcModalOpen: false, isDownloadModalOpen: false });
  }

  @autobind
  private onModalOverlayClick(): void {
    this.setState({ isCalcModalOpen: false, isDownloadModalOpen: false });
  }

  @autobind
  private onTabsChange(args: { e: any, value: IElement; }): void {
    const { saveAppPositionOnServer, setNotification, userToken,
      userAppPosition, passedPoints, userTraceData, t } = this.props;
    const currentTabIndex = getTabIndex(userAppPosition);
    const isCurrentTabPassed = passedPoints.includes(String(currentTabIndex));
    const isTargetTabPassed = passedPoints.includes(String(args.value.id));
    const currentTabIndexInTrace = userTraceData
      .findIndex(tracePoint => currentTabIndex === tracePoint.id);
    const isTargetTabRightNeighbour = userTraceData[currentTabIndexInTrace + 1]
      && userTraceData[currentTabIndexInTrace + 1].id === args.value.id;
    const isNoUnpatchedTabsBeforeCurrent = userTraceData.slice(0, currentTabIndexInTrace)
      .reduce((acc, tracePoint) =>
        (passedPoints.includes(String(tracePoint.id)) ? acc : false), true);
    const targetTabIndexInTrace = userTraceData
      .findIndex(tracePoint => args.value.id === tracePoint.id);
    const isTargetTabFirstAfterAllPassed = userTraceData.slice(0, targetTabIndexInTrace)
      .reduce((acc, tracePoint) => {
        if (!passedPoints.includes(String(tracePoint.id))) {
          return false;
        }
        return acc;
      }, true);

    if ((isCurrentTabPassed && isTargetTabRightNeighbour && isNoUnpatchedTabsBeforeCurrent)
      || isTargetTabPassed
      || isTargetTabFirstAfterAllPassed
      || targetTabIndexInTrace === 0) {
      const appPosition = Number(`2${args.value.id}`);
      saveAppPositionOnServer({ appPosition, token: userToken });
      this.setState({ currentTabsValue: args.value });
    } else {
      setNotification({
        text: t(warnIntl.problemWithChangeTab),
        kind: 'warning',
        duration: 40,
      });
    }
  }

  @autobind
  private onSaveButtonClick(): void {
    const { setButtonClickEvent } = this.props;
    setButtonClickEvent();
  }

  @autobind
  private onLogoutButtonClick(): void {
    const { deleteUserDataForApp, clearSessionStorage } = this.props;
    clearSessionStorage();
    deleteUserDataForApp();
  }

  @autobind
  private onProfileMenuItemClick(): void {
    const { onRedirectHandler, saveAppPositionOnServer, userToken } = this.props;
    saveAppPositionOnServer({ appPosition: 0, token: userToken });
    onRedirectHandler('profile');
  }

  @autobind
  private onGoToBuildTraceMenuItemClick(): void {
    const { onRedirectHandler, saveAppPositionOnServer, userToken } = this.props;
    saveAppPositionOnServer({ appPosition: 1, token: userToken });
    onRedirectHandler('build-trace');
  }
}

const renderTabsItem = (props: ISpecialItemsProps) => {
  const { ref, label, onChange, key } = props;
  return (
    <button
      key={key}
      type="button"
      onClick={onChange}
      ref={ref}
      className="trace__tab"
    >
      {label}
    </button>
  );
};

const connectedComponent = connect<IStateProps, ActionProps, {}>(mapState,
  mapDispatch)(TraceComponent);
const Trace = withTranslation()(connectedComponent);

export { Trace };
